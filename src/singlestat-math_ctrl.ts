///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import './lib/flot/jquery.flot.gauge';
import 'jquery.flot.time';
import 'jquery.flot.crosshair';
import './css/panel_singlestatmath.css!';
import math from './lib/mathjs/math'

import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
import { MetricsPanelCtrl, PanelCtrl } from 'app/plugins/sdk';
//import { strict } from 'assert';

class SingleStatMathCtrl extends MetricsPanelCtrl {
  static templateUrl = 'public/plugins/blackmirror1-singlestat-math-panel/module.html';

  dataType = 'timeseries';
  series: any[];
  data: any;
  fontSizes: any[];
  unitFormats: any[];
  invalidGaugeRange: boolean;
  panel: any;
  events: any;
  valueNameOptions: any[] = [
    { value: 'min', text: 'Min' },
    { value: 'max', text: 'Max' },
    { value: 'avg', text: 'Average' },
    { value: 'current', text: 'Current' },
    { value: 'total', text: 'Total' },
    { value: 'name', text: 'Name' },
    { value: 'first', text: 'First' },
    { value: 'delta', text: 'Delta' },
    { value: 'diff', text: 'Difference' },
    { value: 'range', text: 'Range' },
    { value: 'last_time', text: 'Time of last point' },
  ];
  tableColumnOptions: any;
  thresholds: any[];

  // Set and populate defaults
  panelDefaults = {
    links: [],
    datasource: null,
    maxDataPoints: 100,
    interval: null,
    targets: [{}],
    cacheTimeout: null,
    defaultColor: 'rgb(117, 117, 117)',
    thresholds: '',
    format: 'none',
    sortOrder: 'asc',
    prefix: '',
    postfix: '',
    nullText: null,
    valueMaps: [{ value: 'null', op: '=', text: 'No data' }],
    mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
    rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
    mappingType: 1,
    nullPointMode: 'connected',
    valueName: 'avg',
    prefixFontSize: '50%',
    valueFontSize: '80%',
    postfixFontSize: '50%',
    math: '',
    colorBackground: false,
    circleBackground: false,
    valueMappingColorBackground: '#787879',
    colorValue: false,
    sparkline: {
      show: false,
      full: false,
      lineColor: 'rgb(31, 120, 193)',
      fillColor: 'rgba(31, 118, 189, 0.18)',
    },
    gauge: {
      show: false,
      minValue: 0,
      maxValue: 100,
      thresholdMarkers: true,
      thresholdLabels: false,
    },
    sortOrderOptions: [
      { value: 'asc', text: 'Ascending'},
      { value: 'desc', text: 'Descending'},
    ],
    tableColumn: '',
  };

  /** @ngInject */
  constructor($scope, $injector, private $location, private linkSrv) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    this.onSparklineColorChange = this.onSparklineColorChange.bind(this);
    this.onSparklineFillChange = this.onSparklineFillChange.bind(this);

    //Grab previous version thresholds and store into new format
    var t = this.panel.thresholds;
    if (typeof t === 'string' || t instanceof String) {
      this.oldThreshesChange(t);
    }
  }

  onInitEditMode() {
    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
    this.addEditorTab('Options', 'public/plugins/blackmirror1-singlestat-math-panel/editor.html', 2);
    this.addEditorTab('Value Mappings', 'public/plugins/blackmirror1-singlestat-math-panel/mappings.html', 3);
    this.unitFormats = kbn.getUnitFormats();
  }

  oldThreshesChange(threshes) {
    var array = JSON.parse("[" + threshes + "]");
    this.thresholds = []; //instantiate a new defined dictionary

    //push old items into new dictionary
    for (var i = 0; i < array.length; i++) {
      this.thresholds.push({
        color: this.panel.colors[i],
        value: Number(array[i]),
      });
    }

    //Overwrite JSON
    this.panel["thresholds"] = this.thresholds;
  }

  sortMyThreshes(control) {
    if(this.panel.sortOrder === 'asc') {
      control.panel.thresholds = _.orderBy(control.panel.thresholds, ["value"], ["asc"]);
    } else if (this.panel.sortOrder === 'desc') {
      control.panel.thresholds = _.orderBy(control.panel.thresholds, ["value"], ["desc"]);
    }
    this.$scope.ctrl.refresh();
  }

  setUnitFormat(subItem) {
    this.panel.format = subItem.value;
    this.refresh();
  }

  onDataError(err) {
    this.onDataReceived([]);
  }

  onEditorRemoveThreshold(index) {
    this.panel.thresholds.splice(index, 1)
    this.render();
  }

  onEditorAddThreshold() {
    this.panel.thresholds.push({color: this.panel.defaultColor})
    this.render();
  }

  onDataReceived(dataList) {
    const data: any = {};
    if (dataList.length > 0 && dataList[0].type === 'table') {
      this.dataType = 'table';
      const tableData = dataList.map(this.tableHandler.bind(this));
      this.setTableValues(tableData, data);
    } else {
      this.dataType = 'timeseries';
      this.series = dataList.map(this.seriesHandler.bind(this));
      this.setValues(data);
    }
    this.data = data;
    this.render();
  }

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints || [],
      alias: seriesData.target,
    });

    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

  tableHandler(tableData) {
    const datapoints = [];
    const columnNames = {};

    tableData.columns.forEach((column, columnIndex) => {
      columnNames[columnIndex] = column.text;
    });

    this.tableColumnOptions = columnNames;
    if (!_.find(tableData.columns, ['text', this.panel.tableColumn])) {
      this.setTableColumnToSensibleDefault(tableData);
    }

    tableData.rows.forEach(row => {
      const datapoint = {};

      row.forEach((value, columnIndex) => {
        const key = columnNames[columnIndex];
        datapoint[key] = value;
      });

      datapoints.push(datapoint);
    });

    return datapoints;
  }

  setTableColumnToSensibleDefault(tableData) {
    if (tableData.columns.length === 1) {
      this.panel.tableColumn = tableData.columns[0].text;
    } else {
      this.panel.tableColumn = _.find(tableData.columns, col => {
        return col.type !== 'time';
      }).text;
    }
  }

  setTableValues(tableData, data) {
    if (!tableData || tableData.length === 0) {
      return;
    }

    if (tableData[0].length === 0 || tableData[0][0][this.panel.tableColumn] === undefined) {
      return;
    }

    const datapoint = tableData[0][0];
    data.value = datapoint[this.panel.tableColumn];

    if (_.isString(data.value)) {
      data.valueFormatted = _.escape(data.value);
      data.value = 0;
      data.valueRounded = 0;
    } else {
      const decimalInfo = this.getDecimalsForValue(data.value);
      const formatFunc = kbn.valueFormats[this.panel.format];
      data.valueFormatted = formatFunc(
        datapoint[this.panel.tableColumn],
        decimalInfo.decimals,
        decimalInfo.scaledDecimals
      );
      data.valueRounded = kbn.roundValue(data.value, this.panel.decimals || 0);
    }

    this.setValueMapping(data);
  }

  canChangeFontSize() {
    return this.panel.gauge.show;
  }

  onSparklineColorChange(newColor) {
    this.panel.sparkline.lineColor = newColor;
    this.render();
  }

  onSparklineFillChange(newColor) {
    this.panel.sparkline.fillColor = newColor;
    this.render();
  }

  getDecimalsForValue(value) {
    if (_.isNumber(this.panel.decimals)) {
      return { decimals: this.panel.decimals, scaledDecimals: null };
    }

    var delta = value / 2;
    var dec = -Math.floor(Math.log(delta) / Math.LN10);

    var magn = Math.pow(10, -dec),
      norm = delta / magn, // norm is between 1.0 and 10.0
      size;

    if (norm < 1.5) {
      size = 1;
    } else if (norm < 3) {
      size = 2;
      // special case for 2.5, requires an extra decimal
      if (norm > 2.25) {
        size = 2.5;
        ++dec;
      }
    } else if (norm < 7.5) {
      size = 5;
    } else {
      size = 10;
    }

    size *= magn;

    // reduce starting decimals if not needed
    if (Math.floor(value) === value) {
      dec = 0;
    }

    var result: any = {};
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

    return result;
  }

  setValues(data) {
    data.flotpairs = [];

    if (this.series.length > 1 || this.panel.math.length) {
      let lastPoint = [];
      let lastValue = [];
      this.series.forEach((element, index) => {
        lastPoint[index] = _.last(element.datapoints);
        lastValue[index] = _.isArray(lastPoint[index]) ? lastPoint[index][0] : null;
      });

      if (this.panel.valueName === 'name') {
        data.value = 0;
        data.valueRounded = 0;
        data.valueFormatted = this.series[0].alias;

      } else if (_.isString(lastValue[0])) {
        data.value = 0;
        data.valueFormatted = _.escape(lastValue[0]);
        data.valueRounded = 0;
      } else if (this.panel.valueName === 'last_time') {
        let formatFunc = kbn.valueFormats[this.panel.format];
        data.value = lastPoint[0][1];
        data.valueRounded = data.value;
        data.valueFormatted = formatFunc(data.value, 0, 0);
      } else {
        if (this.panel.math.length){
          var mathFunction = this.panel.math;
          this.series.forEach(element => {
            mathFunction = mathFunction.replace(new RegExp(element.alias, 'gi'), String(element.stats[this.panel.valueName]));
          });
          try {
            mathFunction = mathFunction.replace(new RegExp('[A-za-z]+', 'gi'), String(0));
            data.value = math.eval(mathFunction);
            data.flotpairs = this.series[0].flotpairs;
          } catch (e) {
            //Error evaluating function. Defaulting to zero.
            data.value = 0;
            data.flotpairs = [0,0];
          }
        }
        else{
          data.value = this.series[0].stats[this.panel.valueName];
          data.flotpairs = this.series[0].flotpairs;
        }

        let decimalInfo = this.getDecimalsForValue(data.value);
        let formatFunc = kbn.valueFormats[this.panel.format];
        data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
      }

      // Add $__name variable for using in prefix or postfix
      if(this.series && this.series.length > 0){
        data.scopedVars = _.extend({}, this.panel.scopedVars);
        data.scopedVars['__name'] = { value: this.series[0].label };
      }

    }

    if (this.series && this.series.length > 0 && this.series.length < 2 && !this.panel.math.length) {
      let lastPoint = _.last(this.series[0].datapoints);
      let lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;

      if (this.panel.valueName === 'name') {
        data.value = 0;
        data.valueRounded = 0;
        data.valueFormatted = this.series[0].alias;
      } else if (_.isString(lastValue)) {
        data.value = 0;
        data.valueFormatted = _.escape(lastValue);
        data.valueRounded = 0;
      } else if (this.panel.valueName === 'last_time') {
        let formatFunc = kbn.valueFormats[this.panel.format];
        data.value = lastPoint[1];
        data.valueRounded = data.value;
        data.valueFormatted = formatFunc(data.value, 0, 0);
      } else {
        data.value = this.series[0].stats[this.panel.valueName];
        data.flotpairs = this.series[0].flotpairs;

        let decimalInfo = this.getDecimalsForValue(data.value);
        let formatFunc = kbn.valueFormats[this.panel.format];
        data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
      }

      // Add $__name variable for using in prefix or postfix
      data.scopedVars = _.extend({}, this.panel.scopedVars);
      data.scopedVars['__name'] = { value: this.series[0].label };
    }
    this.setValueMapping(data);
  }

  setValueMapping(data) {
    // check value to text mappings if its enabled
    if (this.panel.mappingType === 1) {
      for (let i = 0; i < this.panel.valueMaps.length; i++) {
        let map = this.panel.valueMaps[i];
        // special null case
        if (map.value === 'null') {
          if (data.value === null || data.value === void 0) {
            data.valueFormatted = map.text;
            return;
          }
          continue;
        }

        // value/number to text mapping
        var value = parseFloat(map.value);
        if (value === data.valueRounded) {
          data.valueFormatted = map.text;
          return;
        }
      }
    } else if (this.panel.mappingType === 2) {
      for (let i = 0; i < this.panel.rangeMaps.length; i++) {
        let map = this.panel.rangeMaps[i];
        // special null case
        if (map.from === 'null' && map.to === 'null') {
          if (data.value === null || data.value === void 0) {
            data.valueFormatted = map.text;
            return;
          }
          continue;
        }

        // value/number to range mapping
        var from = parseFloat(map.from);
        var to = parseFloat(map.to);
        if (to >= data.valueRounded && from <= data.valueRounded) {
          data.valueFormatted = map.text;
          return;
        }
      }
    }

    if (data.value === null || data.value === void 0) {
      data.valueFormatted = 'no value';
    }
  }

  removeValueMap(map) {
    var index = _.indexOf(this.panel.valueMaps, map);
    this.panel.valueMaps.splice(index, 1);
    this.render();
  }

  addValueMap() {
    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
  }

  removeRangeMap(rangeMap) {
    var index = _.indexOf(this.panel.rangeMaps, rangeMap);
    this.panel.rangeMaps.splice(index, 1);
    this.render();
  }

  addRangeMap() {
    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
  }

  link(scope, elem, attrs, ctrl) {
    var $location = this.$location;
    var linkSrv = this.linkSrv;
    var $timeout = this.$timeout;
    var panel = ctrl.panel;
    var templateSrv = this.templateSrv;
    var data, linkInfo;
    var $panelContainer = elem.find('.panel-container');
    elem = elem.find('.singlestatmath-panel');

    function applyColoringThresholds(value, valueString) {
      if (!panel.colorValue) {
        return valueString;
      }

      var color = getColorForValue(data, value);
      if (color) {
        return '<span></span>';
      }

      return valueString;
    }

    function getSpan(className, fontSize, value) {
      value = templateSrv.replace(value, data.scopedVars);
      return '<span class="' + className + '" style="font-size:' + fontSize + '">' + value + '</span>';
    }

    function getBigValueHtml() {
      var body = '<div class="singlestatmath-panel-value-container">';

      if (panel.prefix) {
        var prefix = applyColoringThresholds(data.value, panel.prefix);
        body += getSpan('singlestatmath-panel-prefix', panel.prefixFontSize, prefix);
      }

      var value = applyColoringThresholds(data.value, data.valueFormatted);
      body += getSpan('singlestatmath-panel-value', panel.valueFontSize, value);

      if (panel.postfix) {
        var postfix = applyColoringThresholds(data.value, panel.postfix);
        body += getSpan('singlestatmath-panel-postfix', panel.postfixFontSize, postfix);
      }

      body += '</div>';

      return body;
    }

    function getValueText() {
      var result = panel.prefix ? templateSrv.replace(panel.prefix, data.scopedVars) : '';
      result += data.valueFormatted;
      result += panel.postfix ? templateSrv.replace(panel.postfix, data.scopedVars) : '';

      return result;
    }

    function addGauge() {
      var width = elem.width();
      var height = elem.height();
      // Allow to use a bit more space for wide gauges
      var dimension = Math.min(width, height * 1.3);

      ctrl.invalidGaugeRange = false;
      if (panel.gauge.minValue > panel.gauge.maxValue) {
        ctrl.invalidGaugeRange = true;
        return;
      }

      var plotCanvas = $('<div></div>');
      var plotCss = {
        top: '10px',
        margin: 'auto',
        position: 'relative',
        height: height * 0.9 + 'px',
        width: dimension + 'px',
      };

      plotCanvas.css(plotCss);

      var thresholds = [];
      for (var i = 0; i < panel.thresholds.length; i++) {
        thresholds.push({
          value: panel.thresholds[i].value,
          color: panel.thresholds[i].color,
        });
      }
      thresholds.push({
        value: panel.gauge.maxValue,
        color: panel.thresholds[panel.thresholds.length - 1],
      });

      var bgColor = config.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';

      var fontScale = parseInt(panel.valueFontSize) / 100;
      var fontSize = Math.min(dimension / 5, 100) * fontScale;
      // Reduce gauge width if threshold labels enabled
      var gaugeWidthReduceRatio = panel.gauge.thresholdLabels ? 1.5 : 1;
      var gaugeWidth = Math.min(dimension / 6, 60) / gaugeWidthReduceRatio;
      var thresholdMarkersWidth = gaugeWidth / 5;
      var thresholdLabelFontSize = fontSize / 2.5;

      var options = {
        series: {
          gauges: {
            gauge: {
              min: panel.gauge.minValue,
              max: panel.gauge.maxValue,
              background: { color: bgColor },
              border: { color: null },
              shadow: { show: false },
              width: gaugeWidth,
            },
            frame: { show: false },
            label: { show: false },
            layout: { margin: 0, thresholdWidth: 0 },
            cell: { border: { width: 0 } },
            threshold: {
              values: thresholds,
              label: {
                show: panel.gauge.thresholdLabels,
                margin: thresholdMarkersWidth + 1,
                font: { size: thresholdLabelFontSize },
              },
              show: panel.gauge.thresholdMarkers,
              width: thresholdMarkersWidth,
            },
            value: {
              color: panel.colorValue ? getColorForValue(data, data.valueRounded) : null,
              formatter: function() {
                return getValueText();
              },
              font: {
                size: fontSize,
                family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              },
            },
            show: true,
          },
        },
      };

      elem.append(plotCanvas);

      var plotSeries = {
        data: [[0, data.valueRounded]],
      };

      $.plot(plotCanvas, [plotSeries], options);
    }

    function addSparkline() {
      var width = elem.width() + 20;
      if (width < 30) {
        // element has not gotten it's width yet
        // delay sparkline render
        setTimeout(addSparkline, 30);
        return;
      }

      var height = ctrl.height;
      var plotCanvas = $('<div></div>');
      var plotCss: any = {};
      plotCss.position = 'absolute';

      if (panel.sparkline.full) {
        plotCss.bottom = '5px';
        plotCss.left = '-5px';
        plotCss.width = width - 10 + 'px';
        var dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
        plotCss.height = height - dynamicHeightMargin + 'px';
      } else {
        plotCss.bottom = '0px';
        plotCss.left = '-5px';
        plotCss.width = width - 10 + 'px';
        plotCss.height = Math.floor(height * 0.25) + 'px';
      }

      plotCanvas.css(plotCss);

      var options = {
        legend: { show: false },
        series: {
          lines: {
            show: true,
            fill: 1,
            lineWidth: 1,
            fillColor: panel.sparkline.fillColor,
          },
        },
        yaxes: { show: false },
        xaxis: {
          show: false,
          mode: 'time',
          min: ctrl.range.from.valueOf(),
          max: ctrl.range.to.valueOf(),
        },
        grid: { hoverable: false, show: false },
      };

      elem.append(plotCanvas);

      var plotSeries = {
        data: data.flotpairs,
        color: panel.sparkline.lineColor,
      };

      $.plot(plotCanvas, [plotSeries], options);
    }

    function render() {
      if (!ctrl.data) {
        return;
      }
      data = ctrl.data;

      var body = panel.gauge.show ? '' : getBigValueHtml();
      var color = '';
      if (panel.colorBackground) {
        if (data.value == null) {
          color = panel.valueMappingColorBackground; //null or grey value
        } else {
          color = getColorForValue(panel.thresholds, data.value);
        }
        if (color) {
          $panelContainer.css('background-color', color);
          if (scope.fullscreen) {
            elem.css('background-color', color);
          } else {
            elem.css('background-color', '');
          }
        }
      } else {
        $panelContainer.css('background-color', '');
        elem.css('background-color', '');
        panel.circleBackground = false;
      }
      // Convert to Circle
      if (panel.circleBackground) {
        let circleHeight = $($panelContainer.height())[0] - 27;
        let circleWidth = $($panelContainer.width())[0];

        $($panelContainer).addClass('circle');
        $panelContainer.css('background-color', '');

        if (circleWidth >= circleHeight) {
          elem.css({
            'border-radius': 50 + '%',
            'width': circleHeight + 'px',
            'height': circleHeight + 'px',
            'background-color': color
          });
        } else {
          elem.css({
            'border-radius': 50 + '%',
            'width': circleWidth + 'px',
            'height': circleWidth + 'px',
            'background-color': color
          });
        }
      } else {
        $($panelContainer.removeClass('circle'));
        elem.css({ 'border-radius': '0', width: '', height: '' });
      }

      elem.html(body);

      if (panel.sparkline.show) {
        addSparkline();
      }

      if (panel.gauge.show) {
        addGauge();
      }

      elem.toggleClass('pointer', panel.links.length > 0);

      if (panel.links.length > 0) {
        linkInfo = linkSrv.getPanelLinkAnchorInfo(panel.links[0], data.scopedVars);
      } else {
        linkInfo = null;
      }
    }

    function hookupDrilldownLinkTooltip() {
      // drilldown link tooltip
      var drilldownTooltip = $('<div id="tooltip" class="">hello</div>"');

      elem.mouseleave(function() {
        if (panel.links.length === 0) {
          return;
        }
        $timeout(function() {
          drilldownTooltip.detach();
        });
      });

      elem.click(function(evt) {
        if (!linkInfo) {
          return;
        }
        // ignore title clicks in title
        if ($(evt).parents('.panel-header').length > 0) {
          return;
        }

        if (linkInfo.target === '_blank') {
          window.open(linkInfo.href, '_blank');
          return;
        }

        if (linkInfo.href.indexOf('http') === 0) {
          window.location.href = linkInfo.href;
        } else {
          $timeout(function() {
            $location.url(linkInfo.href);
          });
        }

        drilldownTooltip.detach();
      });

      elem.mousemove(function(e) {
        if (!linkInfo) {
          return;
        }

        drilldownTooltip.text('click to go to: ' + linkInfo.title);
        drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
      });
    }

    hookupDrilldownLinkTooltip();

    this.events.on('render', function() {
      render();
      ctrl.renderingCompleted();
    });
  }
}

function getColorForValue(thresholds, value) {
  let color = '';
  if (value === null) {
    return color;
  }
  for (let i = thresholds.length - 1; i >= 0; i--) {
    let aThreshold = thresholds[i];
    color = aThreshold.color;
      if (value >= aThreshold.value) {
        return aThreshold.color;
      }
  }
  return color;
}

export {SingleStatMathCtrl, SingleStatMathCtrl as PanelCtrl, getColorForValue}
// export { SingleStatCtrl, SingleStatCtrl as PanelCtrl, getColorForValue };

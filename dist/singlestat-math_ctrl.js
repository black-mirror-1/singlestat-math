System.register(["lodash", "jquery", "jquery.flot", "./lib/flot/jquery.flot.gauge", "jquery.flot.time", "jquery.flot.crosshair", "./css/panel_singlestatmath.css!", "./lib/mathjs/math", "app/core/utils/kbn", "app/core/config", "app/core/time_series2", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var lodash_1, jquery_1, math_1, kbn_1, config_1, time_series2_1, sdk_1, SingleStatMathCtrl;
    var __moduleName = context_1 && context_1.id;
    function getColorForValue(thresholds, value) {
        var color = '';
        if (value === null) {
            return color;
        }
        for (var i = thresholds.length - 1; i >= 0; i--) {
            var aThreshold = thresholds[i];
            color = aThreshold.color;
            if (value >= aThreshold.value) {
                return aThreshold.color;
            }
        }
        return color;
    }
    exports_1("getColorForValue", getColorForValue);
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (math_1_1) {
                math_1 = math_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            SingleStatMathCtrl = (function (_super) {
                __extends(SingleStatMathCtrl, _super);
                function SingleStatMathCtrl($scope, $injector, $location, linkSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$location = $location;
                    _this.linkSrv = linkSrv;
                    _this.dataType = 'timeseries';
                    _this.valueNameOptions = [
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
                    _this.panelDefaults = {
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
                            { value: 'asc', text: 'Ascending' },
                            { value: 'desc', text: 'Descending' },
                        ],
                        tableColumn: '',
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.onSparklineColorChange = _this.onSparklineColorChange.bind(_this);
                    _this.onSparklineFillChange = _this.onSparklineFillChange.bind(_this);
                    var t = _this.panel.thresholds;
                    if (typeof t === 'string' || t instanceof String) {
                        _this.oldThreshesChange(t);
                    }
                    return _this;
                }
                SingleStatMathCtrl.prototype.onInitEditMode = function () {
                    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
                    this.addEditorTab('Options', 'public/plugins/blackmirror1-singlestat-math-panel/editor.html', 2);
                    this.addEditorTab('Value Mappings', 'public/plugins/blackmirror1-singlestat-math-panel/mappings.html', 3);
                    this.unitFormats = kbn_1.default.getUnitFormats();
                };
                SingleStatMathCtrl.prototype.oldThreshesChange = function (threshes) {
                    var array = null;
                    try {
                        array = JSON.parse("[" + threshes + "]");
                    }
                    catch (err) {
                        console.log("JSON parse failed" + err.message);
                    }
                    if (array === null) {
                        array = threshes.split(",");
                    }
                    this.thresholds = [];
                    for (var i = 0; i < array.length; i++) {
                        var useColor = this.panel.defaultColor;
                        if (typeof this.panel.colors !== "undefined") {
                            if (i < this.panel.colors.length) {
                                useColor = this.panel.colors[i];
                            }
                        }
                        this.thresholds.push({
                            color: useColor,
                            value: Number(array[i]),
                        });
                    }
                    this.panel["thresholds"] = this.thresholds;
                };
                SingleStatMathCtrl.prototype.sortMyThreshes = function (control) {
                    if (this.panel.sortOrder === 'asc') {
                        control.panel.thresholds = lodash_1.default.orderBy(control.panel.thresholds, ["value"], ["asc"]);
                    }
                    else if (this.panel.sortOrder === 'desc') {
                        control.panel.thresholds = lodash_1.default.orderBy(control.panel.thresholds, ["value"], ["desc"]);
                    }
                    this.$scope.ctrl.refresh();
                };
                SingleStatMathCtrl.prototype.setUnitFormat = function (subItem) {
                    this.panel.format = subItem.value;
                    this.refresh();
                };
                SingleStatMathCtrl.prototype.onDataError = function (err) {
                    this.onDataReceived([]);
                };
                SingleStatMathCtrl.prototype.onEditorRemoveThreshold = function (index) {
                    this.panel.thresholds.splice(index, 1);
                    this.render();
                };
                SingleStatMathCtrl.prototype.onEditorAddThreshold = function () {
                    this.panel.thresholds.push({ color: this.panel.defaultColor });
                    this.render();
                };
                SingleStatMathCtrl.prototype.onDataReceived = function (dataList) {
                    var data = {};
                    if (dataList.length > 0 && dataList[0].type === 'table') {
                        this.dataType = 'table';
                        var tableData = dataList.map(this.tableHandler.bind(this));
                        this.setTableValues(tableData, data);
                    }
                    else {
                        this.dataType = 'timeseries';
                        this.series = dataList.map(this.seriesHandler.bind(this));
                        this.setValues(data);
                    }
                    this.data = data;
                    this.render();
                };
                SingleStatMathCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new time_series2_1.default({
                        datapoints: seriesData.datapoints || [],
                        alias: seriesData.target,
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    return series;
                };
                SingleStatMathCtrl.prototype.tableHandler = function (tableData) {
                    var datapoints = [];
                    var columnNames = {};
                    tableData.columns.forEach(function (column, columnIndex) {
                        columnNames[columnIndex] = column.text;
                    });
                    this.tableColumnOptions = columnNames;
                    if (!lodash_1.default.find(tableData.columns, ['text', this.panel.tableColumn])) {
                        this.setTableColumnToSensibleDefault(tableData);
                    }
                    tableData.rows.forEach(function (row) {
                        var datapoint = {};
                        row.forEach(function (value, columnIndex) {
                            var key = columnNames[columnIndex];
                            datapoint[key] = value;
                        });
                        datapoints.push(datapoint);
                    });
                    return datapoints;
                };
                SingleStatMathCtrl.prototype.setTableColumnToSensibleDefault = function (tableData) {
                    if (tableData.columns.length === 1) {
                        this.panel.tableColumn = tableData.columns[0].text;
                    }
                    else {
                        this.panel.tableColumn = lodash_1.default.find(tableData.columns, function (col) {
                            return col.type !== 'time';
                        }).text;
                    }
                };
                SingleStatMathCtrl.prototype.setTableValues = function (tableData, data) {
                    if (!tableData || tableData.length === 0) {
                        return;
                    }
                    if (tableData[0].length === 0 || tableData[0][0][this.panel.tableColumn] === undefined) {
                        return;
                    }
                    var datapoint = tableData[0][0];
                    data.value = datapoint[this.panel.tableColumn];
                    if (lodash_1.default.isString(data.value)) {
                        data.valueFormatted = lodash_1.default.escape(data.value);
                        data.value = 0;
                        data.valueRounded = 0;
                    }
                    else {
                        var decimalInfo = this.getDecimalsForValue(data.value);
                        var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                        data.valueFormatted = formatFunc(datapoint[this.panel.tableColumn], decimalInfo.decimals, decimalInfo.scaledDecimals);
                        data.valueRounded = kbn_1.default.roundValue(data.value, this.panel.decimals || 0);
                    }
                    this.setValueMapping(data);
                };
                SingleStatMathCtrl.prototype.canChangeFontSize = function () {
                    return this.panel.gauge.show;
                };
                SingleStatMathCtrl.prototype.onSparklineColorChange = function (newColor) {
                    this.panel.sparkline.lineColor = newColor;
                    this.render();
                };
                SingleStatMathCtrl.prototype.onSparklineFillChange = function (newColor) {
                    this.panel.sparkline.fillColor = newColor;
                    this.render();
                };
                SingleStatMathCtrl.prototype.getDecimalsForValue = function (value) {
                    if (lodash_1.default.isNumber(this.panel.decimals)) {
                        return { decimals: this.panel.decimals, scaledDecimals: null };
                    }
                    var delta = value / 2;
                    var dec = -Math.floor(Math.log(delta) / Math.LN10);
                    var magn = Math.pow(10, -dec), norm = delta / magn, size;
                    if (norm < 1.5) {
                        size = 1;
                    }
                    else if (norm < 3) {
                        size = 2;
                        if (norm > 2.25) {
                            size = 2.5;
                            ++dec;
                        }
                    }
                    else if (norm < 7.5) {
                        size = 5;
                    }
                    else {
                        size = 10;
                    }
                    size *= magn;
                    if (Math.floor(value) === value) {
                        dec = 0;
                    }
                    var result = {};
                    result.decimals = Math.max(0, dec);
                    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
                    return result;
                };
                SingleStatMathCtrl.prototype.setValues = function (data) {
                    var _this = this;
                    data.flotpairs = [];
                    if (this.series.length > 1 || this.panel.math.length) {
                        var lastPoint_1 = [];
                        var lastValue_1 = [];
                        this.series.forEach(function (element, index) {
                            lastPoint_1[index] = lodash_1.default.last(element.datapoints);
                            lastValue_1[index] = lodash_1.default.isArray(lastPoint_1[index]) ? lastPoint_1[index][0] : null;
                        });
                        if (this.panel.valueName === 'name') {
                            data.value = 0;
                            data.valueRounded = 0;
                            data.valueFormatted = this.series[0].alias;
                        }
                        else if (lodash_1.default.isString(lastValue_1[0])) {
                            data.value = 0;
                            data.valueFormatted = lodash_1.default.escape(lastValue_1[0]);
                            data.valueRounded = 0;
                        }
                        else if (this.panel.valueName === 'last_time') {
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.value = lastPoint_1[0][1];
                            data.valueRounded = data.value;
                            data.valueFormatted = formatFunc(data.value, 0, 0);
                        }
                        else {
                            if (this.panel.math.length) {
                                var mathFunction = this.templateSrv.replace(this.panel.math, data.scopedVars);
                                this.series.forEach(function (element) {
                                    mathFunction = mathFunction.replace(new RegExp(element.alias, 'gi'), String(element.stats[_this.panel.valueName]));
                                });
                                try {
                                    mathFunction = mathFunction.replace(new RegExp('[A-za-z]+', 'gi'), String(0));
                                    data.value = math_1.default.eval(mathFunction);
                                    data.flotpairs = this.series[0].flotpairs;
                                }
                                catch (e) {
                                    data.value = 0;
                                    data.flotpairs = [0, 0];
                                }
                            }
                            else {
                                data.value = this.series[0].stats[this.panel.valueName];
                                data.flotpairs = this.series[0].flotpairs;
                            }
                            var decimalInfo = this.getDecimalsForValue(data.value);
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                            data.valueRounded = kbn_1.default.roundValue(data.value, decimalInfo.decimals);
                        }
                        if (this.series && this.series.length > 0) {
                            data.scopedVars = lodash_1.default.extend({}, this.panel.scopedVars);
                            data.scopedVars['__name'] = { value: this.series[0].label };
                        }
                    }
                    if (this.series && this.series.length > 0 && this.series.length < 2 && !this.panel.math.length) {
                        var lastPoint = lodash_1.default.last(this.series[0].datapoints);
                        var lastValue = lodash_1.default.isArray(lastPoint) ? lastPoint[0] : null;
                        if (this.panel.valueName === 'name') {
                            data.value = 0;
                            data.valueRounded = 0;
                            data.valueFormatted = this.series[0].alias;
                        }
                        else if (lodash_1.default.isString(lastValue)) {
                            data.value = 0;
                            data.valueFormatted = lodash_1.default.escape(lastValue);
                            data.valueRounded = 0;
                        }
                        else if (this.panel.valueName === 'last_time') {
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.value = lastPoint[1];
                            data.valueRounded = data.value;
                            data.valueFormatted = formatFunc(data.value, 0, 0);
                        }
                        else {
                            data.value = this.series[0].stats[this.panel.valueName];
                            data.flotpairs = this.series[0].flotpairs;
                            var decimalInfo = this.getDecimalsForValue(data.value);
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                            data.valueRounded = kbn_1.default.roundValue(data.value, decimalInfo.decimals);
                        }
                        data.scopedVars = lodash_1.default.extend({}, this.panel.scopedVars);
                        data.scopedVars['__name'] = { value: this.series[0].label };
                    }
                    this.setValueMapping(data);
                };
                SingleStatMathCtrl.prototype.setValueMapping = function (data) {
                    if (this.panel.mappingType === 1) {
                        for (var i = 0; i < this.panel.valueMaps.length; i++) {
                            var map = this.panel.valueMaps[i];
                            if (map.value === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
                            var value = parseFloat(map.value);
                            if (value === data.valueRounded) {
                                data.valueFormatted = map.text;
                                return;
                            }
                        }
                    }
                    else if (this.panel.mappingType === 2) {
                        for (var i = 0; i < this.panel.rangeMaps.length; i++) {
                            var map = this.panel.rangeMaps[i];
                            if (map.from === 'null' && map.to === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
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
                };
                SingleStatMathCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                SingleStatMathCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
                };
                SingleStatMathCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                SingleStatMathCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
                };
                SingleStatMathCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
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
                        var color = getColorForValue(panel.thresholds, data.value);
                        if (data.value == null) {
                            color = panel.valueMappingColorBackground;
                        }
                        if (color) {
                            return '<span style="color:' + color + '">' + valueString + '</span>';
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
                        var dimension = Math.min(width, height * 1.3);
                        ctrl.invalidGaugeRange = false;
                        if (panel.gauge.minValue > panel.gauge.maxValue) {
                            ctrl.invalidGaugeRange = true;
                            return;
                        }
                        var plotCanvas = jquery_1.default('<div></div>');
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
                        var bgColor = config_1.default.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';
                        var fontScale = parseInt(panel.valueFontSize) / 100;
                        var fontSize = Math.min(dimension / 5, 100) * fontScale;
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
                                        color: panel.colorValue ? getColorForValue(panel.thresholds, data.valueRounded) : null,
                                        formatter: function () {
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
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
                    }
                    function addSparkline() {
                        var width = elem.width() + 20;
                        if (width < 30) {
                            setTimeout(addSparkline, 30);
                            return;
                        }
                        var height = ctrl.height;
                        var plotCanvas = jquery_1.default('<div></div>');
                        var plotCss = {};
                        plotCss.position = 'absolute';
                        if (panel.sparkline.full) {
                            plotCss.bottom = '5px';
                            plotCss.left = '-5px';
                            plotCss.width = width - 10 + 'px';
                            var dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
                            plotCss.height = height - dynamicHeightMargin + 'px';
                        }
                        else {
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
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
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
                                color = panel.valueMappingColorBackground;
                            }
                            else {
                                color = getColorForValue(panel.thresholds, data.value);
                            }
                            if (color) {
                                $panelContainer.css('background-color', color);
                                if (scope.fullscreen) {
                                    elem.css('background-color', color);
                                }
                                else {
                                    elem.css('background-color', '');
                                }
                            }
                        }
                        else {
                            $panelContainer.css('background-color', '');
                            elem.css('background-color', '');
                            panel.circleBackground = false;
                        }
                        if (panel.circleBackground) {
                            var circleHeight = jquery_1.default($panelContainer.height())[0] - 26;
                            var circleWidth = jquery_1.default($panelContainer.width())[0];
                            jquery_1.default($panelContainer).addClass('circle');
                            $panelContainer.css('background-color', '');
                            if (circleWidth >= circleHeight) {
                                elem.css({
                                    'border-radius': 50 + '%',
                                    'width': circleHeight + 'px',
                                    'height': circleHeight + 'px',
                                    'background-color': color
                                });
                            }
                            else {
                                elem.css({
                                    'border-radius': 50 + '%',
                                    'width': circleWidth + 'px',
                                    'height': circleWidth + 'px',
                                    'background-color': color
                                });
                            }
                        }
                        else {
                            jquery_1.default($panelContainer.removeClass('circle'));
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
                        }
                        else {
                            linkInfo = null;
                        }
                    }
                    function hookupDrilldownLinkTooltip() {
                        var drilldownTooltip = jquery_1.default('<div id="tooltip" class="">hello</div>"');
                        elem.mouseleave(function () {
                            if (panel.links.length === 0) {
                                return;
                            }
                            $timeout(function () {
                                drilldownTooltip.detach();
                            });
                        });
                        elem.click(function (evt) {
                            if (!linkInfo) {
                                return;
                            }
                            if (jquery_1.default(evt).parents('.panel-header').length > 0) {
                                return;
                            }
                            if (linkInfo.target === '_blank') {
                                window.open(linkInfo.href, '_blank');
                                return;
                            }
                            if (linkInfo.href.indexOf('http') === 0) {
                                window.location.href = linkInfo.href;
                            }
                            else {
                                $timeout(function () {
                                    $location.url(linkInfo.href);
                                });
                            }
                            drilldownTooltip.detach();
                        });
                        elem.mousemove(function (e) {
                            if (!panel.colorValue) {
                                return;
                            }
                            drilldownTooltip.text(data.valueFormatted);
                            drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
                        });
                    }
                    hookupDrilldownLinkTooltip();
                    this.events.on('render', function () {
                        render();
                        ctrl.renderingCompleted();
                    });
                };
                SingleStatMathCtrl.templateUrl = 'public/plugins/blackmirror1-singlestat-math-panel/module.html';
                return SingleStatMathCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("SingleStatMathCtrl", SingleStatMathCtrl);
            exports_1("PanelCtrl", SingleStatMathCtrl);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlc3RhdC1tYXRoX2N0cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2luZ2xlc3RhdC1tYXRoX2N0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnMEJBLDBCQUEwQixVQUFVLEVBQUUsS0FBSztRQUN6QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDdkIsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtnQkFDN0IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQTV6QmdDLHNDQUFnQjtnQkE2RS9DLDRCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFVLE9BQU87b0JBQWpFLFlBQ0Usa0JBQU0sTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQWdCekI7b0JBakJzQyxlQUFTLEdBQVQsU0FBUyxDQUFBO29CQUFVLGFBQU8sR0FBUCxPQUFPLENBQUE7b0JBMUVqRSxjQUFRLEdBQUcsWUFBWSxDQUFDO29CQVF4QixzQkFBZ0IsR0FBVTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO3dC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RCxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDO29CQUNELDBCQUEwQixFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTt3QkFDdkIsTUFBTSxFQUFFLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQzVCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBM3lCTSw4QkFBVyxHQUFHLCtEQUErRCxDQUFDO2dCQTR5QnZGLHlCQUFDO2FBQUEsQUE3eUJELENBQWlDLHNCQUFnQjs7O1FBZzBCakQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0ICdqcXVlcnkuZmxvdCc7XG5pbXBvcnQgJy4vbGliL2Zsb3QvanF1ZXJ5LmZsb3QuZ2F1Z2UnO1xuaW1wb3J0ICdqcXVlcnkuZmxvdC50aW1lJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QuY3Jvc3NoYWlyJztcbmltcG9ydCAnLi9jc3MvcGFuZWxfc2luZ2xlc3RhdG1hdGguY3NzISc7XG5pbXBvcnQgbWF0aCBmcm9tICcuL2xpYi9tYXRoanMvbWF0aCdcblxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdhcHAvY29yZS9jb25maWcnO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSAnYXBwL2NvcmUvdGltZV9zZXJpZXMyJztcbmltcG9ydCB7IE1ldHJpY3NQYW5lbEN0cmwsIFBhbmVsQ3RybCB9IGZyb20gJ2FwcC9wbHVnaW5zL3Nkayc7XG4vL2ltcG9ydCB7IHN0cmljdCB9IGZyb20gJ2Fzc2VydCc7XG5cbmNsYXNzIFNpbmdsZVN0YXRNYXRoQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xuICBzdGF0aWMgdGVtcGxhdGVVcmwgPSAncHVibGljL3BsdWdpbnMvYmxhY2ttaXJyb3IxLXNpbmdsZXN0YXQtbWF0aC1wYW5lbC9tb2R1bGUuaHRtbCc7XG5cbiAgZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gIHNlcmllczogYW55W107XG4gIGRhdGE6IGFueTtcbiAgZm9udFNpemVzOiBhbnlbXTtcbiAgdW5pdEZvcm1hdHM6IGFueVtdO1xuICBpbnZhbGlkR2F1Z2VSYW5nZTogYm9vbGVhbjtcbiAgcGFuZWw6IGFueTtcbiAgZXZlbnRzOiBhbnk7XG4gIHZhbHVlTmFtZU9wdGlvbnM6IGFueVtdID0gW1xuICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgIHsgdmFsdWU6ICdtYXgnLCB0ZXh0OiAnTWF4JyB9LFxuICAgIHsgdmFsdWU6ICdhdmcnLCB0ZXh0OiAnQXZlcmFnZScgfSxcbiAgICB7IHZhbHVlOiAnY3VycmVudCcsIHRleHQ6ICdDdXJyZW50JyB9LFxuICAgIHsgdmFsdWU6ICd0b3RhbCcsIHRleHQ6ICdUb3RhbCcgfSxcbiAgICB7IHZhbHVlOiAnbmFtZScsIHRleHQ6ICdOYW1lJyB9LFxuICAgIHsgdmFsdWU6ICdmaXJzdCcsIHRleHQ6ICdGaXJzdCcgfSxcbiAgICB7IHZhbHVlOiAnZGVsdGEnLCB0ZXh0OiAnRGVsdGEnIH0sXG4gICAgeyB2YWx1ZTogJ2RpZmYnLCB0ZXh0OiAnRGlmZmVyZW5jZScgfSxcbiAgICB7IHZhbHVlOiAncmFuZ2UnLCB0ZXh0OiAnUmFuZ2UnIH0sXG4gICAgeyB2YWx1ZTogJ2xhc3RfdGltZScsIHRleHQ6ICdUaW1lIG9mIGxhc3QgcG9pbnQnIH0sXG4gIF07XG4gIHRhYmxlQ29sdW1uT3B0aW9uczogYW55O1xuICB0aHJlc2hvbGRzOiBhbnlbXTtcblxuICAvLyBTZXQgYW5kIHBvcHVsYXRlIGRlZmF1bHRzXG4gIHBhbmVsRGVmYXVsdHMgPSB7XG4gICAgbGlua3M6IFtdLFxuICAgIGRhdGFzb3VyY2U6IG51bGwsXG4gICAgbWF4RGF0YVBvaW50czogMTAwLFxuICAgIGludGVydmFsOiBudWxsLFxuICAgIHRhcmdldHM6IFt7fV0sXG4gICAgY2FjaGVUaW1lb3V0OiBudWxsLFxuICAgIGRlZmF1bHRDb2xvcjogJ3JnYigxMTcsIDExNywgMTE3KScsXG4gICAgdGhyZXNob2xkczogJycsXG4gICAgZm9ybWF0OiAnbm9uZScsXG4gICAgc29ydE9yZGVyOiAnYXNjJyxcbiAgICBwcmVmaXg6ICcnLFxuICAgIHBvc3RmaXg6ICcnLFxuICAgIG51bGxUZXh0OiBudWxsLFxuICAgIHZhbHVlTWFwczogW3sgdmFsdWU6ICdudWxsJywgb3A6ICc9JywgdGV4dDogJ05vIGRhdGEnIH1dLFxuICAgIG1hcHBpbmdUeXBlczogW3sgbmFtZTogJ3ZhbHVlIHRvIHRleHQnLCB2YWx1ZTogMSB9LCB7IG5hbWU6ICdyYW5nZSB0byB0ZXh0JywgdmFsdWU6IDIgfV0sXG4gICAgcmFuZ2VNYXBzOiBbeyBmcm9tOiAnbnVsbCcsIHRvOiAnbnVsbCcsIHRleHQ6ICdOL0EnIH1dLFxuICAgIG1hcHBpbmdUeXBlOiAxLFxuICAgIG51bGxQb2ludE1vZGU6ICdjb25uZWN0ZWQnLFxuICAgIHZhbHVlTmFtZTogJ2F2ZycsXG4gICAgcHJlZml4Rm9udFNpemU6ICc1MCUnLFxuICAgIHZhbHVlRm9udFNpemU6ICc4MCUnLFxuICAgIHBvc3RmaXhGb250U2l6ZTogJzUwJScsXG4gICAgbWF0aDogJycsXG4gICAgY29sb3JCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBjaXJjbGVCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICB2YWx1ZU1hcHBpbmdDb2xvckJhY2tncm91bmQ6ICcjNzg3ODc5JyxcbiAgICBjb2xvclZhbHVlOiBmYWxzZSxcbiAgICBzcGFya2xpbmU6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgZnVsbDogZmFsc2UsXG4gICAgICBsaW5lQ29sb3I6ICdyZ2IoMzEsIDEyMCwgMTkzKScsXG4gICAgICBmaWxsQ29sb3I6ICdyZ2JhKDMxLCAxMTgsIDE4OSwgMC4xOCknLFxuICAgIH0sXG4gICAgZ2F1Z2U6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgbWluVmFsdWU6IDAsXG4gICAgICBtYXhWYWx1ZTogMTAwLFxuICAgICAgdGhyZXNob2xkTWFya2VyczogdHJ1ZSxcbiAgICAgIHRocmVzaG9sZExhYmVsczogZmFsc2UsXG4gICAgfSxcbiAgICBzb3J0T3JkZXJPcHRpb25zOiBbXG4gICAgICB7IHZhbHVlOiAnYXNjJywgdGV4dDogJ0FzY2VuZGluZyd9LFxuICAgICAgeyB2YWx1ZTogJ2Rlc2MnLCB0ZXh0OiAnRGVzY2VuZGluZyd9LFxuICAgIF0sXG4gICAgdGFibGVDb2x1bW46ICcnLFxuICB9O1xuXG4gIC8qKiBAbmdJbmplY3QgKi9cbiAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IsIHByaXZhdGUgJGxvY2F0aW9uLCBwcml2YXRlIGxpbmtTcnYpIHtcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XG4gICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCB0aGlzLnBhbmVsRGVmYXVsdHMpO1xuXG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtcmVjZWl2ZWQnLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLWVycm9yJywgdGhpcy5vbkRhdGFFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1zbmFwc2hvdC1sb2FkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbignaW5pdC1lZGl0LW1vZGUnLCB0aGlzLm9uSW5pdEVkaXRNb2RlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5vblNwYXJrbGluZUNvbG9yQ2hhbmdlID0gdGhpcy5vblNwYXJrbGluZUNvbG9yQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblNwYXJrbGluZUZpbGxDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgLy9HcmFiIHByZXZpb3VzIHZlcnNpb24gdGhyZXNob2xkcyBhbmQgc3RvcmUgaW50byBuZXcgZm9ybWF0XG4gICAgdmFyIHQgPSB0aGlzLnBhbmVsLnRocmVzaG9sZHM7XG4gICAgaWYgKHR5cGVvZiB0ID09PSAnc3RyaW5nJyB8fCB0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLm9sZFRocmVzaGVzQ2hhbmdlKHQpO1xuICAgIH1cbiAgfVxuXG4gIG9uSW5pdEVkaXRNb2RlKCkge1xuICAgIHRoaXMuZm9udFNpemVzID0gWycyMCUnLCAnMzAlJywgJzUwJScsICc3MCUnLCAnODAlJywgJzEwMCUnLCAnMTEwJScsICcxMjAlJywgJzE1MCUnLCAnMTcwJScsICcyMDAlJ107XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoJ09wdGlvbnMnLCAncHVibGljL3BsdWdpbnMvYmxhY2ttaXJyb3IxLXNpbmdsZXN0YXQtbWF0aC1wYW5lbC9lZGl0b3IuaHRtbCcsIDIpO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKCdWYWx1ZSBNYXBwaW5ncycsICdwdWJsaWMvcGx1Z2lucy9ibGFja21pcnJvcjEtc2luZ2xlc3RhdC1tYXRoLXBhbmVsL21hcHBpbmdzLmh0bWwnLCAzKTtcbiAgICB0aGlzLnVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIH1cblxuICBvbGRUaHJlc2hlc0NoYW5nZSh0aHJlc2hlcykge1xuICAgIHZhciBhcnJheSA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGFycmF5ID0gSlNPTi5wYXJzZShcIltcIiArIHRocmVzaGVzICsgXCJdXCIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coXCJKU09OIHBhcnNlIGZhaWxlZFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAoYXJyYXkgPT09IG51bGwpIHtcbiAgICAgIC8vIHVzZSBzcGxpdCBtZXRob2QgaW5zdGVhZFxuICAgICAgYXJyYXkgPSB0aHJlc2hlcy5zcGxpdChcIixcIik7XG4gICAgfVxuICAgIHRoaXMudGhyZXNob2xkcyA9IFtdOyAvL2luc3RhbnRpYXRlIGEgbmV3IGRlZmluZWQgZGljdGlvbmFyeVxuXG4gICAgLy9wdXNoIG9sZCBpdGVtcyBpbnRvIG5ldyBkaWN0aW9uYXJ5XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHVzZUNvbG9yID0gdGhpcy5wYW5lbC5kZWZhdWx0Q29sb3I7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuY29sb3JzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmIChpIDwgdGhpcy5wYW5lbC5jb2xvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdXNlQ29sb3IgPSB0aGlzLnBhbmVsLmNvbG9yc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy50aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICBjb2xvcjogdXNlQ29sb3IsXG4gICAgICAgIHZhbHVlOiBOdW1iZXIoYXJyYXlbaV0pLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9PdmVyd3JpdGUgSlNPTlxuICAgIHRoaXMucGFuZWxbXCJ0aHJlc2hvbGRzXCJdID0gdGhpcy50aHJlc2hvbGRzO1xuICB9XG5cbiAgc29ydE15VGhyZXNoZXMoY29udHJvbCkge1xuICAgIGlmKHRoaXMucGFuZWwuc29ydE9yZGVyID09PSAnYXNjJykge1xuICAgICAgY29udHJvbC5wYW5lbC50aHJlc2hvbGRzID0gXy5vcmRlckJ5KGNvbnRyb2wucGFuZWwudGhyZXNob2xkcywgW1widmFsdWVcIl0sIFtcImFzY1wiXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnNvcnRPcmRlciA9PT0gJ2Rlc2MnKSB7XG4gICAgICBjb250cm9sLnBhbmVsLnRocmVzaG9sZHMgPSBfLm9yZGVyQnkoY29udHJvbC5wYW5lbC50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiZGVzY1wiXSk7XG4gICAgfVxuICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICB9XG5cbiAgc2V0VW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgdGhpcy5wYW5lbC5mb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgdGhpcy5vbkRhdGFSZWNlaXZlZChbXSk7XG4gIH1cblxuICBvbkVkaXRvclJlbW92ZVRocmVzaG9sZChpbmRleCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRWRpdG9yQWRkVGhyZXNob2xkKCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5wdXNoKHtjb2xvcjogdGhpcy5wYW5lbC5kZWZhdWx0Q29sb3J9KVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvbkRhdGFSZWNlaXZlZChkYXRhTGlzdCkge1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHt9O1xuICAgIGlmIChkYXRhTGlzdC5sZW5ndGggPiAwICYmIGRhdGFMaXN0WzBdLnR5cGUgPT09ICd0YWJsZScpIHtcbiAgICAgIHRoaXMuZGF0YVR5cGUgPSAndGFibGUnO1xuICAgICAgY29uc3QgdGFibGVEYXRhID0gZGF0YUxpc3QubWFwKHRoaXMudGFibGVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5zZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGFUeXBlID0gJ3RpbWVzZXJpZXMnO1xuICAgICAgdGhpcy5zZXJpZXMgPSBkYXRhTGlzdC5tYXAodGhpcy5zZXJpZXNIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5zZXRWYWx1ZXMoZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNlcmllc0hhbmRsZXIoc2VyaWVzRGF0YSkge1xuICAgIHZhciBzZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICBkYXRhcG9pbnRzOiBzZXJpZXNEYXRhLmRhdGFwb2ludHMgfHwgW10sXG4gICAgICBhbGlhczogc2VyaWVzRGF0YS50YXJnZXQsXG4gICAgfSk7XG5cbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgIHJldHVybiBzZXJpZXM7XG4gIH1cblxuICB0YWJsZUhhbmRsZXIodGFibGVEYXRhKSB7XG4gICAgY29uc3QgZGF0YXBvaW50cyA9IFtdO1xuICAgIGNvbnN0IGNvbHVtbk5hbWVzID0ge307XG5cbiAgICB0YWJsZURhdGEuY29sdW1ucy5mb3JFYWNoKChjb2x1bW4sIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICBjb2x1bW5OYW1lc1tjb2x1bW5JbmRleF0gPSBjb2x1bW4udGV4dDtcbiAgICB9KTtcblxuICAgIHRoaXMudGFibGVDb2x1bW5PcHRpb25zID0gY29sdW1uTmFtZXM7XG4gICAgaWYgKCFfLmZpbmQodGFibGVEYXRhLmNvbHVtbnMsIFsndGV4dCcsIHRoaXMucGFuZWwudGFibGVDb2x1bW5dKSkge1xuICAgICAgdGhpcy5zZXRUYWJsZUNvbHVtblRvU2Vuc2libGVEZWZhdWx0KHRhYmxlRGF0YSk7XG4gICAgfVxuXG4gICAgdGFibGVEYXRhLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgY29uc3QgZGF0YXBvaW50ID0ge307XG5cbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gY29sdW1uTmFtZXNbY29sdW1uSW5kZXhdO1xuICAgICAgICBkYXRhcG9pbnRba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG5cbiAgICAgIGRhdGFwb2ludHMucHVzaChkYXRhcG9pbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFwb2ludHM7XG4gIH1cblxuICBzZXRUYWJsZUNvbHVtblRvU2Vuc2libGVEZWZhdWx0KHRhYmxlRGF0YSkge1xuICAgIGlmICh0YWJsZURhdGEuY29sdW1ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSB0YWJsZURhdGEuY29sdW1uc1swXS50ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLnRhYmxlQ29sdW1uID0gXy5maW5kKHRhYmxlRGF0YS5jb2x1bW5zLCBjb2wgPT4ge1xuICAgICAgICByZXR1cm4gY29sLnR5cGUgIT09ICd0aW1lJztcbiAgICAgIH0pLnRleHQ7XG4gICAgfVxuICB9XG5cbiAgc2V0VGFibGVWYWx1ZXModGFibGVEYXRhLCBkYXRhKSB7XG4gICAgaWYgKCF0YWJsZURhdGEgfHwgdGFibGVEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0YWJsZURhdGFbMF0ubGVuZ3RoID09PSAwIHx8IHRhYmxlRGF0YVswXVswXVt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXBvaW50ID0gdGFibGVEYXRhWzBdWzBdO1xuICAgIGRhdGEudmFsdWUgPSBkYXRhcG9pbnRbdGhpcy5wYW5lbC50YWJsZUNvbHVtbl07XG5cbiAgICBpZiAoXy5pc1N0cmluZyhkYXRhLnZhbHVlKSkge1xuICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGRhdGEudmFsdWUpO1xuICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRlY2ltYWxJbmZvID0gdGhpcy5nZXREZWNpbWFsc0ZvclZhbHVlKGRhdGEudmFsdWUpO1xuICAgICAgY29uc3QgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5mb3JtYXRdO1xuICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoXG4gICAgICAgIGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXSxcbiAgICAgICAgZGVjaW1hbEluZm8uZGVjaW1hbHMsXG4gICAgICAgIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzXG4gICAgICApO1xuICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCB0aGlzLnBhbmVsLmRlY2ltYWxzIHx8IDApO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VmFsdWVNYXBwaW5nKGRhdGEpO1xuICB9XG5cbiAgY2FuQ2hhbmdlRm9udFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZ2F1Z2Uuc2hvdztcbiAgfVxuXG4gIG9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UobmV3Q29sb3IpIHtcbiAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5saW5lQ29sb3IgPSBuZXdDb2xvcjtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgb25TcGFya2xpbmVGaWxsQ2hhbmdlKG5ld0NvbG9yKSB7XG4gICAgdGhpcy5wYW5lbC5zcGFya2xpbmUuZmlsbENvbG9yID0gbmV3Q29sb3I7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGdldERlY2ltYWxzRm9yVmFsdWUodmFsdWUpIHtcbiAgICBpZiAoXy5pc051bWJlcih0aGlzLnBhbmVsLmRlY2ltYWxzKSkge1xuICAgICAgcmV0dXJuIHsgZGVjaW1hbHM6IHRoaXMucGFuZWwuZGVjaW1hbHMsIHNjYWxlZERlY2ltYWxzOiBudWxsIH07XG4gICAgfVxuXG4gICAgdmFyIGRlbHRhID0gdmFsdWUgLyAyO1xuICAgIHZhciBkZWMgPSAtTWF0aC5mbG9vcihNYXRoLmxvZyhkZWx0YSkgLyBNYXRoLkxOMTApO1xuXG4gICAgdmFyIG1hZ24gPSBNYXRoLnBvdygxMCwgLWRlYyksXG4gICAgICBub3JtID0gZGVsdGEgLyBtYWduLCAvLyBub3JtIGlzIGJldHdlZW4gMS4wIGFuZCAxMC4wXG4gICAgICBzaXplO1xuXG4gICAgaWYgKG5vcm0gPCAxLjUpIHtcbiAgICAgIHNpemUgPSAxO1xuICAgIH0gZWxzZSBpZiAobm9ybSA8IDMpIHtcbiAgICAgIHNpemUgPSAyO1xuICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciAyLjUsIHJlcXVpcmVzIGFuIGV4dHJhIGRlY2ltYWxcbiAgICAgIGlmIChub3JtID4gMi4yNSkge1xuICAgICAgICBzaXplID0gMi41O1xuICAgICAgICArK2RlYztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vcm0gPCA3LjUpIHtcbiAgICAgIHNpemUgPSA1O1xuICAgIH0gZWxzZSB7XG4gICAgICBzaXplID0gMTA7XG4gICAgfVxuXG4gICAgc2l6ZSAqPSBtYWduO1xuXG4gICAgLy8gcmVkdWNlIHN0YXJ0aW5nIGRlY2ltYWxzIGlmIG5vdCBuZWVkZWRcbiAgICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSB7XG4gICAgICBkZWMgPSAwO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQ6IGFueSA9IHt9O1xuICAgIHJlc3VsdC5kZWNpbWFscyA9IE1hdGgubWF4KDAsIGRlYyk7XG4gICAgcmVzdWx0LnNjYWxlZERlY2ltYWxzID0gcmVzdWx0LmRlY2ltYWxzIC0gTWF0aC5mbG9vcihNYXRoLmxvZyhzaXplKSAvIE1hdGguTE4xMCkgKyAyO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNldFZhbHVlcyhkYXRhKSB7XG4gICAgZGF0YS5mbG90cGFpcnMgPSBbXTtcblxuICAgIGlmICh0aGlzLnNlcmllcy5sZW5ndGggPiAxIHx8IHRoaXMucGFuZWwubWF0aC5sZW5ndGgpIHtcbiAgICAgIGxldCBsYXN0UG9pbnQgPSBbXTtcbiAgICAgIGxldCBsYXN0VmFsdWUgPSBbXTtcbiAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGxhc3RQb2ludFtpbmRleF0gPSBfLmxhc3QoZWxlbWVudC5kYXRhcG9pbnRzKTtcbiAgICAgICAgbGFzdFZhbHVlW2luZGV4XSA9IF8uaXNBcnJheShsYXN0UG9pbnRbaW5kZXhdKSA/IGxhc3RQb2ludFtpbmRleF1bMF0gOiBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnNlcmllc1swXS5hbGlhcztcblxuICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxhc3RWYWx1ZVswXSkpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBfLmVzY2FwZShsYXN0VmFsdWVbMF0pO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbGFzdF90aW1lJykge1xuICAgICAgICBsZXQgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5mb3JtYXRdO1xuICAgICAgICBkYXRhLnZhbHVlID0gbGFzdFBvaW50WzBdWzFdO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGRhdGEudmFsdWU7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGEudmFsdWUsIDAsIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwubWF0aC5sZW5ndGgpe1xuICAgICAgICAgIHZhciBtYXRoRnVuY3Rpb24gPSB0aGlzLnRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5wYW5lbC5tYXRoLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBtYXRoRnVuY3Rpb24gPSBtYXRoRnVuY3Rpb24ucmVwbGFjZShuZXcgUmVnRXhwKGVsZW1lbnQuYWxpYXMsICdnaScpLCBTdHJpbmcoZWxlbWVudC5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbWF0aEZ1bmN0aW9uID0gbWF0aEZ1bmN0aW9uLnJlcGxhY2UobmV3IFJlZ0V4cCgnW0EtemEtel0rJywgJ2dpJyksIFN0cmluZygwKSk7XG4gICAgICAgICAgICBkYXRhLnZhbHVlID0gbWF0aC5ldmFsKG1hdGhGdW5jdGlvbik7XG4gICAgICAgICAgICBkYXRhLmZsb3RwYWlycyA9IHRoaXMuc2VyaWVzWzBdLmZsb3RwYWlycztcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvL0Vycm9yIGV2YWx1YXRpbmcgZnVuY3Rpb24uIERlZmF1bHRpbmcgdG8gemVyby5cbiAgICAgICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICAgICAgZGF0YS5mbG90cGFpcnMgPSBbMCwwXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBkYXRhLnZhbHVlID0gdGhpcy5zZXJpZXNbMF0uc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdO1xuICAgICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2ltYWxJbmZvID0gdGhpcy5nZXREZWNpbWFsc0ZvclZhbHVlKGRhdGEudmFsdWUpO1xuICAgICAgICBsZXQgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5mb3JtYXRdO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscywgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkICRfX25hbWUgdmFyaWFibGUgZm9yIHVzaW5nIGluIHByZWZpeCBvciBwb3N0Zml4XG4gICAgICBpZih0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwKXtcbiAgICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICAgIGRhdGEuc2NvcGVkVmFyc1snX19uYW1lJ10gPSB7IHZhbHVlOiB0aGlzLnNlcmllc1swXS5sYWJlbCB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXJpZXMubGVuZ3RoIDwgMiAmJiAhdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgIGxldCBsYXN0VmFsdWUgPSBfLmlzQXJyYXkobGFzdFBvaW50KSA/IGxhc3RQb2ludFswXSA6IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnNlcmllc1swXS5hbGlhcztcbiAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ2xhc3RfdGltZScpIHtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGxhc3RQb2ludFsxXTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBkYXRhLnZhbHVlO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICBkYXRhLnNjb3BlZFZhcnNbJ19fbmFtZSddID0geyB2YWx1ZTogdGhpcy5zZXJpZXNbMF0ubGFiZWwgfTtcbiAgICB9XG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBzZXRWYWx1ZU1hcHBpbmcoZGF0YSkge1xuICAgIC8vIGNoZWNrIHZhbHVlIHRvIHRleHQgbWFwcGluZ3MgaWYgaXRzIGVuYWJsZWRcbiAgICBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnZhbHVlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC52YWx1ZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAudmFsdWUgPT09ICdudWxsJykge1xuICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlL251bWJlciB0byB0ZXh0IG1hcHBpbmdcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChtYXAudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnJhbmdlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC5yYW5nZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAuZnJvbSA9PT0gJ251bGwnICYmIG1hcC50byA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IG51bGwgfHwgZGF0YS52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsdWUvbnVtYmVyIHRvIHJhbmdlIG1hcHBpbmdcbiAgICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG1hcC5mcm9tKTtcbiAgICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChtYXAudG8pO1xuICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHsgdmFsdWU6ICcnLCBvcDogJz0nLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7IGZyb206ICcnLCB0bzogJycsIHRleHQ6ICcnIH0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICB2YXIgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgdmFyIGxpbmtTcnYgPSB0aGlzLmxpbmtTcnY7XG4gICAgdmFyICR0aW1lb3V0ID0gdGhpcy4kdGltZW91dDtcbiAgICB2YXIgcGFuZWwgPSBjdHJsLnBhbmVsO1xuICAgIHZhciB0ZW1wbGF0ZVNydiA9IHRoaXMudGVtcGxhdGVTcnY7XG4gICAgdmFyIGRhdGEsIGxpbmtJbmZvO1xuICAgIHZhciAkcGFuZWxDb250YWluZXIgPSBlbGVtLmZpbmQoJy5wYW5lbC1jb250YWluZXInKTtcbiAgICBlbGVtID0gZWxlbS5maW5kKCcuc2luZ2xlc3RhdG1hdGgtcGFuZWwnKTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlLCB2YWx1ZVN0cmluZykge1xuICAgICAgaWYgKCFwYW5lbC5jb2xvclZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVN0cmluZztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcblxuICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBjb2xvciA9IHBhbmVsLnZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiAnPHNwYW4gc3R5bGU9XCJjb2xvcjonICsgY29sb3IgKyAnXCI+JyArIHZhbHVlU3RyaW5nICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3BhbihjbGFzc05hbWUsIGZvbnRTaXplLCB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHZhbHVlLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCIgc3R5bGU9XCJmb250LXNpemU6JyArIGZvbnRTaXplICsgJ1wiPicgKyB2YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICB2YXIgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdG1hdGgtcGFuZWwtdmFsdWUtY29udGFpbmVyXCI+JztcblxuICAgICAgaWYgKHBhbmVsLnByZWZpeCkge1xuICAgICAgICB2YXIgcHJlZml4ID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgcGFuZWwucHJlZml4KTtcbiAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC1wcmVmaXgnLCBwYW5lbC5wcmVmaXhGb250U2l6ZSwgcHJlZml4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXZhbHVlJywgcGFuZWwudmFsdWVGb250U2l6ZSwgdmFsdWUpO1xuXG4gICAgICBpZiAocGFuZWwucG9zdGZpeCkge1xuICAgICAgICB2YXIgcG9zdGZpeCA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIHBhbmVsLnBvc3RmaXgpO1xuICAgICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXBvc3RmaXgnLCBwYW5lbC5wb3N0Zml4Rm9udFNpemUsIHBvc3RmaXgpO1xuICAgICAgfVxuXG4gICAgICBib2R5ICs9ICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZVRleHQoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFuZWwucHJlZml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wcmVmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcbiAgICAgIHJlc3VsdCArPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgcmVzdWx0ICs9IHBhbmVsLnBvc3RmaXggPyB0ZW1wbGF0ZVNydi5yZXBsYWNlKHBhbmVsLnBvc3RmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRHYXVnZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgIHZhciBoZWlnaHQgPSBlbGVtLmhlaWdodCgpO1xuICAgICAgLy8gQWxsb3cgdG8gdXNlIGEgYml0IG1vcmUgc3BhY2UgZm9yIHdpZGUgZ2F1Z2VzXG4gICAgICB2YXIgZGltZW5zaW9uID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCAqIDEuMyk7XG5cbiAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSBmYWxzZTtcbiAgICAgIGlmIChwYW5lbC5nYXVnZS5taW5WYWx1ZSA+IHBhbmVsLmdhdWdlLm1heFZhbHVlKSB7XG4gICAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIHZhciBwbG90Q3NzID0ge1xuICAgICAgICB0b3A6ICcxMHB4JyxcbiAgICAgICAgbWFyZ2luOiAnYXV0bycsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCAqIDAuOSArICdweCcsXG4gICAgICAgIHdpZHRoOiBkaW1lbnNpb24gKyAncHgnLFxuICAgICAgfTtcblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIHZhciB0aHJlc2hvbGRzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhbmVsLnRocmVzaG9sZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogcGFuZWwudGhyZXNob2xkc1tpXS52YWx1ZSxcbiAgICAgICAgICBjb2xvcjogcGFuZWwudGhyZXNob2xkc1tpXS5jb2xvcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICB2YWx1ZTogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgIGNvbG9yOiBwYW5lbC50aHJlc2hvbGRzW3BhbmVsLnRocmVzaG9sZHMubGVuZ3RoIC0gMV0sXG4gICAgICB9KTtcblxuICAgICAgdmFyIGJnQ29sb3IgPSBjb25maWcuYm9vdERhdGEudXNlci5saWdodFRoZW1lID8gJ3JnYigyMzAsMjMwLDIzMCknIDogJ3JnYigzOCwzOCwzOCknO1xuXG4gICAgICB2YXIgZm9udFNjYWxlID0gcGFyc2VJbnQocGFuZWwudmFsdWVGb250U2l6ZSkgLyAxMDA7XG4gICAgICB2YXIgZm9udFNpemUgPSBNYXRoLm1pbihkaW1lbnNpb24gLyA1LCAxMDApICogZm9udFNjYWxlO1xuICAgICAgLy8gUmVkdWNlIGdhdWdlIHdpZHRoIGlmIHRocmVzaG9sZCBsYWJlbHMgZW5hYmxlZFxuICAgICAgdmFyIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbyA9IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyA/IDEuNSA6IDE7XG4gICAgICB2YXIgZ2F1Z2VXaWR0aCA9IE1hdGgubWluKGRpbWVuc2lvbiAvIDYsIDYwKSAvIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbztcbiAgICAgIHZhciB0aHJlc2hvbGRNYXJrZXJzV2lkdGggPSBnYXVnZVdpZHRoIC8gNTtcbiAgICAgIHZhciB0aHJlc2hvbGRMYWJlbEZvbnRTaXplID0gZm9udFNpemUgLyAyLjU7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBnYXVnZXM6IHtcbiAgICAgICAgICAgIGdhdWdlOiB7XG4gICAgICAgICAgICAgIG1pbjogcGFuZWwuZ2F1Z2UubWluVmFsdWUsXG4gICAgICAgICAgICAgIG1heDogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHsgY29sb3I6IGJnQ29sb3IgfSxcbiAgICAgICAgICAgICAgYm9yZGVyOiB7IGNvbG9yOiBudWxsIH0sXG4gICAgICAgICAgICAgIHNoYWRvdzogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgICB3aWR0aDogZ2F1Z2VXaWR0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmcmFtZTogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgbGFiZWw6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxheW91dDogeyBtYXJnaW46IDAsIHRocmVzaG9sZFdpZHRoOiAwIH0sXG4gICAgICAgICAgICBjZWxsOiB7IGJvcmRlcjogeyB3aWR0aDogMCB9IH0sXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IHtcbiAgICAgICAgICAgICAgdmFsdWVzOiB0aHJlc2hvbGRzLFxuICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHRocmVzaG9sZE1hcmtlcnNXaWR0aCArIDEsXG4gICAgICAgICAgICAgICAgZm9udDogeyBzaXplOiB0aHJlc2hvbGRMYWJlbEZvbnRTaXplIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZE1hcmtlcnMsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHBhbmVsLmNvbG9yVmFsdWUgPyBnZXRDb2xvckZvclZhbHVlKHBhbmVsLnRocmVzaG9sZHMsIGRhdGEudmFsdWVSb3VuZGVkKSA6IG51bGwsXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlVGV4dCgpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZmFtaWx5OiAnXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBlbGVtLmFwcGVuZChwbG90Q2FudmFzKTtcblxuICAgICAgdmFyIHBsb3RTZXJpZXMgPSB7XG4gICAgICAgIGRhdGE6IFtbMCwgZGF0YS52YWx1ZVJvdW5kZWRdXSxcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFNwYXJrbGluZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgaWYgKHdpZHRoIDwgMzApIHtcbiAgICAgICAgLy8gZWxlbWVudCBoYXMgbm90IGdvdHRlbiBpdCdzIHdpZHRoIHlldFxuICAgICAgICAvLyBkZWxheSBzcGFya2xpbmUgcmVuZGVyXG4gICAgICAgIHNldFRpbWVvdXQoYWRkU3BhcmtsaW5lLCAzMCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGhlaWdodCA9IGN0cmwuaGVpZ2h0O1xuICAgICAgdmFyIHBsb3RDYW52YXMgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgICAgdmFyIHBsb3RDc3M6IGFueSA9IHt9O1xuICAgICAgcGxvdENzcy5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cbiAgICAgIGlmIChwYW5lbC5zcGFya2xpbmUuZnVsbCkge1xuICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICc1cHgnO1xuICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgIHBsb3RDc3Mud2lkdGggPSB3aWR0aCAtIDEwICsgJ3B4JztcbiAgICAgICAgdmFyIGR5bmFtaWNIZWlnaHRNYXJnaW4gPSBoZWlnaHQgPD0gMTAwID8gNSA6IE1hdGgucm91bmQoaGVpZ2h0IC8gMTAwKSAqIDE1ICsgNTtcbiAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBoZWlnaHQgLSBkeW5hbWljSGVpZ2h0TWFyZ2luICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsb3RDc3MuYm90dG9tID0gJzBweCc7XG4gICAgICAgIHBsb3RDc3MubGVmdCA9ICctNXB4JztcbiAgICAgICAgcGxvdENzcy53aWR0aCA9IHdpZHRoIC0gMTAgKyAncHgnO1xuICAgICAgICBwbG90Q3NzLmhlaWdodCA9IE1hdGguZmxvb3IoaGVpZ2h0ICogMC4yNSkgKyAncHgnO1xuICAgICAgfVxuXG4gICAgICBwbG90Q2FudmFzLmNzcyhwbG90Q3NzKTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGxlZ2VuZDogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBsaW5lczoge1xuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGw6IDEsXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IHBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgeWF4ZXM6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgeGF4aXM6IHtcbiAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICBtb2RlOiAndGltZScsXG4gICAgICAgICAgbWluOiBjdHJsLnJhbmdlLmZyb20udmFsdWVPZigpLFxuICAgICAgICAgIG1heDogY3RybC5yYW5nZS50by52YWx1ZU9mKCksXG4gICAgICAgIH0sXG4gICAgICAgIGdyaWQ6IHsgaG92ZXJhYmxlOiBmYWxzZSwgc2hvdzogZmFsc2UgfSxcbiAgICAgIH07XG5cbiAgICAgIGVsZW0uYXBwZW5kKHBsb3RDYW52YXMpO1xuXG4gICAgICB2YXIgcGxvdFNlcmllcyA9IHtcbiAgICAgICAgZGF0YTogZGF0YS5mbG90cGFpcnMsXG4gICAgICAgIGNvbG9yOiBwYW5lbC5zcGFya2xpbmUubGluZUNvbG9yLFxuICAgICAgfTtcblxuICAgICAgJC5wbG90KHBsb3RDYW52YXMsIFtwbG90U2VyaWVzXSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgaWYgKCFjdHJsLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGF0YSA9IGN0cmwuZGF0YTtcblxuICAgICAgdmFyIGJvZHkgPSBwYW5lbC5nYXVnZS5zaG93ID8gJycgOiBnZXRCaWdWYWx1ZUh0bWwoKTtcbiAgICAgIHZhciBjb2xvciA9ICcnO1xuICAgICAgaWYgKHBhbmVsLmNvbG9yQmFja2dyb3VuZCkge1xuICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgY29sb3IgPSBwYW5lbC52YWx1ZU1hcHBpbmdDb2xvckJhY2tncm91bmQ7IC8vbnVsbCBvciBncmV5IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sb3IgPSBnZXRDb2xvckZvclZhbHVlKHBhbmVsLnRocmVzaG9sZHMsIGRhdGEudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xvcikge1xuICAgICAgICAgICRwYW5lbENvbnRhaW5lci5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgICAgaWYgKHNjb3BlLmZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRwYW5lbENvbnRhaW5lci5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnJyk7XG4gICAgICAgIGVsZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuICAgICAgICBwYW5lbC5jaXJjbGVCYWNrZ3JvdW5kID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IHRvIENpcmNsZVxuICAgICAgaWYgKHBhbmVsLmNpcmNsZUJhY2tncm91bmQpIHtcbiAgICAgICAgbGV0IGNpcmNsZUhlaWdodCA9ICQoJHBhbmVsQ29udGFpbmVyLmhlaWdodCgpKVswXSAtIDI2O1xuICAgICAgICBsZXQgY2lyY2xlV2lkdGggPSAkKCRwYW5lbENvbnRhaW5lci53aWR0aCgpKVswXTtcblxuICAgICAgICAkKCRwYW5lbENvbnRhaW5lcikuYWRkQ2xhc3MoJ2NpcmNsZScpO1xuICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuXG4gICAgICAgIGlmIChjaXJjbGVXaWR0aCA+PSBjaXJjbGVIZWlnaHQpIHtcbiAgICAgICAgICBlbGVtLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IDUwICsgJyUnLFxuICAgICAgICAgICAgJ3dpZHRoJzogY2lyY2xlSGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICAgICdoZWlnaHQnOiBjaXJjbGVIZWlnaHQgKyAncHgnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBjb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItcmFkaXVzJzogNTAgKyAnJScsXG4gICAgICAgICAgICAnd2lkdGgnOiBjaXJjbGVXaWR0aCArICdweCcsXG4gICAgICAgICAgICAnaGVpZ2h0JzogY2lyY2xlV2lkdGggKyAncHgnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBjb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCRwYW5lbENvbnRhaW5lci5yZW1vdmVDbGFzcygnY2lyY2xlJykpO1xuICAgICAgICBlbGVtLmNzcyh7ICdib3JkZXItcmFkaXVzJzogJzAnLCB3aWR0aDogJycsIGhlaWdodDogJycgfSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW0uaHRtbChib2R5KTtcblxuICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5zaG93KSB7XG4gICAgICAgIGFkZFNwYXJrbGluZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFuZWwuZ2F1Z2Uuc2hvdykge1xuICAgICAgICBhZGRHYXVnZSgpO1xuICAgICAgfVxuXG4gICAgICBlbGVtLnRvZ2dsZUNsYXNzKCdwb2ludGVyJywgcGFuZWwubGlua3MubGVuZ3RoID4gMCk7XG5cbiAgICAgIGlmIChwYW5lbC5saW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxpbmtJbmZvID0gbGlua1Nydi5nZXRQYW5lbExpbmtBbmNob3JJbmZvKHBhbmVsLmxpbmtzWzBdLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlua0luZm8gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpIHtcbiAgICAgIC8vIGRyaWxsZG93biBsaW5rIHRvb2x0aXBcbiAgICAgIHZhciBkcmlsbGRvd25Ub29sdGlwID0gJCgnPGRpdiBpZD1cInRvb2x0aXBcIiBjbGFzcz1cIlwiPmhlbGxvPC9kaXY+XCInKTtcblxuICAgICAgZWxlbS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocGFuZWwubGlua3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGVsZW0uY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmICghbGlua0luZm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWdub3JlIHRpdGxlIGNsaWNrcyBpbiB0aXRsZVxuICAgICAgICBpZiAoJChldnQpLnBhcmVudHMoJy5wYW5lbC1oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLnRhcmdldCA9PT0gJ19ibGFuaycpIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihsaW5rSW5mby5ocmVmLCAnX2JsYW5rJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLmhyZWYuaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rSW5mby5ocmVmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnVybChsaW5rSW5mby5ocmVmKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgZWxlbS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXBhbmVsLmNvbG9yVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkcmlsbGRvd25Ub29sdGlwLnRleHQoZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAucGxhY2VfdHQoZS5wYWdlWCwgZS5wYWdlWSAtIDUwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdyZW5kZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgY3RybC5yZW5kZXJpbmdDb21wbGV0ZWQoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb2xvckZvclZhbHVlKHRocmVzaG9sZHMsIHZhbHVlKSB7XG4gIGxldCBjb2xvciA9ICcnO1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gY29sb3I7XG4gIH1cbiAgZm9yIChsZXQgaSA9IHRocmVzaG9sZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBsZXQgYVRocmVzaG9sZCA9IHRocmVzaG9sZHNbaV07XG4gICAgY29sb3IgPSBhVGhyZXNob2xkLmNvbG9yO1xuICAgICAgaWYgKHZhbHVlID49IGFUaHJlc2hvbGQudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFUaHJlc2hvbGQuY29sb3I7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufVxuXG5leHBvcnQge1NpbmdsZVN0YXRNYXRoQ3RybCwgU2luZ2xlU3RhdE1hdGhDdHJsIGFzIFBhbmVsQ3RybCwgZ2V0Q29sb3JGb3JWYWx1ZX1cbi8vIGV4cG9ydCB7IFNpbmdsZVN0YXRDdHJsLCBTaW5nbGVTdGF0Q3RybCBhcyBQYW5lbEN0cmwsIGdldENvbG9yRm9yVmFsdWUgfTtcbiJdfQ==
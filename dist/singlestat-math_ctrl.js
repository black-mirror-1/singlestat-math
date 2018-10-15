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
                                var mathFunction = this.panel.math;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlc3RhdC1tYXRoX2N0cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2luZ2xlc3RhdC1tYXRoX2N0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnMEJBLDBCQUEwQixVQUFVLEVBQUUsS0FBSztRQUN6QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDdkIsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtnQkFDN0IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQTV6QmdDLHNDQUFnQjtnQkE2RS9DLDRCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFVLE9BQU87b0JBQWpFLFlBQ0Usa0JBQU0sTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQWdCekI7b0JBakJzQyxlQUFTLEdBQVQsU0FBUyxDQUFBO29CQUFVLGFBQU8sR0FBUCxPQUFPLENBQUE7b0JBMUVqRSxjQUFRLEdBQUcsWUFBWSxDQUFDO29CQVF4QixzQkFBZ0IsR0FBVTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO3dC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N0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO3dCQUN2QixNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDNUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkEzeUJNLDhCQUFXLEdBQUcsK0RBQStELENBQUM7Z0JBNHlCdkYseUJBQUM7YUFBQSxBQTd5QkQsQ0FBaUMsc0JBQWdCOzs7UUFnMEJqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgJ2pxdWVyeS5mbG90JztcbmltcG9ydCAnLi9saWIvZmxvdC9qcXVlcnkuZmxvdC5nYXVnZSc7XG5pbXBvcnQgJ2pxdWVyeS5mbG90LnRpbWUnO1xuaW1wb3J0ICdqcXVlcnkuZmxvdC5jcm9zc2hhaXInO1xuaW1wb3J0ICcuL2Nzcy9wYW5lbF9zaW5nbGVzdGF0bWF0aC5jc3MhJztcbmltcG9ydCBtYXRoIGZyb20gJy4vbGliL21hdGhqcy9tYXRoJ1xuXG5pbXBvcnQga2JuIGZyb20gJ2FwcC9jb3JlL3V0aWxzL2tibic7XG5pbXBvcnQgY29uZmlnIGZyb20gJ2FwcC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgVGltZVNlcmllcyBmcm9tICdhcHAvY29yZS90aW1lX3NlcmllczInO1xuaW1wb3J0IHsgTWV0cmljc1BhbmVsQ3RybCwgUGFuZWxDdHJsIH0gZnJvbSAnYXBwL3BsdWdpbnMvc2RrJztcbi8vaW1wb3J0IHsgc3RyaWN0IH0gZnJvbSAnYXNzZXJ0JztcblxuY2xhc3MgU2luZ2xlU3RhdE1hdGhDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZVVybCA9ICdwdWJsaWMvcGx1Z2lucy9ibGFja21pcnJvcjEtc2luZ2xlc3RhdC1tYXRoLXBhbmVsL21vZHVsZS5odG1sJztcblxuICBkYXRhVHlwZSA9ICd0aW1lc2VyaWVzJztcbiAgc2VyaWVzOiBhbnlbXTtcbiAgZGF0YTogYW55O1xuICBmb250U2l6ZXM6IGFueVtdO1xuICB1bml0Rm9ybWF0czogYW55W107XG4gIGludmFsaWRHYXVnZVJhbmdlOiBib29sZWFuO1xuICBwYW5lbDogYW55O1xuICBldmVudHM6IGFueTtcbiAgdmFsdWVOYW1lT3B0aW9uczogYW55W10gPSBbXG4gICAgeyB2YWx1ZTogJ21pbicsIHRleHQ6ICdNaW4nIH0sXG4gICAgeyB2YWx1ZTogJ21heCcsIHRleHQ6ICdNYXgnIH0sXG4gICAgeyB2YWx1ZTogJ2F2ZycsIHRleHQ6ICdBdmVyYWdlJyB9LFxuICAgIHsgdmFsdWU6ICdjdXJyZW50JywgdGV4dDogJ0N1cnJlbnQnIH0sXG4gICAgeyB2YWx1ZTogJ3RvdGFsJywgdGV4dDogJ1RvdGFsJyB9LFxuICAgIHsgdmFsdWU6ICduYW1lJywgdGV4dDogJ05hbWUnIH0sXG4gICAgeyB2YWx1ZTogJ2ZpcnN0JywgdGV4dDogJ0ZpcnN0JyB9LFxuICAgIHsgdmFsdWU6ICdkZWx0YScsIHRleHQ6ICdEZWx0YScgfSxcbiAgICB7IHZhbHVlOiAnZGlmZicsIHRleHQ6ICdEaWZmZXJlbmNlJyB9LFxuICAgIHsgdmFsdWU6ICdyYW5nZScsIHRleHQ6ICdSYW5nZScgfSxcbiAgICB7IHZhbHVlOiAnbGFzdF90aW1lJywgdGV4dDogJ1RpbWUgb2YgbGFzdCBwb2ludCcgfSxcbiAgXTtcbiAgdGFibGVDb2x1bW5PcHRpb25zOiBhbnk7XG4gIHRocmVzaG9sZHM6IGFueVtdO1xuXG4gIC8vIFNldCBhbmQgcG9wdWxhdGUgZGVmYXVsdHNcbiAgcGFuZWxEZWZhdWx0cyA9IHtcbiAgICBsaW5rczogW10sXG4gICAgZGF0YXNvdXJjZTogbnVsbCxcbiAgICBtYXhEYXRhUG9pbnRzOiAxMDAsXG4gICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgdGFyZ2V0czogW3t9XSxcbiAgICBjYWNoZVRpbWVvdXQ6IG51bGwsXG4gICAgZGVmYXVsdENvbG9yOiAncmdiKDExNywgMTE3LCAxMTcpJyxcbiAgICB0aHJlc2hvbGRzOiAnJyxcbiAgICBmb3JtYXQ6ICdub25lJyxcbiAgICBzb3J0T3JkZXI6ICdhc2MnLFxuICAgIHByZWZpeDogJycsXG4gICAgcG9zdGZpeDogJycsXG4gICAgbnVsbFRleHQ6IG51bGwsXG4gICAgdmFsdWVNYXBzOiBbeyB2YWx1ZTogJ251bGwnLCBvcDogJz0nLCB0ZXh0OiAnTm8gZGF0YScgfV0sXG4gICAgbWFwcGluZ1R5cGVzOiBbeyBuYW1lOiAndmFsdWUgdG8gdGV4dCcsIHZhbHVlOiAxIH0sIHsgbmFtZTogJ3JhbmdlIHRvIHRleHQnLCB2YWx1ZTogMiB9XSxcbiAgICByYW5nZU1hcHM6IFt7IGZyb206ICdudWxsJywgdG86ICdudWxsJywgdGV4dDogJ04vQScgfV0sXG4gICAgbWFwcGluZ1R5cGU6IDEsXG4gICAgbnVsbFBvaW50TW9kZTogJ2Nvbm5lY3RlZCcsXG4gICAgdmFsdWVOYW1lOiAnYXZnJyxcbiAgICBwcmVmaXhGb250U2l6ZTogJzUwJScsXG4gICAgdmFsdWVGb250U2l6ZTogJzgwJScsXG4gICAgcG9zdGZpeEZvbnRTaXplOiAnNTAlJyxcbiAgICBtYXRoOiAnJyxcbiAgICBjb2xvckJhY2tncm91bmQ6IGZhbHNlLFxuICAgIGNpcmNsZUJhY2tncm91bmQ6IGZhbHNlLFxuICAgIHZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDogJyM3ODc4NzknLFxuICAgIGNvbG9yVmFsdWU6IGZhbHNlLFxuICAgIHNwYXJrbGluZToge1xuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICBmdWxsOiBmYWxzZSxcbiAgICAgIGxpbmVDb2xvcjogJ3JnYigzMSwgMTIwLCAxOTMpJyxcbiAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMzEsIDExOCwgMTg5LCAwLjE4KScsXG4gICAgfSxcbiAgICBnYXVnZToge1xuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICBtaW5WYWx1ZTogMCxcbiAgICAgIG1heFZhbHVlOiAxMDAsXG4gICAgICB0aHJlc2hvbGRNYXJrZXJzOiB0cnVlLFxuICAgICAgdGhyZXNob2xkTGFiZWxzOiBmYWxzZSxcbiAgICB9LFxuICAgIHNvcnRPcmRlck9wdGlvbnM6IFtcbiAgICAgIHsgdmFsdWU6ICdhc2MnLCB0ZXh0OiAnQXNjZW5kaW5nJ30sXG4gICAgICB7IHZhbHVlOiAnZGVzYycsIHRleHQ6ICdEZXNjZW5kaW5nJ30sXG4gICAgXSxcbiAgICB0YWJsZUNvbHVtbjogJycsXG4gIH07XG5cbiAgLyoqIEBuZ0luamVjdCAqL1xuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgcHJpdmF0ZSAkbG9jYXRpb24sIHByaXZhdGUgbGlua1Nydikge1xuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIHRoaXMucGFuZWxEZWZhdWx0cyk7XG5cbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1yZWNlaXZlZCcsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtZXJyb3InLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLXNuYXBzaG90LWxvYWQnLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdpbml0LWVkaXQtbW9kZScsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZSA9IHRoaXMub25TcGFya2xpbmVGaWxsQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAvL0dyYWIgcHJldmlvdXMgdmVyc2lvbiB0aHJlc2hvbGRzIGFuZCBzdG9yZSBpbnRvIG5ldyBmb3JtYXRcbiAgICB2YXIgdCA9IHRoaXMucGFuZWwudGhyZXNob2xkcztcbiAgICBpZiAodHlwZW9mIHQgPT09ICdzdHJpbmcnIHx8IHQgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMub2xkVGhyZXNoZXNDaGFuZ2UodCk7XG4gICAgfVxuICB9XG5cbiAgb25Jbml0RWRpdE1vZGUoKSB7XG4gICAgdGhpcy5mb250U2l6ZXMgPSBbJzIwJScsICczMCUnLCAnNTAlJywgJzcwJScsICc4MCUnLCAnMTAwJScsICcxMTAlJywgJzEyMCUnLCAnMTUwJScsICcxNzAlJywgJzIwMCUnXTtcbiAgICB0aGlzLmFkZEVkaXRvclRhYignT3B0aW9ucycsICdwdWJsaWMvcGx1Z2lucy9ibGFja21pcnJvcjEtc2luZ2xlc3RhdC1tYXRoLXBhbmVsL2VkaXRvci5odG1sJywgMik7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoJ1ZhbHVlIE1hcHBpbmdzJywgJ3B1YmxpYy9wbHVnaW5zL2JsYWNrbWlycm9yMS1zaW5nbGVzdGF0LW1hdGgtcGFuZWwvbWFwcGluZ3MuaHRtbCcsIDMpO1xuICAgIHRoaXMudW5pdEZvcm1hdHMgPSBrYm4uZ2V0VW5pdEZvcm1hdHMoKTtcbiAgfVxuXG4gIG9sZFRocmVzaGVzQ2hhbmdlKHRocmVzaGVzKSB7XG4gICAgdmFyIGFycmF5ID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgYXJyYXkgPSBKU09OLnBhcnNlKFwiW1wiICsgdGhyZXNoZXMgKyBcIl1cIik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkpTT04gcGFyc2UgZmFpbGVkXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgfVxuICAgIGlmIChhcnJheSA9PT0gbnVsbCkge1xuICAgICAgLy8gdXNlIHNwbGl0IG1ldGhvZCBpbnN0ZWFkXG4gICAgICBhcnJheSA9IHRocmVzaGVzLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gICAgdGhpcy50aHJlc2hvbGRzID0gW107IC8vaW5zdGFudGlhdGUgYSBuZXcgZGVmaW5lZCBkaWN0aW9uYXJ5XG5cbiAgICAvL3B1c2ggb2xkIGl0ZW1zIGludG8gbmV3IGRpY3Rpb25hcnlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdXNlQ29sb3IgPSB0aGlzLnBhbmVsLmRlZmF1bHRDb2xvcjtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5jb2xvcnMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKGkgPCB0aGlzLnBhbmVsLmNvbG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICB1c2VDb2xvciA9IHRoaXMucGFuZWwuY29sb3JzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnRocmVzaG9sZHMucHVzaCh7XG4gICAgICAgIGNvbG9yOiB1c2VDb2xvcixcbiAgICAgICAgdmFsdWU6IE51bWJlcihhcnJheVtpXSksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL092ZXJ3cml0ZSBKU09OXG4gICAgdGhpcy5wYW5lbFtcInRocmVzaG9sZHNcIl0gPSB0aGlzLnRocmVzaG9sZHM7XG4gIH1cblxuICBzb3J0TXlUaHJlc2hlcyhjb250cm9sKSB7XG4gICAgaWYodGhpcy5wYW5lbC5zb3J0T3JkZXIgPT09ICdhc2MnKSB7XG4gICAgICBjb250cm9sLnBhbmVsLnRocmVzaG9sZHMgPSBfLm9yZGVyQnkoY29udHJvbC5wYW5lbC50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiYXNjXCJdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwuc29ydE9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgIGNvbnRyb2wucGFuZWwudGhyZXNob2xkcyA9IF8ub3JkZXJCeShjb250cm9sLnBhbmVsLnRocmVzaG9sZHMsIFtcInZhbHVlXCJdLCBbXCJkZXNjXCJdKTtcbiAgICB9XG4gICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gIH1cblxuICBzZXRVbml0Rm9ybWF0KHN1Ykl0ZW0pIHtcbiAgICB0aGlzLnBhbmVsLmZvcm1hdCA9IHN1Ykl0ZW0udmFsdWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBvbkRhdGFFcnJvcihlcnIpIHtcbiAgICB0aGlzLm9uRGF0YVJlY2VpdmVkKFtdKTtcbiAgfVxuXG4gIG9uRWRpdG9yUmVtb3ZlVGhyZXNob2xkKGluZGV4KSB7XG4gICAgdGhpcy5wYW5lbC50aHJlc2hvbGRzLnNwbGljZShpbmRleCwgMSlcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgb25FZGl0b3JBZGRUaHJlc2hvbGQoKSB7XG4gICAgdGhpcy5wYW5lbC50aHJlc2hvbGRzLnB1c2goe2NvbG9yOiB0aGlzLnBhbmVsLmRlZmF1bHRDb2xvcn0pXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0ge307XG4gICAgaWYgKGRhdGFMaXN0Lmxlbmd0aCA+IDAgJiYgZGF0YUxpc3RbMF0udHlwZSA9PT0gJ3RhYmxlJykge1xuICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0YWJsZSc7XG4gICAgICBjb25zdCB0YWJsZURhdGEgPSBkYXRhTGlzdC5tYXAodGhpcy50YWJsZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFRhYmxlVmFsdWVzKHRhYmxlRGF0YSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gICAgICB0aGlzLnNlcmllcyA9IGRhdGFMaXN0Lm1hcCh0aGlzLnNlcmllc0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFZhbHVlcyhkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXSxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcblxuICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKHRoaXMucGFuZWwubnVsbFBvaW50TW9kZSk7XG4gICAgcmV0dXJuIHNlcmllcztcbiAgfVxuXG4gIHRhYmxlSGFuZGxlcih0YWJsZURhdGEpIHtcbiAgICBjb25zdCBkYXRhcG9pbnRzID0gW107XG4gICAgY29uc3QgY29sdW1uTmFtZXMgPSB7fTtcblxuICAgIHRhYmxlRGF0YS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgIGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XSA9IGNvbHVtbi50ZXh0O1xuICAgIH0pO1xuXG4gICAgdGhpcy50YWJsZUNvbHVtbk9wdGlvbnMgPSBjb2x1bW5OYW1lcztcbiAgICBpZiAoIV8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgWyd0ZXh0JywgdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0pKSB7XG4gICAgICB0aGlzLnNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKTtcbiAgICB9XG5cbiAgICB0YWJsZURhdGEucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICBjb25zdCBkYXRhcG9pbnQgPSB7fTtcblxuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBjb2x1bW5OYW1lc1tjb2x1bW5JbmRleF07XG4gICAgICAgIGRhdGFwb2ludFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgZGF0YXBvaW50cy5wdXNoKGRhdGFwb2ludCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXBvaW50cztcbiAgfVxuXG4gIHNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKSB7XG4gICAgaWYgKHRhYmxlRGF0YS5jb2x1bW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IHRhYmxlRGF0YS5jb2x1bW5zWzBdLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSBfLmZpbmQodGFibGVEYXRhLmNvbHVtbnMsIGNvbCA9PiB7XG4gICAgICAgIHJldHVybiBjb2wudHlwZSAhPT0gJ3RpbWUnO1xuICAgICAgfSkudGV4dDtcbiAgICB9XG4gIH1cblxuICBzZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpIHtcbiAgICBpZiAoIXRhYmxlRGF0YSB8fCB0YWJsZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlRGF0YVswXS5sZW5ndGggPT09IDAgfHwgdGFibGVEYXRhWzBdWzBdW3RoaXMucGFuZWwudGFibGVDb2x1bW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcG9pbnQgPSB0YWJsZURhdGFbMF1bMF07XG4gICAgZGF0YS52YWx1ZSA9IGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXTtcblxuICAgIGlmIChfLmlzU3RyaW5nKGRhdGEudmFsdWUpKSB7XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUoZGF0YS52YWx1ZSk7XG4gICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhcbiAgICAgICAgZGF0YXBvaW50W3RoaXMucGFuZWwudGFibGVDb2x1bW5dLFxuICAgICAgICBkZWNpbWFsSW5mby5kZWNpbWFscyxcbiAgICAgICAgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHNcbiAgICAgICk7XG4gICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIHRoaXMucGFuZWwuZGVjaW1hbHMgfHwgMCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBjYW5DaGFuZ2VGb250U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5nYXVnZS5zaG93O1xuICB9XG5cbiAgb25TcGFya2xpbmVDb2xvckNoYW5nZShuZXdDb2xvcikge1xuICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvciA9IG5ld0NvbG9yO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvblNwYXJrbGluZUZpbGxDaGFuZ2UobmV3Q29sb3IpIHtcbiAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IgPSBuZXdDb2xvcjtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVjaW1hbHNGb3JWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChfLmlzTnVtYmVyKHRoaXMucGFuZWwuZGVjaW1hbHMpKSB7XG4gICAgICByZXR1cm4geyBkZWNpbWFsczogdGhpcy5wYW5lbC5kZWNpbWFscywgc2NhbGVkRGVjaW1hbHM6IG51bGwgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB2YWx1ZSAvIDI7XG4gICAgdmFyIGRlYyA9IC1NYXRoLmZsb29yKE1hdGgubG9nKGRlbHRhKSAvIE1hdGguTE4xMCk7XG5cbiAgICB2YXIgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcbiAgICAgIG5vcm0gPSBkZWx0YSAvIG1hZ24sIC8vIG5vcm0gaXMgYmV0d2VlbiAxLjAgYW5kIDEwLjBcbiAgICAgIHNpemU7XG5cbiAgICBpZiAobm9ybSA8IDEuNSkge1xuICAgICAgc2l6ZSA9IDE7XG4gICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xuICAgICAgc2l6ZSA9IDI7XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDIuNSwgcmVxdWlyZXMgYW4gZXh0cmEgZGVjaW1hbFxuICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XG4gICAgICAgIHNpemUgPSAyLjU7XG4gICAgICAgICsrZGVjO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xuICAgICAgc2l6ZSA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSAxMDtcbiAgICB9XG5cbiAgICBzaXplICo9IG1hZ247XG5cbiAgICAvLyByZWR1Y2Ugc3RhcnRpbmcgZGVjaW1hbHMgaWYgbm90IG5lZWRlZFxuICAgIGlmIChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUpIHtcbiAgICAgIGRlYyA9IDA7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdDogYW55ID0ge307XG4gICAgcmVzdWx0LmRlY2ltYWxzID0gTWF0aC5tYXgoMCwgZGVjKTtcbiAgICByZXN1bHQuc2NhbGVkRGVjaW1hbHMgPSByZXN1bHQuZGVjaW1hbHMgLSBNYXRoLmZsb29yKE1hdGgubG9nKHNpemUpIC8gTWF0aC5MTjEwKSArIDI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGEpIHtcbiAgICBkYXRhLmZsb3RwYWlycyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuc2VyaWVzLmxlbmd0aCA+IDEgfHwgdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IFtdO1xuICAgICAgbGV0IGxhc3RWYWx1ZSA9IFtdO1xuICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGFzdFBvaW50W2luZGV4XSA9IF8ubGFzdChlbGVtZW50LmRhdGFwb2ludHMpO1xuICAgICAgICBsYXN0VmFsdWVbaW5kZXhdID0gXy5pc0FycmF5KGxhc3RQb2ludFtpbmRleF0pID8gbGFzdFBvaW50W2luZGV4XVswXSA6IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbmFtZScpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMuc2VyaWVzWzBdLmFsaWFzO1xuXG4gICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGFzdFZhbHVlWzBdKSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGxhc3RWYWx1ZVswXSk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICdsYXN0X3RpbWUnKSB7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWUgPSBsYXN0UG9pbnRbMF1bMV07XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgMCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wYW5lbC5tYXRoLmxlbmd0aCl7XG4gICAgICAgICAgdmFyIG1hdGhGdW5jdGlvbiA9IHRoaXMucGFuZWwubWF0aDtcbiAgICAgICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgbWF0aEZ1bmN0aW9uID0gbWF0aEZ1bmN0aW9uLnJlcGxhY2UobmV3IFJlZ0V4cChlbGVtZW50LmFsaWFzLCAnZ2knKSwgU3RyaW5nKGVsZW1lbnQuc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1hdGhGdW5jdGlvbiA9IG1hdGhGdW5jdGlvbi5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tBLXphLXpdKycsICdnaScpLCBTdHJpbmcoMCkpO1xuICAgICAgICAgICAgZGF0YS52YWx1ZSA9IG1hdGguZXZhbChtYXRoRnVuY3Rpb24pO1xuICAgICAgICAgICAgZGF0YS5mbG90cGFpcnMgPSB0aGlzLnNlcmllc1swXS5mbG90cGFpcnM7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy9FcnJvciBldmFsdWF0aW5nIGZ1bmN0aW9uLiBEZWZhdWx0aW5nIHRvIHplcm8uXG4gICAgICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgICAgIGRhdGEuZmxvdHBhaXJzID0gWzAsMF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgZGF0YS52YWx1ZSA9IHRoaXMuc2VyaWVzWzBdLnN0YXRzW3RoaXMucGFuZWwudmFsdWVOYW1lXTtcbiAgICAgICAgICBkYXRhLmZsb3RwYWlycyA9IHRoaXMuc2VyaWVzWzBdLmZsb3RwYWlycztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgaWYodGhpcy5zZXJpZXMgJiYgdGhpcy5zZXJpZXMubGVuZ3RoID4gMCl7XG4gICAgICAgIGRhdGEuc2NvcGVkVmFycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhbmVsLnNjb3BlZFZhcnMpO1xuICAgICAgICBkYXRhLnNjb3BlZFZhcnNbJ19fbmFtZSddID0geyB2YWx1ZTogdGhpcy5zZXJpZXNbMF0ubGFiZWwgfTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA8IDIgJiYgIXRoaXMucGFuZWwubWF0aC5sZW5ndGgpIHtcbiAgICAgIGxldCBsYXN0UG9pbnQgPSBfLmxhc3QodGhpcy5zZXJpZXNbMF0uZGF0YXBvaW50cyk7XG4gICAgICBsZXQgbGFzdFZhbHVlID0gXy5pc0FycmF5KGxhc3RQb2ludCkgPyBsYXN0UG9pbnRbMF0gOiBudWxsO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICduYW1lJykge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gdGhpcy5zZXJpZXNbMF0uYWxpYXM7XG4gICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGFzdFZhbHVlKSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGxhc3RWYWx1ZSk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICdsYXN0X3RpbWUnKSB7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWUgPSBsYXN0UG9pbnRbMV07XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgMCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhLnZhbHVlID0gdGhpcy5zZXJpZXNbMF0uc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdO1xuICAgICAgICBkYXRhLmZsb3RwYWlycyA9IHRoaXMuc2VyaWVzWzBdLmZsb3RwYWlycztcblxuICAgICAgICBsZXQgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzLCBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgJF9fbmFtZSB2YXJpYWJsZSBmb3IgdXNpbmcgaW4gcHJlZml4IG9yIHBvc3RmaXhcbiAgICAgIGRhdGEuc2NvcGVkVmFycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhbmVsLnNjb3BlZFZhcnMpO1xuICAgICAgZGF0YS5zY29wZWRWYXJzWydfX25hbWUnXSA9IHsgdmFsdWU6IHRoaXMuc2VyaWVzWzBdLmxhYmVsIH07XG4gICAgfVxuICAgIHRoaXMuc2V0VmFsdWVNYXBwaW5nKGRhdGEpO1xuICB9XG5cbiAgc2V0VmFsdWVNYXBwaW5nKGRhdGEpIHtcbiAgICAvLyBjaGVjayB2YWx1ZSB0byB0ZXh0IG1hcHBpbmdzIGlmIGl0cyBlbmFibGVkXG4gICAgaWYgKHRoaXMucGFuZWwubWFwcGluZ1R5cGUgPT09IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbC52YWx1ZU1hcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG1hcCA9IHRoaXMucGFuZWwudmFsdWVNYXBzW2ldO1xuICAgICAgICAvLyBzcGVjaWFsIG51bGwgY2FzZVxuICAgICAgICBpZiAobWFwLnZhbHVlID09PSAnbnVsbCcpIHtcbiAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWx1ZS9udW1iZXIgdG8gdGV4dCBtYXBwaW5nXG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlRmxvYXQobWFwLnZhbHVlKTtcbiAgICAgICAgaWYgKHZhbHVlID09PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwubWFwcGluZ1R5cGUgPT09IDIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYW5lbC5yYW5nZU1hcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG1hcCA9IHRoaXMucGFuZWwucmFuZ2VNYXBzW2ldO1xuICAgICAgICAvLyBzcGVjaWFsIG51bGwgY2FzZVxuICAgICAgICBpZiAobWFwLmZyb20gPT09ICdudWxsJyAmJiBtYXAudG8gPT09ICdudWxsJykge1xuICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlL251bWJlciB0byByYW5nZSBtYXBwaW5nXG4gICAgICAgIHZhciBmcm9tID0gcGFyc2VGbG9hdChtYXAuZnJvbSk7XG4gICAgICAgIHZhciB0byA9IHBhcnNlRmxvYXQobWFwLnRvKTtcbiAgICAgICAgaWYgKHRvID49IGRhdGEudmFsdWVSb3VuZGVkICYmIGZyb20gPD0gZGF0YS52YWx1ZVJvdW5kZWQpIHtcbiAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEudmFsdWUgPT09IG51bGwgfHwgZGF0YS52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gJ25vIHZhbHVlJztcbiAgICB9XG4gIH1cblxuICByZW1vdmVWYWx1ZU1hcChtYXApIHtcbiAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YodGhpcy5wYW5lbC52YWx1ZU1hcHMsIG1hcCk7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkVmFsdWVNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC52YWx1ZU1hcHMucHVzaCh7IHZhbHVlOiAnJywgb3A6ICc9JywgdGV4dDogJycgfSk7XG4gIH1cblxuICByZW1vdmVSYW5nZU1hcChyYW5nZU1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFJhbmdlTWFwKCkge1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnB1c2goeyBmcm9tOiAnJywgdG86ICcnLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgdmFyICRsb2NhdGlvbiA9IHRoaXMuJGxvY2F0aW9uO1xuICAgIHZhciBsaW5rU3J2ID0gdGhpcy5saW5rU3J2O1xuICAgIHZhciAkdGltZW91dCA9IHRoaXMuJHRpbWVvdXQ7XG4gICAgdmFyIHBhbmVsID0gY3RybC5wYW5lbDtcbiAgICB2YXIgdGVtcGxhdGVTcnYgPSB0aGlzLnRlbXBsYXRlU3J2O1xuICAgIHZhciBkYXRhLCBsaW5rSW5mbztcbiAgICB2YXIgJHBhbmVsQ29udGFpbmVyID0gZWxlbS5maW5kKCcucGFuZWwtY29udGFpbmVyJyk7XG4gICAgZWxlbSA9IGVsZW0uZmluZCgnLnNpbmdsZXN0YXRtYXRoLXBhbmVsJyk7XG5cbiAgICBmdW5jdGlvbiBhcHBseUNvbG9yaW5nVGhyZXNob2xkcyh2YWx1ZSwgdmFsdWVTdHJpbmcpIHtcbiAgICAgIGlmICghcGFuZWwuY29sb3JWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWVTdHJpbmc7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9IGdldENvbG9yRm9yVmFsdWUocGFuZWwudGhyZXNob2xkcywgZGF0YS52YWx1ZSk7XG5cbiAgICAgIGlmIChkYXRhLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgY29sb3IgPSBwYW5lbC52YWx1ZU1hcHBpbmdDb2xvckJhY2tncm91bmQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2xvcikge1xuICAgICAgICByZXR1cm4gJzxzcGFuIHN0eWxlPVwiY29sb3I6JyArIGNvbG9yICsgJ1wiPicgKyB2YWx1ZVN0cmluZyArICc8L3NwYW4+JztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlU3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNwYW4oY2xhc3NOYW1lLCBmb250U2l6ZSwgdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdGVtcGxhdGVTcnYucmVwbGFjZSh2YWx1ZSwgZGF0YS5zY29wZWRWYXJzKTtcbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiIHN0eWxlPVwiZm9udC1zaXplOicgKyBmb250U2l6ZSArICdcIj4nICsgdmFsdWUgKyAnPC9zcGFuPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmlnVmFsdWVIdG1sKCkge1xuICAgICAgdmFyIGJvZHkgPSAnPGRpdiBjbGFzcz1cInNpbmdsZXN0YXRtYXRoLXBhbmVsLXZhbHVlLWNvbnRhaW5lclwiPic7XG5cbiAgICAgIGlmIChwYW5lbC5wcmVmaXgpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIHBhbmVsLnByZWZpeCk7XG4gICAgICAgIGJvZHkgKz0gZ2V0U3Bhbignc2luZ2xlc3RhdG1hdGgtcGFuZWwtcHJlZml4JywgcGFuZWwucHJlZml4Rm9udFNpemUsIHByZWZpeCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIGRhdGEudmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC12YWx1ZScsIHBhbmVsLnZhbHVlRm9udFNpemUsIHZhbHVlKTtcblxuICAgICAgaWYgKHBhbmVsLnBvc3RmaXgpIHtcbiAgICAgICAgdmFyIHBvc3RmaXggPSBhcHBseUNvbG9yaW5nVGhyZXNob2xkcyhkYXRhLnZhbHVlLCBwYW5lbC5wb3N0Zml4KTtcbiAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC1wb3N0Zml4JywgcGFuZWwucG9zdGZpeEZvbnRTaXplLCBwb3N0Zml4KTtcbiAgICAgIH1cblxuICAgICAgYm9keSArPSAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVUZXh0KCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhbmVsLnByZWZpeCA/IHRlbXBsYXRlU3J2LnJlcGxhY2UocGFuZWwucHJlZml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG4gICAgICByZXN1bHQgKz0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIHJlc3VsdCArPSBwYW5lbC5wb3N0Zml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wb3N0Zml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkR2F1Z2UoKSB7XG4gICAgICB2YXIgd2lkdGggPSBlbGVtLndpZHRoKCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gZWxlbS5oZWlnaHQoKTtcbiAgICAgIC8vIEFsbG93IHRvIHVzZSBhIGJpdCBtb3JlIHNwYWNlIGZvciB3aWRlIGdhdWdlc1xuICAgICAgdmFyIGRpbWVuc2lvbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQgKiAxLjMpO1xuXG4gICAgICBjdHJsLmludmFsaWRHYXVnZVJhbmdlID0gZmFsc2U7XG4gICAgICBpZiAocGFuZWwuZ2F1Z2UubWluVmFsdWUgPiBwYW5lbC5nYXVnZS5tYXhWYWx1ZSkge1xuICAgICAgICBjdHJsLmludmFsaWRHYXVnZVJhbmdlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGxvdENhbnZhcyA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICB2YXIgcGxvdENzcyA9IHtcbiAgICAgICAgdG9wOiAnMTBweCcsXG4gICAgICAgIG1hcmdpbjogJ2F1dG8nLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgKiAwLjkgKyAncHgnLFxuICAgICAgICB3aWR0aDogZGltZW5zaW9uICsgJ3B4JyxcbiAgICAgIH07XG5cbiAgICAgIHBsb3RDYW52YXMuY3NzKHBsb3RDc3MpO1xuXG4gICAgICB2YXIgdGhyZXNob2xkcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYW5lbC50aHJlc2hvbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRocmVzaG9sZHMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IHBhbmVsLnRocmVzaG9sZHNbaV0udmFsdWUsXG4gICAgICAgICAgY29sb3I6IHBhbmVsLnRocmVzaG9sZHNbaV0uY29sb3IsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IHBhbmVsLmdhdWdlLm1heFZhbHVlLFxuICAgICAgICBjb2xvcjogcGFuZWwudGhyZXNob2xkc1twYW5lbC50aHJlc2hvbGRzLmxlbmd0aCAtIDFdLFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBiZ0NvbG9yID0gY29uZmlnLmJvb3REYXRhLnVzZXIubGlnaHRUaGVtZSA/ICdyZ2IoMjMwLDIzMCwyMzApJyA6ICdyZ2IoMzgsMzgsMzgpJztcblxuICAgICAgdmFyIGZvbnRTY2FsZSA9IHBhcnNlSW50KHBhbmVsLnZhbHVlRm9udFNpemUpIC8gMTAwO1xuICAgICAgdmFyIGZvbnRTaXplID0gTWF0aC5taW4oZGltZW5zaW9uIC8gNSwgMTAwKSAqIGZvbnRTY2FsZTtcbiAgICAgIC8vIFJlZHVjZSBnYXVnZSB3aWR0aCBpZiB0aHJlc2hvbGQgbGFiZWxzIGVuYWJsZWRcbiAgICAgIHZhciBnYXVnZVdpZHRoUmVkdWNlUmF0aW8gPSBwYW5lbC5nYXVnZS50aHJlc2hvbGRMYWJlbHMgPyAxLjUgOiAxO1xuICAgICAgdmFyIGdhdWdlV2lkdGggPSBNYXRoLm1pbihkaW1lbnNpb24gLyA2LCA2MCkgLyBnYXVnZVdpZHRoUmVkdWNlUmF0aW87XG4gICAgICB2YXIgdGhyZXNob2xkTWFya2Vyc1dpZHRoID0gZ2F1Z2VXaWR0aCAvIDU7XG4gICAgICB2YXIgdGhyZXNob2xkTGFiZWxGb250U2l6ZSA9IGZvbnRTaXplIC8gMi41O1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZ2F1Z2VzOiB7XG4gICAgICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgICBtaW46IHBhbmVsLmdhdWdlLm1pblZhbHVlLFxuICAgICAgICAgICAgICBtYXg6IHBhbmVsLmdhdWdlLm1heFZhbHVlLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB7IGNvbG9yOiBiZ0NvbG9yIH0sXG4gICAgICAgICAgICAgIGJvcmRlcjogeyBjb2xvcjogbnVsbCB9LFxuICAgICAgICAgICAgICBzaGFkb3c6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgICAgd2lkdGg6IGdhdWdlV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnJhbWU6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxhYmVsOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICBsYXlvdXQ6IHsgbWFyZ2luOiAwLCB0aHJlc2hvbGRXaWR0aDogMCB9LFxuICAgICAgICAgICAgY2VsbDogeyBib3JkZXI6IHsgd2lkdGg6IDAgfSB9LFxuICAgICAgICAgICAgdGhyZXNob2xkOiB7XG4gICAgICAgICAgICAgIHZhbHVlczogdGhyZXNob2xkcyxcbiAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRMYWJlbHMsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGggKyAxLFxuICAgICAgICAgICAgICAgIGZvbnQ6IHsgc2l6ZTogdGhyZXNob2xkTGFiZWxGb250U2l6ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRNYXJrZXJzLFxuICAgICAgICAgICAgICB3aWR0aDogdGhyZXNob2xkTWFya2Vyc1dpZHRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBwYW5lbC5jb2xvclZhbHVlID8gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlUm91bmRlZCkgOiBudWxsLFxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZVRleHQoKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZm9udDoge1xuICAgICAgICAgICAgICAgIHNpemU6IGZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZhbWlseTogJ1wiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgZWxlbS5hcHBlbmQocGxvdENhbnZhcyk7XG5cbiAgICAgIHZhciBwbG90U2VyaWVzID0ge1xuICAgICAgICBkYXRhOiBbWzAsIGRhdGEudmFsdWVSb3VuZGVkXV0sXG4gICAgICB9O1xuXG4gICAgICAkLnBsb3QocGxvdENhbnZhcywgW3Bsb3RTZXJpZXNdLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTcGFya2xpbmUoKSB7XG4gICAgICB2YXIgd2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIGlmICh3aWR0aCA8IDMwKSB7XG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIG5vdCBnb3R0ZW4gaXQncyB3aWR0aCB5ZXRcbiAgICAgICAgLy8gZGVsYXkgc3BhcmtsaW5lIHJlbmRlclxuICAgICAgICBzZXRUaW1lb3V0KGFkZFNwYXJrbGluZSwgMzApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBoZWlnaHQgPSBjdHJsLmhlaWdodDtcbiAgICAgIHZhciBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIHZhciBwbG90Q3NzOiBhbnkgPSB7fTtcbiAgICAgIHBsb3RDc3MucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gICAgICBpZiAocGFuZWwuc3BhcmtsaW5lLmZ1bGwpIHtcbiAgICAgICAgcGxvdENzcy5ib3R0b20gPSAnNXB4JztcbiAgICAgICAgcGxvdENzcy5sZWZ0ID0gJy01cHgnO1xuICAgICAgICBwbG90Q3NzLndpZHRoID0gd2lkdGggLSAxMCArICdweCc7XG4gICAgICAgIHZhciBkeW5hbWljSGVpZ2h0TWFyZ2luID0gaGVpZ2h0IDw9IDEwMCA/IDUgOiBNYXRoLnJvdW5kKGhlaWdodCAvIDEwMCkgKiAxNSArIDU7XG4gICAgICAgIHBsb3RDc3MuaGVpZ2h0ID0gaGVpZ2h0IC0gZHluYW1pY0hlaWdodE1hcmdpbiArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICcwcHgnO1xuICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgIHBsb3RDc3Mud2lkdGggPSB3aWR0aCAtIDEwICsgJ3B4JztcbiAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAqIDAuMjUpICsgJ3B4JztcbiAgICAgIH1cblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBsZWdlbmQ6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgbGluZXM6IHtcbiAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICBmaWxsOiAxLFxuICAgICAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICAgICAgZmlsbENvbG9yOiBwYW5lbC5zcGFya2xpbmUuZmlsbENvbG9yLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHlheGVzOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgIHhheGlzOiB7XG4gICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgbW9kZTogJ3RpbWUnLFxuICAgICAgICAgIG1pbjogY3RybC5yYW5nZS5mcm9tLnZhbHVlT2YoKSxcbiAgICAgICAgICBtYXg6IGN0cmwucmFuZ2UudG8udmFsdWVPZigpLFxuICAgICAgICB9LFxuICAgICAgICBncmlkOiB7IGhvdmVyYWJsZTogZmFsc2UsIHNob3c6IGZhbHNlIH0sXG4gICAgICB9O1xuXG4gICAgICBlbGVtLmFwcGVuZChwbG90Q2FudmFzKTtcblxuICAgICAgdmFyIHBsb3RTZXJpZXMgPSB7XG4gICAgICAgIGRhdGE6IGRhdGEuZmxvdHBhaXJzLFxuICAgICAgICBjb2xvcjogcGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvcixcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIGlmICghY3RybC5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRhdGEgPSBjdHJsLmRhdGE7XG5cbiAgICAgIHZhciBib2R5ID0gcGFuZWwuZ2F1Z2Uuc2hvdyA/ICcnIDogZ2V0QmlnVmFsdWVIdG1sKCk7XG4gICAgICB2YXIgY29sb3IgPSAnJztcbiAgICAgIGlmIChwYW5lbC5jb2xvckJhY2tncm91bmQpIHtcbiAgICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbG9yID0gcGFuZWwudmFsdWVNYXBwaW5nQ29sb3JCYWNrZ3JvdW5kOyAvL251bGwgb3IgZ3JleSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgIGlmIChzY29wZS5mdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgcGFuZWwuY2lyY2xlQmFja2dyb3VuZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCB0byBDaXJjbGVcbiAgICAgIGlmIChwYW5lbC5jaXJjbGVCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGxldCBjaXJjbGVIZWlnaHQgPSAkKCRwYW5lbENvbnRhaW5lci5oZWlnaHQoKSlbMF0gLSAyNjtcbiAgICAgICAgbGV0IGNpcmNsZVdpZHRoID0gJCgkcGFuZWxDb250YWluZXIud2lkdGgoKSlbMF07XG5cbiAgICAgICAgJCgkcGFuZWxDb250YWluZXIpLmFkZENsYXNzKCdjaXJjbGUnKTtcbiAgICAgICAgJHBhbmVsQ29udGFpbmVyLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcblxuICAgICAgICBpZiAoY2lyY2xlV2lkdGggPj0gY2lyY2xlSGVpZ2h0KSB7XG4gICAgICAgICAgZWxlbS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlci1yYWRpdXMnOiA1MCArICclJyxcbiAgICAgICAgICAgICd3aWR0aCc6IGNpcmNsZUhlaWdodCArICdweCcsXG4gICAgICAgICAgICAnaGVpZ2h0JzogY2lyY2xlSGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IDUwICsgJyUnLFxuICAgICAgICAgICAgJ3dpZHRoJzogY2lyY2xlV2lkdGggKyAncHgnLFxuICAgICAgICAgICAgJ2hlaWdodCc6IGNpcmNsZVdpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgkcGFuZWxDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NpcmNsZScpKTtcbiAgICAgICAgZWxlbS5jc3MoeyAnYm9yZGVyLXJhZGl1cyc6ICcwJywgd2lkdGg6ICcnLCBoZWlnaHQ6ICcnIH0pO1xuICAgICAgfVxuXG4gICAgICBlbGVtLmh0bWwoYm9keSk7XG5cbiAgICAgIGlmIChwYW5lbC5zcGFya2xpbmUuc2hvdykge1xuICAgICAgICBhZGRTcGFya2xpbmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmVsLmdhdWdlLnNob3cpIHtcbiAgICAgICAgYWRkR2F1Z2UoKTtcbiAgICAgIH1cblxuICAgICAgZWxlbS50b2dnbGVDbGFzcygncG9pbnRlcicsIHBhbmVsLmxpbmtzLmxlbmd0aCA+IDApO1xuXG4gICAgICBpZiAocGFuZWwubGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5rSW5mbyA9IGxpbmtTcnYuZ2V0UGFuZWxMaW5rQW5jaG9ySW5mbyhwYW5lbC5saW5rc1swXSwgZGF0YS5zY29wZWRWYXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmtJbmZvID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gaG9va3VwRHJpbGxkb3duTGlua1Rvb2x0aXAoKSB7XG4gICAgICAvLyBkcmlsbGRvd24gbGluayB0b29sdGlwXG4gICAgICB2YXIgZHJpbGxkb3duVG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJ0b29sdGlwXCIgY2xhc3M9XCJcIj5oZWxsbzwvZGl2PlwiJyk7XG5cbiAgICAgIGVsZW0ubW91c2VsZWF2ZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHBhbmVsLmxpbmtzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBkcmlsbGRvd25Ub29sdGlwLmRldGFjaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoIWxpbmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlnbm9yZSB0aXRsZSBjbGlja3MgaW4gdGl0bGVcbiAgICAgICAgaWYgKCQoZXZ0KS5wYXJlbnRzKCcucGFuZWwtaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW5rSW5mby50YXJnZXQgPT09ICdfYmxhbmsnKSB7XG4gICAgICAgICAgd2luZG93Lm9wZW4obGlua0luZm8uaHJlZiwgJ19ibGFuaycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW5rSW5mby5ocmVmLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGlua0luZm8uaHJlZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi51cmwobGlua0luZm8uaHJlZik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmlsbGRvd25Ub29sdGlwLmRldGFjaCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGVsZW0ubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCFwYW5lbC5jb2xvclZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJpbGxkb3duVG9vbHRpcC50ZXh0KGRhdGEudmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICBkcmlsbGRvd25Ub29sdGlwLnBsYWNlX3R0KGUucGFnZVgsIGUucGFnZVkgLSA1MCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaG9va3VwRHJpbGxkb3duTGlua1Rvb2x0aXAoKTtcbiAgICB0aGlzLmV2ZW50cy5vbigncmVuZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JGb3JWYWx1ZSh0aHJlc2hvbGRzLCB2YWx1ZSkge1xuICBsZXQgY29sb3IgPSAnJztcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG4gIGZvciAobGV0IGkgPSB0aHJlc2hvbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGV0IGFUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW2ldO1xuICAgIGNvbG9yID0gYVRocmVzaG9sZC5jb2xvcjtcbiAgICAgIGlmICh2YWx1ZSA+PSBhVGhyZXNob2xkLnZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhVGhyZXNob2xkLmNvbG9yO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IHtTaW5nbGVTdGF0TWF0aEN0cmwsIFNpbmdsZVN0YXRNYXRoQ3RybCBhcyBQYW5lbEN0cmwsIGdldENvbG9yRm9yVmFsdWV9XG4vLyBleHBvcnQgeyBTaW5nbGVTdGF0Q3RybCwgU2luZ2xlU3RhdEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH07XG4iXX0=
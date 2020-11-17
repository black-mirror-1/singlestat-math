System.register(["lodash", "jquery", "jquery.flot", "./lib/flot/jquery.flot.gauge", "jquery.flot.time", "jquery.flot.crosshair", "./css/panel_singlestatmath.css!", "./lib/mathjs/math", "app/core/utils/kbn", "app/core/config", "app/core/time_series2", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
            if (value >= aThreshold.displayvalue) {
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
                        tooltip: {
                            show: true
                        },
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
                        valueMappingColorBackground: '#767171',
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
                    this._updateThresholdValues();
                    if (this.panel.sortOrder === 'asc') {
                        control.panel.thresholds = lodash_1.default.orderBy(control.panel.thresholds, ["displayvalue"], ["asc"]);
                    }
                    else if (this.panel.sortOrder === 'desc') {
                        control.panel.thresholds = lodash_1.default.orderBy(control.panel.thresholds, ["displayvalue"], ["desc"]);
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
                SingleStatMathCtrl.prototype._doMath = function (mathFunction, data) {
                    var _this = this;
                    this.series.forEach(function (element) {
                        mathFunction = mathFunction.replace(new RegExp(element.alias, 'gi'), String(element.stats[_this.panel.valueName]));
                    });
                    try {
                        mathFunction = mathFunction.replace(new RegExp('\\b[A-Za-z]+(?!\\()\\b', 'gi'), String(0));
                        data.value = math_1.default.eval(mathFunction);
                        data.flotpairs = this.series[0].flotpairs;
                    }
                    catch (e) {
                        data.value = 0;
                        data.flotpairs = [0, 0];
                    }
                };
                SingleStatMathCtrl.prototype._calcDisplayValue = function (val) {
                    var haschars = new RegExp('[a-z]+', 'gi');
                    if (haschars.test(val)) {
                        var datatmp = { 'value': 0 };
                        this._doMath(val, datatmp);
                        return datatmp.value;
                    }
                    else {
                        return val;
                    }
                };
                SingleStatMathCtrl.prototype._updateThresholdValues = function () {
                    for (var i = 0; i < this.panel.thresholds.length; i++) {
                        var dispval = this._calcDisplayValue(this.panel.thresholds[i].value);
                        if (dispval > this.panel.gauge.maxDisplayValue) {
                            dispval = this.panel.gauge.maxDisplayValue;
                        }
                        this.panel.thresholds[i].displayvalue = dispval;
                    }
                };
                SingleStatMathCtrl.prototype._updateMinMaxValues = function () {
                    if (this.panel.gauge.minValue != undefined) {
                        this.panel.gauge.minDisplayValue = this._calcDisplayValue(this.panel.gauge.minValue);
                    }
                    else {
                        this.panel.gauge.minDisplayValue = 0;
                    }
                    if (this.panel.gauge.maxValue != undefined) {
                        this.panel.gauge.maxDisplayValue = this._calcDisplayValue(this.panel.gauge.maxValue);
                    }
                    else {
                        this.panel.gauge.maxDisplayValue = 100;
                    }
                };
                SingleStatMathCtrl.prototype.setValues = function (data) {
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
                                this._doMath(this.panel.math, data);
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
                        this._updateMinMaxValues();
                        if (this.panel.gauge.show) {
                            this._updateThresholdValues();
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
                        if (panel.gauge.minDisplayValue > panel.gauge.maxDisplayValue) {
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
                        for (var i = 1; i < panel.thresholds.length; i++) {
                            thresholds.push({
                                value: panel.thresholds[i].displayvalue,
                                color: panel.thresholds[i - 1].color,
                            });
                        }
                        thresholds.push({
                            value: panel.gauge.maxDisplayValue,
                            color: panel.thresholds[panel.thresholds.length - 1].color,
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
                                        min: panel.gauge.minDisplayValue,
                                        max: panel.gauge.maxDisplayValue,
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
                        if (ctrl.panel.description) {
                            var drilldownTooltip = jquery_1.default('<div id="tooltip" class="" style="background:white;margin:auto;color:black;width:200px;box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);"><h6 style="color:black;">'
                                + ctrl.panel.title + '</h6>' + ctrl.panel.description + '</div>"');
                        }
                        else {
                            var drilldownTooltip = jquery_1.default('<div id="tooltip" class="" style="background:white;margin:auto;color:black;width:200px;box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);"><h6 style="color:black;">'
                                + ctrl.panel.title + '</h6>No Description</div>"');
                        }
                        elem.mouseleave(function () {
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
                            if (!ctrl.panel.tooltip.show) {
                                return;
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlc3RhdC1tYXRoX2N0cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2luZ2xlc3RhdC1tYXRoX2N0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXkzQkEsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsS0FBSztRQUN6QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDekIsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtnQkFDcEMsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQXIzQmdDLHNDQUFnQjtnQkFnRi9DLDRCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFVLE9BQU87b0JBQWpFLFlBQ0Usa0JBQU0sTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQWdCekI7b0JBakJzQyxlQUFTLEdBQVQsU0FBUyxDQUFBO29CQUFVLGFBQU8sR0FBUCxPQUFPLENBQUE7b0JBN0VqRSxjQUFRLEdBQUcsWUFBWSxDQUFDO29CQVF4QixzQkFBZ0IsR0FBVTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVB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RCwwQkFBMEIsRUFBRSxDQUFDO29CQUU3QixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7d0JBQ3ZCLE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUM1QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQXAyQk0sOEJBQVcsR0FBRywrREFBK0QsQ0FBQztnQkFxMkJ2Rix5QkFBQzthQUFBLEFBdDJCRCxDQUFpQyxzQkFBZ0I7OztRQXkzQmpELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCAnanF1ZXJ5LmZsb3QnO1xuaW1wb3J0ICcuL2xpYi9mbG90L2pxdWVyeS5mbG90LmdhdWdlJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QudGltZSc7XG5pbXBvcnQgJ2pxdWVyeS5mbG90LmNyb3NzaGFpcic7XG5pbXBvcnQgJy4vY3NzL3BhbmVsX3NpbmdsZXN0YXRtYXRoLmNzcyEnO1xuaW1wb3J0IG1hdGggZnJvbSAnLi9saWIvbWF0aGpzL21hdGgnXG5cbmltcG9ydCBrYm4gZnJvbSAnYXBwL2NvcmUvdXRpbHMva2JuJztcbmltcG9ydCBjb25maWcgZnJvbSAnYXBwL2NvcmUvY29uZmlnJztcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gJ2FwcC9jb3JlL3RpbWVfc2VyaWVzMic7XG5pbXBvcnQgeyBNZXRyaWNzUGFuZWxDdHJsLCBQYW5lbEN0cmwgfSBmcm9tICdhcHAvcGx1Z2lucy9zZGsnO1xuLy9pbXBvcnQgeyBzdHJpY3QgfSBmcm9tICdhc3NlcnQnO1xuXG5jbGFzcyBTaW5nbGVTdGF0TWF0aEN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gJ3B1YmxpYy9wbHVnaW5zL2JsYWNrbWlycm9yMS1zaW5nbGVzdGF0LW1hdGgtcGFuZWwvbW9kdWxlLmh0bWwnO1xuXG4gIGRhdGFUeXBlID0gJ3RpbWVzZXJpZXMnO1xuICBzZXJpZXM6IGFueVtdO1xuICBkYXRhOiBhbnk7XG4gIGZvbnRTaXplczogYW55W107XG4gIHVuaXRGb3JtYXRzOiBhbnlbXTtcbiAgaW52YWxpZEdhdWdlUmFuZ2U6IGJvb2xlYW47XG4gIHBhbmVsOiBhbnk7XG4gIGV2ZW50czogYW55O1xuICB2YWx1ZU5hbWVPcHRpb25zOiBhbnlbXSA9IFtcbiAgICB7IHZhbHVlOiAnbWluJywgdGV4dDogJ01pbicgfSxcbiAgICB7IHZhbHVlOiAnbWF4JywgdGV4dDogJ01heCcgfSxcbiAgICB7IHZhbHVlOiAnYXZnJywgdGV4dDogJ0F2ZXJhZ2UnIH0sXG4gICAgeyB2YWx1ZTogJ2N1cnJlbnQnLCB0ZXh0OiAnQ3VycmVudCcgfSxcbiAgICB7IHZhbHVlOiAndG90YWwnLCB0ZXh0OiAnVG90YWwnIH0sXG4gICAgeyB2YWx1ZTogJ25hbWUnLCB0ZXh0OiAnTmFtZScgfSxcbiAgICB7IHZhbHVlOiAnZmlyc3QnLCB0ZXh0OiAnRmlyc3QnIH0sXG4gICAgeyB2YWx1ZTogJ2RlbHRhJywgdGV4dDogJ0RlbHRhJyB9LFxuICAgIHsgdmFsdWU6ICdkaWZmJywgdGV4dDogJ0RpZmZlcmVuY2UnIH0sXG4gICAgeyB2YWx1ZTogJ3JhbmdlJywgdGV4dDogJ1JhbmdlJyB9LFxuICAgIHsgdmFsdWU6ICdsYXN0X3RpbWUnLCB0ZXh0OiAnVGltZSBvZiBsYXN0IHBvaW50JyB9LFxuICBdO1xuICB0YWJsZUNvbHVtbk9wdGlvbnM6IGFueTtcbiAgdGhyZXNob2xkczogYW55W107XG5cbiAgLy8gU2V0IGFuZCBwb3B1bGF0ZSBkZWZhdWx0c1xuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIGxpbmtzOiBbXSxcbiAgICBkYXRhc291cmNlOiBudWxsLFxuICAgIG1heERhdGFQb2ludHM6IDEwMCxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICB0YXJnZXRzOiBbe31dLFxuICAgIGNhY2hlVGltZW91dDogbnVsbCxcbiAgICBkZWZhdWx0Q29sb3I6ICdyZ2IoMTE3LCAxMTcsIDExNyknLFxuICAgIHRocmVzaG9sZHM6ICcnLFxuICAgIGZvcm1hdDogJ25vbmUnLFxuICAgIHRvb2x0aXA6IHtcbiAgICAgIHNob3c6IHRydWVcbiAgICB9LFxuICAgIHNvcnRPcmRlcjogJ2FzYycsXG4gICAgcHJlZml4OiAnJyxcbiAgICBwb3N0Zml4OiAnJyxcbiAgICBudWxsVGV4dDogbnVsbCxcbiAgICB2YWx1ZU1hcHM6IFt7IHZhbHVlOiAnbnVsbCcsIG9wOiAnPScsIHRleHQ6ICdObyBkYXRhJyB9XSxcbiAgICBtYXBwaW5nVHlwZXM6IFt7IG5hbWU6ICd2YWx1ZSB0byB0ZXh0JywgdmFsdWU6IDEgfSwgeyBuYW1lOiAncmFuZ2UgdG8gdGV4dCcsIHZhbHVlOiAyIH1dLFxuICAgIHJhbmdlTWFwczogW3sgZnJvbTogJ251bGwnLCB0bzogJ251bGwnLCB0ZXh0OiAnTi9BJyB9XSxcbiAgICBtYXBwaW5nVHlwZTogMSxcbiAgICBudWxsUG9pbnRNb2RlOiAnY29ubmVjdGVkJyxcbiAgICB2YWx1ZU5hbWU6ICdhdmcnLFxuICAgIHByZWZpeEZvbnRTaXplOiAnNTAlJyxcbiAgICB2YWx1ZUZvbnRTaXplOiAnODAlJyxcbiAgICBwb3N0Zml4Rm9udFNpemU6ICc1MCUnLFxuICAgIG1hdGg6ICcnLFxuICAgIGNvbG9yQmFja2dyb3VuZDogZmFsc2UsXG4gICAgY2lyY2xlQmFja2dyb3VuZDogZmFsc2UsXG4gICAgdmFsdWVNYXBwaW5nQ29sb3JCYWNrZ3JvdW5kOiAnIzc2NzE3MScsXG4gICAgY29sb3JWYWx1ZTogZmFsc2UsXG4gICAgc3BhcmtsaW5lOiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGZ1bGw6IGZhbHNlLFxuICAgICAgbGluZUNvbG9yOiAncmdiKDMxLCAxMjAsIDE5MyknLFxuICAgICAgZmlsbENvbG9yOiAncmdiYSgzMSwgMTE4LCAxODksIDAuMTgpJyxcbiAgICB9LFxuICAgIGdhdWdlOiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIG1pblZhbHVlOiAwLFxuICAgICAgbWF4VmFsdWU6IDEwMCxcbiAgICAgIHRocmVzaG9sZE1hcmtlcnM6IHRydWUsXG4gICAgICB0aHJlc2hvbGRMYWJlbHM6IGZhbHNlLFxuICAgIH0sXG4gICAgc29ydE9yZGVyT3B0aW9uczogW1xuICAgICAgeyB2YWx1ZTogJ2FzYycsIHRleHQ6ICdBc2NlbmRpbmcnIH0sXG4gICAgICB7IHZhbHVlOiAnZGVzYycsIHRleHQ6ICdEZXNjZW5kaW5nJyB9LFxuICAgIF0sXG4gICAgdGFibGVDb2x1bW46ICcnLFxuICB9O1xuXG4gIC8qKiBAbmdJbmplY3QgKi9cbiAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IsIHByaXZhdGUgJGxvY2F0aW9uLCBwcml2YXRlIGxpbmtTcnYpIHtcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XG4gICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCB0aGlzLnBhbmVsRGVmYXVsdHMpO1xuXG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtcmVjZWl2ZWQnLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLWVycm9yJywgdGhpcy5vbkRhdGFFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1zbmFwc2hvdC1sb2FkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbignaW5pdC1lZGl0LW1vZGUnLCB0aGlzLm9uSW5pdEVkaXRNb2RlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5vblNwYXJrbGluZUNvbG9yQ2hhbmdlID0gdGhpcy5vblNwYXJrbGluZUNvbG9yQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblNwYXJrbGluZUZpbGxDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgLy9HcmFiIHByZXZpb3VzIHZlcnNpb24gdGhyZXNob2xkcyBhbmQgc3RvcmUgaW50byBuZXcgZm9ybWF0XG4gICAgdmFyIHQgPSB0aGlzLnBhbmVsLnRocmVzaG9sZHM7XG4gICAgaWYgKHR5cGVvZiB0ID09PSAnc3RyaW5nJyB8fCB0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLm9sZFRocmVzaGVzQ2hhbmdlKHQpO1xuICAgIH1cbiAgfVxuXG4gIG9uSW5pdEVkaXRNb2RlKCkge1xuICAgIHRoaXMuZm9udFNpemVzID0gWycyMCUnLCAnMzAlJywgJzUwJScsICc3MCUnLCAnODAlJywgJzEwMCUnLCAnMTEwJScsICcxMjAlJywgJzE1MCUnLCAnMTcwJScsICcyMDAlJ107XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoJ09wdGlvbnMnLCAncHVibGljL3BsdWdpbnMvYmxhY2ttaXJyb3IxLXNpbmdsZXN0YXQtbWF0aC1wYW5lbC9lZGl0b3IuaHRtbCcsIDIpO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKCdWYWx1ZSBNYXBwaW5ncycsICdwdWJsaWMvcGx1Z2lucy9ibGFja21pcnJvcjEtc2luZ2xlc3RhdC1tYXRoLXBhbmVsL21hcHBpbmdzLmh0bWwnLCAzKTtcbiAgICB0aGlzLnVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gIH1cblxuICBvbGRUaHJlc2hlc0NoYW5nZSh0aHJlc2hlcykge1xuICAgIHZhciBhcnJheSA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGFycmF5ID0gSlNPTi5wYXJzZShcIltcIiArIHRocmVzaGVzICsgXCJdXCIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coXCJKU09OIHBhcnNlIGZhaWxlZFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAoYXJyYXkgPT09IG51bGwpIHtcbiAgICAgIC8vIHVzZSBzcGxpdCBtZXRob2QgaW5zdGVhZFxuICAgICAgYXJyYXkgPSB0aHJlc2hlcy5zcGxpdChcIixcIik7XG4gICAgfVxuICAgIHRoaXMudGhyZXNob2xkcyA9IFtdOyAvL2luc3RhbnRpYXRlIGEgbmV3IGRlZmluZWQgZGljdGlvbmFyeVxuXG4gICAgLy9wdXNoIG9sZCBpdGVtcyBpbnRvIG5ldyBkaWN0aW9uYXJ5XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHVzZUNvbG9yID0gdGhpcy5wYW5lbC5kZWZhdWx0Q29sb3I7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFuZWwuY29sb3JzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmIChpIDwgdGhpcy5wYW5lbC5jb2xvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdXNlQ29sb3IgPSB0aGlzLnBhbmVsLmNvbG9yc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy50aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICBjb2xvcjogdXNlQ29sb3IsXG4gICAgICAgIHZhbHVlOiBOdW1iZXIoYXJyYXlbaV0pLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9PdmVyd3JpdGUgSlNPTlxuICAgIHRoaXMucGFuZWxbXCJ0aHJlc2hvbGRzXCJdID0gdGhpcy50aHJlc2hvbGRzO1xuICB9XG5cbiAgc29ydE15VGhyZXNoZXMoY29udHJvbCkge1xuICAgIHRoaXMuX3VwZGF0ZVRocmVzaG9sZFZhbHVlcygpO1xuICAgIGlmICh0aGlzLnBhbmVsLnNvcnRPcmRlciA9PT0gJ2FzYycpIHtcbiAgICAgIGNvbnRyb2wucGFuZWwudGhyZXNob2xkcyA9IF8ub3JkZXJCeShjb250cm9sLnBhbmVsLnRocmVzaG9sZHMsIFtcImRpc3BsYXl2YWx1ZVwiXSwgW1wiYXNjXCJdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwuc29ydE9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgIGNvbnRyb2wucGFuZWwudGhyZXNob2xkcyA9IF8ub3JkZXJCeShjb250cm9sLnBhbmVsLnRocmVzaG9sZHMsIFtcImRpc3BsYXl2YWx1ZVwiXSwgW1wiZGVzY1wiXSk7XG4gICAgfVxuICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICB9XG5cbiAgc2V0VW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgdGhpcy5wYW5lbC5mb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgdGhpcy5vbkRhdGFSZWNlaXZlZChbXSk7XG4gIH1cblxuICBvbkVkaXRvclJlbW92ZVRocmVzaG9sZChpbmRleCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRWRpdG9yQWRkVGhyZXNob2xkKCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5wdXNoKHsgY29sb3I6IHRoaXMucGFuZWwuZGVmYXVsdENvbG9yIH0pXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0ge307XG4gICAgaWYgKGRhdGFMaXN0Lmxlbmd0aCA+IDAgJiYgZGF0YUxpc3RbMF0udHlwZSA9PT0gJ3RhYmxlJykge1xuICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0YWJsZSc7XG4gICAgICBjb25zdCB0YWJsZURhdGEgPSBkYXRhTGlzdC5tYXAodGhpcy50YWJsZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFRhYmxlVmFsdWVzKHRhYmxlRGF0YSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gICAgICB0aGlzLnNlcmllcyA9IGRhdGFMaXN0Lm1hcCh0aGlzLnNlcmllc0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFZhbHVlcyhkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXSxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcblxuICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKHRoaXMucGFuZWwubnVsbFBvaW50TW9kZSk7XG4gICAgcmV0dXJuIHNlcmllcztcbiAgfVxuXG4gIHRhYmxlSGFuZGxlcih0YWJsZURhdGEpIHtcbiAgICBjb25zdCBkYXRhcG9pbnRzID0gW107XG4gICAgY29uc3QgY29sdW1uTmFtZXMgPSB7fTtcblxuICAgIHRhYmxlRGF0YS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgIGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XSA9IGNvbHVtbi50ZXh0O1xuICAgIH0pO1xuXG4gICAgdGhpcy50YWJsZUNvbHVtbk9wdGlvbnMgPSBjb2x1bW5OYW1lcztcbiAgICBpZiAoIV8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgWyd0ZXh0JywgdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0pKSB7XG4gICAgICB0aGlzLnNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKTtcbiAgICB9XG5cbiAgICB0YWJsZURhdGEucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICBjb25zdCBkYXRhcG9pbnQgPSB7fTtcblxuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBjb2x1bW5OYW1lc1tjb2x1bW5JbmRleF07XG4gICAgICAgIGRhdGFwb2ludFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgZGF0YXBvaW50cy5wdXNoKGRhdGFwb2ludCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXBvaW50cztcbiAgfVxuXG4gIHNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKSB7XG4gICAgaWYgKHRhYmxlRGF0YS5jb2x1bW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IHRhYmxlRGF0YS5jb2x1bW5zWzBdLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSBfLmZpbmQodGFibGVEYXRhLmNvbHVtbnMsIGNvbCA9PiB7XG4gICAgICAgIHJldHVybiBjb2wudHlwZSAhPT0gJ3RpbWUnO1xuICAgICAgfSkudGV4dDtcbiAgICB9XG4gIH1cblxuICBzZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpIHtcbiAgICBpZiAoIXRhYmxlRGF0YSB8fCB0YWJsZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlRGF0YVswXS5sZW5ndGggPT09IDAgfHwgdGFibGVEYXRhWzBdWzBdW3RoaXMucGFuZWwudGFibGVDb2x1bW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcG9pbnQgPSB0YWJsZURhdGFbMF1bMF07XG4gICAgZGF0YS52YWx1ZSA9IGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXTtcblxuICAgIGlmIChfLmlzU3RyaW5nKGRhdGEudmFsdWUpKSB7XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUoZGF0YS52YWx1ZSk7XG4gICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhcbiAgICAgICAgZGF0YXBvaW50W3RoaXMucGFuZWwudGFibGVDb2x1bW5dLFxuICAgICAgICBkZWNpbWFsSW5mby5kZWNpbWFscyxcbiAgICAgICAgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHNcbiAgICAgICk7XG4gICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIHRoaXMucGFuZWwuZGVjaW1hbHMgfHwgMCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBjYW5DaGFuZ2VGb250U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5nYXVnZS5zaG93O1xuICB9XG5cbiAgb25TcGFya2xpbmVDb2xvckNoYW5nZShuZXdDb2xvcikge1xuICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvciA9IG5ld0NvbG9yO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvblNwYXJrbGluZUZpbGxDaGFuZ2UobmV3Q29sb3IpIHtcbiAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IgPSBuZXdDb2xvcjtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVjaW1hbHNGb3JWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChfLmlzTnVtYmVyKHRoaXMucGFuZWwuZGVjaW1hbHMpKSB7XG4gICAgICByZXR1cm4geyBkZWNpbWFsczogdGhpcy5wYW5lbC5kZWNpbWFscywgc2NhbGVkRGVjaW1hbHM6IG51bGwgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB2YWx1ZSAvIDI7XG4gICAgdmFyIGRlYyA9IC1NYXRoLmZsb29yKE1hdGgubG9nKGRlbHRhKSAvIE1hdGguTE4xMCk7XG5cbiAgICB2YXIgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcbiAgICAgIG5vcm0gPSBkZWx0YSAvIG1hZ24sIC8vIG5vcm0gaXMgYmV0d2VlbiAxLjAgYW5kIDEwLjBcbiAgICAgIHNpemU7XG5cbiAgICBpZiAobm9ybSA8IDEuNSkge1xuICAgICAgc2l6ZSA9IDE7XG4gICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xuICAgICAgc2l6ZSA9IDI7XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDIuNSwgcmVxdWlyZXMgYW4gZXh0cmEgZGVjaW1hbFxuICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XG4gICAgICAgIHNpemUgPSAyLjU7XG4gICAgICAgICsrZGVjO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xuICAgICAgc2l6ZSA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSAxMDtcbiAgICB9XG5cbiAgICBzaXplICo9IG1hZ247XG5cbiAgICAvLyByZWR1Y2Ugc3RhcnRpbmcgZGVjaW1hbHMgaWYgbm90IG5lZWRlZFxuICAgIGlmIChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUpIHtcbiAgICAgIGRlYyA9IDA7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdDogYW55ID0ge307XG4gICAgcmVzdWx0LmRlY2ltYWxzID0gTWF0aC5tYXgoMCwgZGVjKTtcbiAgICByZXN1bHQuc2NhbGVkRGVjaW1hbHMgPSByZXN1bHQuZGVjaW1hbHMgLSBNYXRoLmZsb29yKE1hdGgubG9nKHNpemUpIC8gTWF0aC5MTjEwKSArIDI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgX2RvTWF0aChtYXRoRnVuY3Rpb24sIGRhdGEpIHtcbiAgICB0aGlzLnNlcmllcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgbWF0aEZ1bmN0aW9uID0gbWF0aEZ1bmN0aW9uLnJlcGxhY2UobmV3IFJlZ0V4cChlbGVtZW50LmFsaWFzLCAnZ2knKSwgU3RyaW5nKGVsZW1lbnQuc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdKSk7XG4gICAgfSk7XG4gICAgdHJ5IHtcbiAgICAgIG1hdGhGdW5jdGlvbiA9IG1hdGhGdW5jdGlvbi5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiW0EtWmEtel0rKD8hXFxcXCgpXFxcXGInLCAnZ2knKSwgU3RyaW5nKDApKTtcbiAgICAgIGRhdGEudmFsdWUgPSBtYXRoLmV2YWwobWF0aEZ1bmN0aW9uKTtcbiAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vRXJyb3IgZXZhbHVhdGluZyBmdW5jdGlvbi4gRGVmYXVsdGluZyB0byB6ZXJvLlxuICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICBkYXRhLmZsb3RwYWlycyA9IFswLCAwXTtcbiAgICB9XG4gIH1cblxuICBfY2FsY0Rpc3BsYXlWYWx1ZSh2YWwpIHtcbiAgICB2YXIgaGFzY2hhcnMgPSBuZXcgUmVnRXhwKCdbYS16XSsnLCAnZ2knKTtcbiAgICBpZiAoaGFzY2hhcnMudGVzdCh2YWwpKSB7XG4gICAgICB2YXIgZGF0YXRtcCA9IHsgJ3ZhbHVlJzogMCB9O1xuICAgICAgdGhpcy5fZG9NYXRoKHZhbCwgZGF0YXRtcCk7XG4gICAgICByZXR1cm4gZGF0YXRtcC52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVUaHJlc2hvbGRWYWx1ZXMoKSB7XG4gICAgLy8gU2V0IHRoZSBkaXNwbGF5IHZhbHVlIG9uIGFueSB0aHJlc2hvbGRzIHRoYXQgbWF5IG5lZWQgdG8gcnVuIG1hdGggZnVuY3Rpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFuZWwudGhyZXNob2xkcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRpc3B2YWwgPSB0aGlzLl9jYWxjRGlzcGxheVZhbHVlKHRoaXMucGFuZWwudGhyZXNob2xkc1tpXS52YWx1ZSk7XG4gICAgICBpZiAoZGlzcHZhbCA+IHRoaXMucGFuZWwuZ2F1Z2UubWF4RGlzcGxheVZhbHVlKSB7XG4gICAgICAgIGRpc3B2YWwgPSB0aGlzLnBhbmVsLmdhdWdlLm1heERpc3BsYXlWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFuZWwudGhyZXNob2xkc1tpXS5kaXNwbGF5dmFsdWUgPSBkaXNwdmFsO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNaW5NYXhWYWx1ZXMoKSB7XG4gICAgLy8gU2V0IHRoZSBkaXNwbGF5IHZhbHVlIG9uIGFueSBNYXggb3IgTWluIHRoYXQgbWF5IG5lZWQgdG8gcnVuIG1hdGggZnVuY3Rpb25cbiAgICAvLyBJZiB2YWx1ZSBpcyB1bmRlZmluZWQsIHVzZSBkZWZhdWx0cyB1bnRpbCB2YWx1ZSBzZXRcbiAgICBpZiAodGhpcy5wYW5lbC5nYXVnZS5taW5WYWx1ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucGFuZWwuZ2F1Z2UubWluRGlzcGxheVZhbHVlID0gdGhpcy5fY2FsY0Rpc3BsYXlWYWx1ZSh0aGlzLnBhbmVsLmdhdWdlLm1pblZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5nYXVnZS5taW5EaXNwbGF5VmFsdWUgPSAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYW5lbC5nYXVnZS5tYXhWYWx1ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucGFuZWwuZ2F1Z2UubWF4RGlzcGxheVZhbHVlID0gdGhpcy5fY2FsY0Rpc3BsYXlWYWx1ZSh0aGlzLnBhbmVsLmdhdWdlLm1heFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5nYXVnZS5tYXhEaXNwbGF5VmFsdWUgPSAxMDA7XG4gICAgfVxuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGEpIHtcbiAgICBkYXRhLmZsb3RwYWlycyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuc2VyaWVzLmxlbmd0aCA+IDEgfHwgdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IFtdO1xuICAgICAgbGV0IGxhc3RWYWx1ZSA9IFtdO1xuICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGFzdFBvaW50W2luZGV4XSA9IF8ubGFzdChlbGVtZW50LmRhdGFwb2ludHMpO1xuICAgICAgICBsYXN0VmFsdWVbaW5kZXhdID0gXy5pc0FycmF5KGxhc3RQb2ludFtpbmRleF0pID8gbGFzdFBvaW50W2luZGV4XVswXSA6IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbmFtZScpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMuc2VyaWVzWzBdLmFsaWFzO1xuXG4gICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGFzdFZhbHVlWzBdKSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGxhc3RWYWx1ZVswXSk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICdsYXN0X3RpbWUnKSB7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWUgPSBsYXN0UG9pbnRbMF1bMV07XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgMCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuX2RvTWF0aCh0aGlzLnBhbmVsLm1hdGgsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgICAgZGF0YS5mbG90cGFpcnMgPSB0aGlzLnNlcmllc1swXS5mbG90cGFpcnM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzLCBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlTWluTWF4VmFsdWVzKCk7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLmdhdWdlLnNob3cpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVGhyZXNob2xkVmFsdWVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICAgIGRhdGEuc2NvcGVkVmFyc1snX19uYW1lJ10gPSB7IHZhbHVlOiB0aGlzLnNlcmllc1swXS5sYWJlbCB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXJpZXMubGVuZ3RoIDwgMiAmJiAhdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgIGxldCBsYXN0VmFsdWUgPSBfLmlzQXJyYXkobGFzdFBvaW50KSA/IGxhc3RQb2ludFswXSA6IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnNlcmllc1swXS5hbGlhcztcbiAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ2xhc3RfdGltZScpIHtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGxhc3RQb2ludFsxXTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBkYXRhLnZhbHVlO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICBkYXRhLnNjb3BlZFZhcnNbJ19fbmFtZSddID0geyB2YWx1ZTogdGhpcy5zZXJpZXNbMF0ubGFiZWwgfTtcbiAgICB9XG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBzZXRWYWx1ZU1hcHBpbmcoZGF0YSkge1xuICAgIC8vIGNoZWNrIHZhbHVlIHRvIHRleHQgbWFwcGluZ3MgaWYgaXRzIGVuYWJsZWRcbiAgICBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnZhbHVlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC52YWx1ZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAudmFsdWUgPT09ICdudWxsJykge1xuICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlL251bWJlciB0byB0ZXh0IG1hcHBpbmdcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChtYXAudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnJhbmdlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC5yYW5nZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAuZnJvbSA9PT0gJ251bGwnICYmIG1hcC50byA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IG51bGwgfHwgZGF0YS52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsdWUvbnVtYmVyIHRvIHJhbmdlIG1hcHBpbmdcbiAgICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG1hcC5mcm9tKTtcbiAgICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChtYXAudG8pO1xuICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHsgdmFsdWU6ICcnLCBvcDogJz0nLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7IGZyb206ICcnLCB0bzogJycsIHRleHQ6ICcnIH0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICB2YXIgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgdmFyIGxpbmtTcnYgPSB0aGlzLmxpbmtTcnY7XG4gICAgdmFyICR0aW1lb3V0ID0gdGhpcy4kdGltZW91dDtcbiAgICB2YXIgcGFuZWwgPSBjdHJsLnBhbmVsO1xuICAgIHZhciB0ZW1wbGF0ZVNydiA9IHRoaXMudGVtcGxhdGVTcnY7XG4gICAgdmFyIGRhdGEsIGxpbmtJbmZvO1xuICAgIHZhciAkcGFuZWxDb250YWluZXIgPSBlbGVtLmZpbmQoJy5wYW5lbC1jb250YWluZXInKTtcbiAgICBlbGVtID0gZWxlbS5maW5kKCcuc2luZ2xlc3RhdG1hdGgtcGFuZWwnKTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlLCB2YWx1ZVN0cmluZykge1xuICAgICAgaWYgKCFwYW5lbC5jb2xvclZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVN0cmluZztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcblxuICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBjb2xvciA9IHBhbmVsLnZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiAnPHNwYW4gc3R5bGU9XCJjb2xvcjonICsgY29sb3IgKyAnXCI+JyArIHZhbHVlU3RyaW5nICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3BhbihjbGFzc05hbWUsIGZvbnRTaXplLCB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHZhbHVlLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCIgc3R5bGU9XCJmb250LXNpemU6JyArIGZvbnRTaXplICsgJ1wiPicgKyB2YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICB2YXIgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdG1hdGgtcGFuZWwtdmFsdWUtY29udGFpbmVyXCI+JztcblxuICAgICAgaWYgKHBhbmVsLnByZWZpeCkge1xuICAgICAgICB2YXIgcHJlZml4ID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgcGFuZWwucHJlZml4KTtcbiAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC1wcmVmaXgnLCBwYW5lbC5wcmVmaXhGb250U2l6ZSwgcHJlZml4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXZhbHVlJywgcGFuZWwudmFsdWVGb250U2l6ZSwgdmFsdWUpO1xuXG4gICAgICBpZiAocGFuZWwucG9zdGZpeCkge1xuICAgICAgICB2YXIgcG9zdGZpeCA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIHBhbmVsLnBvc3RmaXgpO1xuICAgICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXBvc3RmaXgnLCBwYW5lbC5wb3N0Zml4Rm9udFNpemUsIHBvc3RmaXgpO1xuICAgICAgfVxuXG4gICAgICBib2R5ICs9ICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZVRleHQoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFuZWwucHJlZml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wcmVmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcbiAgICAgIHJlc3VsdCArPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgcmVzdWx0ICs9IHBhbmVsLnBvc3RmaXggPyB0ZW1wbGF0ZVNydi5yZXBsYWNlKHBhbmVsLnBvc3RmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRHYXVnZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgIHZhciBoZWlnaHQgPSBlbGVtLmhlaWdodCgpO1xuICAgICAgLy8gQWxsb3cgdG8gdXNlIGEgYml0IG1vcmUgc3BhY2UgZm9yIHdpZGUgZ2F1Z2VzXG4gICAgICB2YXIgZGltZW5zaW9uID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCAqIDEuMyk7XG5cbiAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSBmYWxzZTtcbiAgICAgIGlmIChwYW5lbC5nYXVnZS5taW5EaXNwbGF5VmFsdWUgPiBwYW5lbC5nYXVnZS5tYXhEaXNwbGF5VmFsdWUpIHtcbiAgICAgICAgY3RybC5pbnZhbGlkR2F1Z2VSYW5nZSA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBsb3RDYW52YXMgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgICAgdmFyIHBsb3RDc3MgPSB7XG4gICAgICAgIHRvcDogJzEwcHgnLFxuICAgICAgICBtYXJnaW46ICdhdXRvJyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0ICogMC45ICsgJ3B4JyxcbiAgICAgICAgd2lkdGg6IGRpbWVuc2lvbiArICdweCcsXG4gICAgICB9O1xuXG4gICAgICBwbG90Q2FudmFzLmNzcyhwbG90Q3NzKTtcblxuICAgICAgdmFyIHRocmVzaG9sZHMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcGFuZWwudGhyZXNob2xkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiBwYW5lbC50aHJlc2hvbGRzW2ldLmRpc3BsYXl2YWx1ZSxcbiAgICAgICAgICBjb2xvcjogcGFuZWwudGhyZXNob2xkc1tpIC0gMV0uY29sb3IsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IHBhbmVsLmdhdWdlLm1heERpc3BsYXlWYWx1ZSxcbiAgICAgICAgY29sb3I6IHBhbmVsLnRocmVzaG9sZHNbcGFuZWwudGhyZXNob2xkcy5sZW5ndGggLSAxXS5jb2xvcixcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYmdDb2xvciA9IGNvbmZpZy5ib290RGF0YS51c2VyLmxpZ2h0VGhlbWUgPyAncmdiKDIzMCwyMzAsMjMwKScgOiAncmdiKDM4LDM4LDM4KSc7XG5cbiAgICAgIHZhciBmb250U2NhbGUgPSBwYXJzZUludChwYW5lbC52YWx1ZUZvbnRTaXplKSAvIDEwMDtcbiAgICAgIHZhciBmb250U2l6ZSA9IE1hdGgubWluKGRpbWVuc2lvbiAvIDUsIDEwMCkgKiBmb250U2NhbGU7XG4gICAgICAvLyBSZWR1Y2UgZ2F1Z2Ugd2lkdGggaWYgdGhyZXNob2xkIGxhYmVscyBlbmFibGVkXG4gICAgICB2YXIgZ2F1Z2VXaWR0aFJlZHVjZVJhdGlvID0gcGFuZWwuZ2F1Z2UudGhyZXNob2xkTGFiZWxzID8gMS41IDogMTtcbiAgICAgIHZhciBnYXVnZVdpZHRoID0gTWF0aC5taW4oZGltZW5zaW9uIC8gNiwgNjApIC8gZ2F1Z2VXaWR0aFJlZHVjZVJhdGlvO1xuICAgICAgdmFyIHRocmVzaG9sZE1hcmtlcnNXaWR0aCA9IGdhdWdlV2lkdGggLyA1O1xuICAgICAgdmFyIHRocmVzaG9sZExhYmVsRm9udFNpemUgPSBmb250U2l6ZSAvIDIuNTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHNlcmllczoge1xuICAgICAgICAgIGdhdWdlczoge1xuICAgICAgICAgICAgZ2F1Z2U6IHtcbiAgICAgICAgICAgICAgbWluOiBwYW5lbC5nYXVnZS5taW5EaXNwbGF5VmFsdWUsXG4gICAgICAgICAgICAgIG1heDogcGFuZWwuZ2F1Z2UubWF4RGlzcGxheVZhbHVlLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB7IGNvbG9yOiBiZ0NvbG9yIH0sXG4gICAgICAgICAgICAgIGJvcmRlcjogeyBjb2xvcjogbnVsbCB9LFxuICAgICAgICAgICAgICBzaGFkb3c6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgICAgd2lkdGg6IGdhdWdlV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnJhbWU6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxhYmVsOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICBsYXlvdXQ6IHsgbWFyZ2luOiAwLCB0aHJlc2hvbGRXaWR0aDogMCB9LFxuICAgICAgICAgICAgY2VsbDogeyBib3JkZXI6IHsgd2lkdGg6IDAgfSB9LFxuICAgICAgICAgICAgdGhyZXNob2xkOiB7XG4gICAgICAgICAgICAgIHZhbHVlczogdGhyZXNob2xkcyxcbiAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRMYWJlbHMsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGggKyAxLFxuICAgICAgICAgICAgICAgIGZvbnQ6IHsgc2l6ZTogdGhyZXNob2xkTGFiZWxGb250U2l6ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRNYXJrZXJzLFxuICAgICAgICAgICAgICB3aWR0aDogdGhyZXNob2xkTWFya2Vyc1dpZHRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBwYW5lbC5jb2xvclZhbHVlID8gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlUm91bmRlZCkgOiBudWxsLFxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWVUZXh0KCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgICBzaXplOiBmb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmYW1pbHk6ICdcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGVsZW0uYXBwZW5kKHBsb3RDYW52YXMpO1xuXG4gICAgICB2YXIgcGxvdFNlcmllcyA9IHtcbiAgICAgICAgZGF0YTogW1swLCBkYXRhLnZhbHVlUm91bmRlZF1dLFxuICAgICAgfTtcblxuICAgICAgJC5wbG90KHBsb3RDYW52YXMsIFtwbG90U2VyaWVzXSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3BhcmtsaW5lKCkge1xuICAgICAgdmFyIHdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICBpZiAod2lkdGggPCAzMCkge1xuICAgICAgICAvLyBlbGVtZW50IGhhcyBub3QgZ290dGVuIGl0J3Mgd2lkdGggeWV0XG4gICAgICAgIC8vIGRlbGF5IHNwYXJrbGluZSByZW5kZXJcbiAgICAgICAgc2V0VGltZW91dChhZGRTcGFya2xpbmUsIDMwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaGVpZ2h0ID0gY3RybC5oZWlnaHQ7XG4gICAgICB2YXIgcGxvdENhbnZhcyA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICB2YXIgcGxvdENzczogYW55ID0ge307XG4gICAgICBwbG90Q3NzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5mdWxsKSB7XG4gICAgICAgIHBsb3RDc3MuYm90dG9tID0gJzVweCc7XG4gICAgICAgIHBsb3RDc3MubGVmdCA9ICctNXB4JztcbiAgICAgICAgcGxvdENzcy53aWR0aCA9IHdpZHRoIC0gMTAgKyAncHgnO1xuICAgICAgICB2YXIgZHluYW1pY0hlaWdodE1hcmdpbiA9IGhlaWdodCA8PSAxMDAgPyA1IDogTWF0aC5yb3VuZChoZWlnaHQgLyAxMDApICogMTUgKyA1O1xuICAgICAgICBwbG90Q3NzLmhlaWdodCA9IGhlaWdodCAtIGR5bmFtaWNIZWlnaHRNYXJnaW4gKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxvdENzcy5ib3R0b20gPSAnMHB4JztcbiAgICAgICAgcGxvdENzcy5sZWZ0ID0gJy01cHgnO1xuICAgICAgICBwbG90Q3NzLndpZHRoID0gd2lkdGggLSAxMCArICdweCc7XG4gICAgICAgIHBsb3RDc3MuaGVpZ2h0ID0gTWF0aC5mbG9vcihoZWlnaHQgKiAwLjI1KSArICdweCc7XG4gICAgICB9XG5cbiAgICAgIHBsb3RDYW52YXMuY3NzKHBsb3RDc3MpO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgbGVnZW5kOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgIHNlcmllczoge1xuICAgICAgICAgIGxpbmVzOiB7XG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgZmlsbDogMSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogcGFuZWwuc3BhcmtsaW5lLmZpbGxDb2xvcixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB5YXhlczogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICB4YXhpczoge1xuICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgIG1vZGU6ICd0aW1lJyxcbiAgICAgICAgICBtaW46IGN0cmwucmFuZ2UuZnJvbS52YWx1ZU9mKCksXG4gICAgICAgICAgbWF4OiBjdHJsLnJhbmdlLnRvLnZhbHVlT2YoKSxcbiAgICAgICAgfSxcbiAgICAgICAgZ3JpZDogeyBob3ZlcmFibGU6IGZhbHNlLCBzaG93OiBmYWxzZSB9LFxuICAgICAgfTtcblxuICAgICAgZWxlbS5hcHBlbmQocGxvdENhbnZhcyk7XG5cbiAgICAgIHZhciBwbG90U2VyaWVzID0ge1xuICAgICAgICBkYXRhOiBkYXRhLmZsb3RwYWlycyxcbiAgICAgICAgY29sb3I6IHBhbmVsLnNwYXJrbGluZS5saW5lQ29sb3IsXG4gICAgICB9O1xuXG4gICAgICAkLnBsb3QocGxvdENhbnZhcywgW3Bsb3RTZXJpZXNdLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICBpZiAoIWN0cmwuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkYXRhID0gY3RybC5kYXRhO1xuICAgICAgdmFyIGJvZHkgPSBwYW5lbC5nYXVnZS5zaG93ID8gJycgOiBnZXRCaWdWYWx1ZUh0bWwoKTtcbiAgICAgIHZhciBjb2xvciA9ICcnO1xuICAgICAgaWYgKHBhbmVsLmNvbG9yQmFja2dyb3VuZCkge1xuICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgY29sb3IgPSBwYW5lbC52YWx1ZU1hcHBpbmdDb2xvckJhY2tncm91bmQ7IC8vbnVsbCBvciBncmV5IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sb3IgPSBnZXRDb2xvckZvclZhbHVlKHBhbmVsLnRocmVzaG9sZHMsIGRhdGEudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xvcikge1xuICAgICAgICAgICRwYW5lbENvbnRhaW5lci5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgICAgaWYgKHNjb3BlLmZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRwYW5lbENvbnRhaW5lci5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnJyk7XG4gICAgICAgIGVsZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuICAgICAgICBwYW5lbC5jaXJjbGVCYWNrZ3JvdW5kID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IHRvIENpcmNsZVxuICAgICAgaWYgKHBhbmVsLmNpcmNsZUJhY2tncm91bmQpIHtcbiAgICAgICAgbGV0IGNpcmNsZUhlaWdodCA9ICQoJHBhbmVsQ29udGFpbmVyLmhlaWdodCgpKVswXSAtIDI2O1xuICAgICAgICBsZXQgY2lyY2xlV2lkdGggPSAkKCRwYW5lbENvbnRhaW5lci53aWR0aCgpKVswXTtcblxuICAgICAgICAkKCRwYW5lbENvbnRhaW5lcikuYWRkQ2xhc3MoJ2NpcmNsZScpO1xuICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuXG4gICAgICAgIGlmIChjaXJjbGVXaWR0aCA+PSBjaXJjbGVIZWlnaHQpIHtcbiAgICAgICAgICBlbGVtLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IDUwICsgJyUnLFxuICAgICAgICAgICAgJ3dpZHRoJzogY2lyY2xlSGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICAgICdoZWlnaHQnOiBjaXJjbGVIZWlnaHQgKyAncHgnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBjb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uY3NzKHtcbiAgICAgICAgICAgICdib3JkZXItcmFkaXVzJzogNTAgKyAnJScsXG4gICAgICAgICAgICAnd2lkdGgnOiBjaXJjbGVXaWR0aCArICdweCcsXG4gICAgICAgICAgICAnaGVpZ2h0JzogY2lyY2xlV2lkdGggKyAncHgnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBjb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCRwYW5lbENvbnRhaW5lci5yZW1vdmVDbGFzcygnY2lyY2xlJykpO1xuICAgICAgICBlbGVtLmNzcyh7ICdib3JkZXItcmFkaXVzJzogJzAnLCB3aWR0aDogJycsIGhlaWdodDogJycgfSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW0uaHRtbChib2R5KTtcblxuICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5zaG93KSB7XG4gICAgICAgIGFkZFNwYXJrbGluZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFuZWwuZ2F1Z2Uuc2hvdykge1xuICAgICAgICBhZGRHYXVnZSgpO1xuICAgICAgfVxuXG4gICAgICBlbGVtLnRvZ2dsZUNsYXNzKCdwb2ludGVyJywgcGFuZWwubGlua3MubGVuZ3RoID4gMCk7XG5cbiAgICAgIGlmIChwYW5lbC5saW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxpbmtJbmZvID0gbGlua1Nydi5nZXRQYW5lbExpbmtBbmNob3JJbmZvKHBhbmVsLmxpbmtzWzBdLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlua0luZm8gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhvb2t1cERyaWxsZG93bkxpbmtUb29sdGlwKCkge1xuICAgICAgLy8gZHJpbGxkb3duIGxpbmsgdG9vbHRpcFxuXG4gICAgICBpZiAoY3RybC5wYW5lbC5kZXNjcmlwdGlvbikge1xuICAgICAgICB2YXIgZHJpbGxkb3duVG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJ0b29sdGlwXCIgY2xhc3M9XCJcIiBzdHlsZT1cImJhY2tncm91bmQ6d2hpdGU7bWFyZ2luOmF1dG87Y29sb3I6YmxhY2s7d2lkdGg6MjAwcHg7Ym94LXNoYWRvdzogMCAzcHggNnB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcIj48aDYgc3R5bGU9XCJjb2xvcjpibGFjaztcIj4nXG4gICAgICAgICAgKyBjdHJsLnBhbmVsLnRpdGxlICsgJzwvaDY+JyArIGN0cmwucGFuZWwuZGVzY3JpcHRpb24gKyAnPC9kaXY+XCInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkcmlsbGRvd25Ub29sdGlwID0gJCgnPGRpdiBpZD1cInRvb2x0aXBcIiBjbGFzcz1cIlwiIHN0eWxlPVwiYmFja2dyb3VuZDp3aGl0ZTttYXJnaW46YXV0bztjb2xvcjpibGFjazt3aWR0aDoyMDBweDtib3gtc2hhZG93OiAwIDNweCA2cHggcmdiYSgwLCAwLCAwLCAwLjEpO1wiPjxoNiBzdHlsZT1cImNvbG9yOmJsYWNrO1wiPidcbiAgICAgICAgICArIGN0cmwucGFuZWwudGl0bGUgKyAnPC9oNj5ObyBEZXNjcmlwdGlvbjwvZGl2PlwiJyk7XG4gICAgICB9XG5cbiAgICAgIGVsZW0ubW91c2VsZWF2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkcmlsbGRvd25Ub29sdGlwLmRldGFjaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtLmNsaWNrKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgaWYgKCFsaW5rSW5mbykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZ25vcmUgdGl0bGUgY2xpY2tzIGluIHRpdGxlXG4gICAgICAgIGlmICgkKGV2dCkucGFyZW50cygnLnBhbmVsLWhlYWRlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlua0luZm8udGFyZ2V0ID09PSAnX2JsYW5rJykge1xuICAgICAgICAgIHdpbmRvdy5vcGVuKGxpbmtJbmZvLmhyZWYsICdfYmxhbmsnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlua0luZm8uaHJlZi5pbmRleE9mKCdodHRwJykgPT09IDApIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxpbmtJbmZvLmhyZWY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnVybChsaW5rSW5mby5ocmVmKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgZWxlbS5tb3VzZW1vdmUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFjdHJsLnBhbmVsLnRvb2x0aXAuc2hvdykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZHJpbGxkb3duVG9vbHRpcC50ZXh0KGRhdGEudmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICAvL2RyaWxsZG93blRvb2x0aXAudGV4dCgnY2xpY2sgdG8gZ28gdG86ICcgKyBsaW5rSW5mby50aXRsZSk7XG4gICAgICAgIC8vZHJpbGxkb3duVG9vbHRpcC50ZXh0KGN0cmwucGFuZWwuZGVzY3JpcHRpb24pO1xuICAgICAgICBkcmlsbGRvd25Ub29sdGlwLnBsYWNlX3R0KGUucGFnZVgsIGUucGFnZVkgLSA1MCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpO1xuXG4gICAgdGhpcy5ldmVudHMub24oJ3JlbmRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgY3RybC5yZW5kZXJpbmdDb21wbGV0ZWQoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb2xvckZvclZhbHVlKHRocmVzaG9sZHMsIHZhbHVlKSB7XG4gIGxldCBjb2xvciA9ICcnO1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gY29sb3I7XG4gIH1cbiAgZm9yIChsZXQgaSA9IHRocmVzaG9sZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBsZXQgYVRocmVzaG9sZCA9IHRocmVzaG9sZHNbaV07XG4gICAgY29sb3IgPSBhVGhyZXNob2xkLmNvbG9yO1xuICAgIGlmICh2YWx1ZSA+PSBhVGhyZXNob2xkLmRpc3BsYXl2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFUaHJlc2hvbGQuY29sb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IHsgU2luZ2xlU3RhdE1hdGhDdHJsLCBTaW5nbGVTdGF0TWF0aEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH1cbi8vIGV4cG9ydCB7IFNpbmdsZVN0YXRDdHJsLCBTaW5nbGVTdGF0Q3RybCBhcyBQYW5lbEN0cmwsIGdldENvbG9yRm9yVmFsdWUgfTtcbiJdfQ==
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
                    elem = elem.find('.singlestatmath-panel');
                    function getPanelContainer() {
                        return elem.closest('.panel-content');
                    }
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
                                getPanelContainer().css('background-color', color);
                                elem.css('background-color', color);
                            }
                        }
                        else {
                            getPanelContainer().css('background-color', color);
                            elem.css('background-color', '');
                            panel.circleBackground = false;
                        }
                        if (panel.circleBackground) {
                            jquery_1.default(getPanelContainer()).addClass('circle');
                            getPanelContainer().css('background-color', '');
                            elem.css({
                                'border-radius': 50 + '%',
                                'background-color': color
                            });
                        }
                        else {
                            jquery_1.default(getPanelContainer().removeClass('circle'));
                            elem.css({ 'border-radius': '0' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlc3RhdC1tYXRoX2N0cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2luZ2xlc3RhdC1tYXRoX2N0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTB6QkEsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsS0FBSztRQUN6QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDekIsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtnQkFDN0IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ3pCO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQXR6QmdDLHNDQUFnQjtnQkFnRi9DLDRCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFVLE9BQU87b0JBQWpFLFlBQ0Usa0JBQU0sTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQWdCekI7b0JBakJzQyxlQUFTLEdBQVQsU0FBUyxDQUFBO29CQUFVLGFBQU8sR0FBUCxPQUFPLENBQUE7b0JBN0VqRSxjQUFRLEdBQUcsWUFBWSxDQUFDO29CQVF4QixzQkFBZ0IsR0FBVTt3QkFDeEIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVB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aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0ICdqcXVlcnkuZmxvdCc7XG5pbXBvcnQgJy4vbGliL2Zsb3QvanF1ZXJ5LmZsb3QuZ2F1Z2UnO1xuaW1wb3J0ICdqcXVlcnkuZmxvdC50aW1lJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QuY3Jvc3NoYWlyJztcbmltcG9ydCAnLi9jc3MvcGFuZWxfc2luZ2xlc3RhdG1hdGguY3NzISc7XG5pbXBvcnQgbWF0aCBmcm9tICcuL2xpYi9tYXRoanMvbWF0aCdcblxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdhcHAvY29yZS9jb25maWcnO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSAnYXBwL2NvcmUvdGltZV9zZXJpZXMyJztcbmltcG9ydCB7IE1ldHJpY3NQYW5lbEN0cmwsIFBhbmVsQ3RybCB9IGZyb20gJ2FwcC9wbHVnaW5zL3Nkayc7XG4vL2ltcG9ydCB7IHN0cmljdCB9IGZyb20gJ2Fzc2VydCc7XG5cbmNsYXNzIFNpbmdsZVN0YXRNYXRoQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xuICBzdGF0aWMgdGVtcGxhdGVVcmwgPSAncHVibGljL3BsdWdpbnMvYmxhY2ttaXJyb3IxLXNpbmdsZXN0YXQtbWF0aC1wYW5lbC9tb2R1bGUuaHRtbCc7XG5cbiAgZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gIHNlcmllczogYW55W107XG4gIGRhdGE6IGFueTtcbiAgZm9udFNpemVzOiBhbnlbXTtcbiAgdW5pdEZvcm1hdHM6IGFueVtdO1xuICBpbnZhbGlkR2F1Z2VSYW5nZTogYm9vbGVhbjtcbiAgcGFuZWw6IGFueTtcbiAgZXZlbnRzOiBhbnk7XG4gIHZhbHVlTmFtZU9wdGlvbnM6IGFueVtdID0gW1xuICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgIHsgdmFsdWU6ICdtYXgnLCB0ZXh0OiAnTWF4JyB9LFxuICAgIHsgdmFsdWU6ICdhdmcnLCB0ZXh0OiAnQXZlcmFnZScgfSxcbiAgICB7IHZhbHVlOiAnY3VycmVudCcsIHRleHQ6ICdDdXJyZW50JyB9LFxuICAgIHsgdmFsdWU6ICd0b3RhbCcsIHRleHQ6ICdUb3RhbCcgfSxcbiAgICB7IHZhbHVlOiAnbmFtZScsIHRleHQ6ICdOYW1lJyB9LFxuICAgIHsgdmFsdWU6ICdmaXJzdCcsIHRleHQ6ICdGaXJzdCcgfSxcbiAgICB7IHZhbHVlOiAnZGVsdGEnLCB0ZXh0OiAnRGVsdGEnIH0sXG4gICAgeyB2YWx1ZTogJ2RpZmYnLCB0ZXh0OiAnRGlmZmVyZW5jZScgfSxcbiAgICB7IHZhbHVlOiAncmFuZ2UnLCB0ZXh0OiAnUmFuZ2UnIH0sXG4gICAgeyB2YWx1ZTogJ2xhc3RfdGltZScsIHRleHQ6ICdUaW1lIG9mIGxhc3QgcG9pbnQnIH0sXG4gIF07XG4gIHRhYmxlQ29sdW1uT3B0aW9uczogYW55O1xuICB0aHJlc2hvbGRzOiBhbnlbXTtcblxuICAvLyBTZXQgYW5kIHBvcHVsYXRlIGRlZmF1bHRzXG4gIHBhbmVsRGVmYXVsdHMgPSB7XG4gICAgbGlua3M6IFtdLFxuICAgIGRhdGFzb3VyY2U6IG51bGwsXG4gICAgbWF4RGF0YVBvaW50czogMTAwLFxuICAgIGludGVydmFsOiBudWxsLFxuICAgIHRhcmdldHM6IFt7fV0sXG4gICAgY2FjaGVUaW1lb3V0OiBudWxsLFxuICAgIGRlZmF1bHRDb2xvcjogJ3JnYigxMTcsIDExNywgMTE3KScsXG4gICAgdGhyZXNob2xkczogJycsXG4gICAgZm9ybWF0OiAnbm9uZScsXG4gICAgdG9vbHRpcDoge1xuICAgICAgc2hvdzogdHJ1ZVxuICAgIH0sXG4gICAgc29ydE9yZGVyOiAnYXNjJyxcbiAgICBwcmVmaXg6ICcnLFxuICAgIHBvc3RmaXg6ICcnLFxuICAgIG51bGxUZXh0OiBudWxsLFxuICAgIHZhbHVlTWFwczogW3sgdmFsdWU6ICdudWxsJywgb3A6ICc9JywgdGV4dDogJ05vIGRhdGEnIH1dLFxuICAgIG1hcHBpbmdUeXBlczogW3sgbmFtZTogJ3ZhbHVlIHRvIHRleHQnLCB2YWx1ZTogMSB9LCB7IG5hbWU6ICdyYW5nZSB0byB0ZXh0JywgdmFsdWU6IDIgfV0sXG4gICAgcmFuZ2VNYXBzOiBbeyBmcm9tOiAnbnVsbCcsIHRvOiAnbnVsbCcsIHRleHQ6ICdOL0EnIH1dLFxuICAgIG1hcHBpbmdUeXBlOiAxLFxuICAgIG51bGxQb2ludE1vZGU6ICdjb25uZWN0ZWQnLFxuICAgIHZhbHVlTmFtZTogJ2F2ZycsXG4gICAgcHJlZml4Rm9udFNpemU6ICc1MCUnLFxuICAgIHZhbHVlRm9udFNpemU6ICc4MCUnLFxuICAgIHBvc3RmaXhGb250U2l6ZTogJzUwJScsXG4gICAgbWF0aDogJycsXG4gICAgY29sb3JCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICBjaXJjbGVCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICB2YWx1ZU1hcHBpbmdDb2xvckJhY2tncm91bmQ6ICcjNzY3MTcxJyxcbiAgICBjb2xvclZhbHVlOiBmYWxzZSxcbiAgICBzcGFya2xpbmU6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgZnVsbDogZmFsc2UsXG4gICAgICBsaW5lQ29sb3I6ICdyZ2IoMzEsIDEyMCwgMTkzKScsXG4gICAgICBmaWxsQ29sb3I6ICdyZ2JhKDMxLCAxMTgsIDE4OSwgMC4xOCknLFxuICAgIH0sXG4gICAgZ2F1Z2U6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgbWluVmFsdWU6IDAsXG4gICAgICBtYXhWYWx1ZTogMTAwLFxuICAgICAgdGhyZXNob2xkTWFya2VyczogdHJ1ZSxcbiAgICAgIHRocmVzaG9sZExhYmVsczogZmFsc2UsXG4gICAgfSxcbiAgICBzb3J0T3JkZXJPcHRpb25zOiBbXG4gICAgICB7IHZhbHVlOiAnYXNjJywgdGV4dDogJ0FzY2VuZGluZycgfSxcbiAgICAgIHsgdmFsdWU6ICdkZXNjJywgdGV4dDogJ0Rlc2NlbmRpbmcnIH0sXG4gICAgXSxcbiAgICB0YWJsZUNvbHVtbjogJycsXG4gIH07XG5cbiAgLyoqIEBuZ0luamVjdCAqL1xuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgcHJpdmF0ZSAkbG9jYXRpb24sIHByaXZhdGUgbGlua1Nydikge1xuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIHRoaXMucGFuZWxEZWZhdWx0cyk7XG5cbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1yZWNlaXZlZCcsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtZXJyb3InLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLXNuYXBzaG90LWxvYWQnLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdpbml0LWVkaXQtbW9kZScsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZSA9IHRoaXMub25TcGFya2xpbmVGaWxsQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAvL0dyYWIgcHJldmlvdXMgdmVyc2lvbiB0aHJlc2hvbGRzIGFuZCBzdG9yZSBpbnRvIG5ldyBmb3JtYXRcbiAgICB2YXIgdCA9IHRoaXMucGFuZWwudGhyZXNob2xkcztcbiAgICBpZiAodHlwZW9mIHQgPT09ICdzdHJpbmcnIHx8IHQgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMub2xkVGhyZXNoZXNDaGFuZ2UodCk7XG4gICAgfVxuICB9XG5cbiAgb25Jbml0RWRpdE1vZGUoKSB7XG4gICAgdGhpcy5mb250U2l6ZXMgPSBbJzIwJScsICczMCUnLCAnNTAlJywgJzcwJScsICc4MCUnLCAnMTAwJScsICcxMTAlJywgJzEyMCUnLCAnMTUwJScsICcxNzAlJywgJzIwMCUnXTtcbiAgICB0aGlzLmFkZEVkaXRvclRhYignT3B0aW9ucycsICdwdWJsaWMvcGx1Z2lucy9ibGFja21pcnJvcjEtc2luZ2xlc3RhdC1tYXRoLXBhbmVsL2VkaXRvci5odG1sJywgMik7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoJ1ZhbHVlIE1hcHBpbmdzJywgJ3B1YmxpYy9wbHVnaW5zL2JsYWNrbWlycm9yMS1zaW5nbGVzdGF0LW1hdGgtcGFuZWwvbWFwcGluZ3MuaHRtbCcsIDMpO1xuICAgIHRoaXMudW5pdEZvcm1hdHMgPSBrYm4uZ2V0VW5pdEZvcm1hdHMoKTtcbiAgfVxuXG4gIG9sZFRocmVzaGVzQ2hhbmdlKHRocmVzaGVzKSB7XG4gICAgdmFyIGFycmF5ID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgYXJyYXkgPSBKU09OLnBhcnNlKFwiW1wiICsgdGhyZXNoZXMgKyBcIl1cIik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkpTT04gcGFyc2UgZmFpbGVkXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgfVxuICAgIGlmIChhcnJheSA9PT0gbnVsbCkge1xuICAgICAgLy8gdXNlIHNwbGl0IG1ldGhvZCBpbnN0ZWFkXG4gICAgICBhcnJheSA9IHRocmVzaGVzLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gICAgdGhpcy50aHJlc2hvbGRzID0gW107IC8vaW5zdGFudGlhdGUgYSBuZXcgZGVmaW5lZCBkaWN0aW9uYXJ5XG5cbiAgICAvL3B1c2ggb2xkIGl0ZW1zIGludG8gbmV3IGRpY3Rpb25hcnlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdXNlQ29sb3IgPSB0aGlzLnBhbmVsLmRlZmF1bHRDb2xvcjtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5jb2xvcnMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKGkgPCB0aGlzLnBhbmVsLmNvbG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICB1c2VDb2xvciA9IHRoaXMucGFuZWwuY29sb3JzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnRocmVzaG9sZHMucHVzaCh7XG4gICAgICAgIGNvbG9yOiB1c2VDb2xvcixcbiAgICAgICAgdmFsdWU6IE51bWJlcihhcnJheVtpXSksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL092ZXJ3cml0ZSBKU09OXG4gICAgdGhpcy5wYW5lbFtcInRocmVzaG9sZHNcIl0gPSB0aGlzLnRocmVzaG9sZHM7XG4gIH1cblxuICBzb3J0TXlUaHJlc2hlcyhjb250cm9sKSB7XG4gICAgaWYgKHRoaXMucGFuZWwuc29ydE9yZGVyID09PSAnYXNjJykge1xuICAgICAgY29udHJvbC5wYW5lbC50aHJlc2hvbGRzID0gXy5vcmRlckJ5KGNvbnRyb2wucGFuZWwudGhyZXNob2xkcywgW1widmFsdWVcIl0sIFtcImFzY1wiXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnNvcnRPcmRlciA9PT0gJ2Rlc2MnKSB7XG4gICAgICBjb250cm9sLnBhbmVsLnRocmVzaG9sZHMgPSBfLm9yZGVyQnkoY29udHJvbC5wYW5lbC50aHJlc2hvbGRzLCBbXCJ2YWx1ZVwiXSwgW1wiZGVzY1wiXSk7XG4gICAgfVxuICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICB9XG5cbiAgc2V0VW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgdGhpcy5wYW5lbC5mb3JtYXQgPSBzdWJJdGVtLnZhbHVlO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgdGhpcy5vbkRhdGFSZWNlaXZlZChbXSk7XG4gIH1cblxuICBvbkVkaXRvclJlbW92ZVRocmVzaG9sZChpbmRleCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRWRpdG9yQWRkVGhyZXNob2xkKCkge1xuICAgIHRoaXMucGFuZWwudGhyZXNob2xkcy5wdXNoKHsgY29sb3I6IHRoaXMucGFuZWwuZGVmYXVsdENvbG9yIH0pXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0ge307XG4gICAgaWYgKGRhdGFMaXN0Lmxlbmd0aCA+IDAgJiYgZGF0YUxpc3RbMF0udHlwZSA9PT0gJ3RhYmxlJykge1xuICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0YWJsZSc7XG4gICAgICBjb25zdCB0YWJsZURhdGEgPSBkYXRhTGlzdC5tYXAodGhpcy50YWJsZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFRhYmxlVmFsdWVzKHRhYmxlRGF0YSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gICAgICB0aGlzLnNlcmllcyA9IGRhdGFMaXN0Lm1hcCh0aGlzLnNlcmllc0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNldFZhbHVlcyhkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XG4gICAgdmFyIHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXSxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcblxuICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKHRoaXMucGFuZWwubnVsbFBvaW50TW9kZSk7XG4gICAgcmV0dXJuIHNlcmllcztcbiAgfVxuXG4gIHRhYmxlSGFuZGxlcih0YWJsZURhdGEpIHtcbiAgICBjb25zdCBkYXRhcG9pbnRzID0gW107XG4gICAgY29uc3QgY29sdW1uTmFtZXMgPSB7fTtcblxuICAgIHRhYmxlRGF0YS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgIGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XSA9IGNvbHVtbi50ZXh0O1xuICAgIH0pO1xuXG4gICAgdGhpcy50YWJsZUNvbHVtbk9wdGlvbnMgPSBjb2x1bW5OYW1lcztcbiAgICBpZiAoIV8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgWyd0ZXh0JywgdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0pKSB7XG4gICAgICB0aGlzLnNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKTtcbiAgICB9XG5cbiAgICB0YWJsZURhdGEucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICBjb25zdCBkYXRhcG9pbnQgPSB7fTtcblxuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBjb2x1bW5OYW1lc1tjb2x1bW5JbmRleF07XG4gICAgICAgIGRhdGFwb2ludFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgZGF0YXBvaW50cy5wdXNoKGRhdGFwb2ludCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXBvaW50cztcbiAgfVxuXG4gIHNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKSB7XG4gICAgaWYgKHRhYmxlRGF0YS5jb2x1bW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IHRhYmxlRGF0YS5jb2x1bW5zWzBdLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSBfLmZpbmQodGFibGVEYXRhLmNvbHVtbnMsIGNvbCA9PiB7XG4gICAgICAgIHJldHVybiBjb2wudHlwZSAhPT0gJ3RpbWUnO1xuICAgICAgfSkudGV4dDtcbiAgICB9XG4gIH1cblxuICBzZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpIHtcbiAgICBpZiAoIXRhYmxlRGF0YSB8fCB0YWJsZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlRGF0YVswXS5sZW5ndGggPT09IDAgfHwgdGFibGVEYXRhWzBdWzBdW3RoaXMucGFuZWwudGFibGVDb2x1bW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcG9pbnQgPSB0YWJsZURhdGFbMF1bMF07XG4gICAgZGF0YS52YWx1ZSA9IGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXTtcblxuICAgIGlmIChfLmlzU3RyaW5nKGRhdGEudmFsdWUpKSB7XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUoZGF0YS52YWx1ZSk7XG4gICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhcbiAgICAgICAgZGF0YXBvaW50W3RoaXMucGFuZWwudGFibGVDb2x1bW5dLFxuICAgICAgICBkZWNpbWFsSW5mby5kZWNpbWFscyxcbiAgICAgICAgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHNcbiAgICAgICk7XG4gICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIHRoaXMucGFuZWwuZGVjaW1hbHMgfHwgMCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBjYW5DaGFuZ2VGb250U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5nYXVnZS5zaG93O1xuICB9XG5cbiAgb25TcGFya2xpbmVDb2xvckNoYW5nZShuZXdDb2xvcikge1xuICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvciA9IG5ld0NvbG9yO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvblNwYXJrbGluZUZpbGxDaGFuZ2UobmV3Q29sb3IpIHtcbiAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IgPSBuZXdDb2xvcjtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVjaW1hbHNGb3JWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChfLmlzTnVtYmVyKHRoaXMucGFuZWwuZGVjaW1hbHMpKSB7XG4gICAgICByZXR1cm4geyBkZWNpbWFsczogdGhpcy5wYW5lbC5kZWNpbWFscywgc2NhbGVkRGVjaW1hbHM6IG51bGwgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB2YWx1ZSAvIDI7XG4gICAgdmFyIGRlYyA9IC1NYXRoLmZsb29yKE1hdGgubG9nKGRlbHRhKSAvIE1hdGguTE4xMCk7XG5cbiAgICB2YXIgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcbiAgICAgIG5vcm0gPSBkZWx0YSAvIG1hZ24sIC8vIG5vcm0gaXMgYmV0d2VlbiAxLjAgYW5kIDEwLjBcbiAgICAgIHNpemU7XG5cbiAgICBpZiAobm9ybSA8IDEuNSkge1xuICAgICAgc2l6ZSA9IDE7XG4gICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xuICAgICAgc2l6ZSA9IDI7XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDIuNSwgcmVxdWlyZXMgYW4gZXh0cmEgZGVjaW1hbFxuICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XG4gICAgICAgIHNpemUgPSAyLjU7XG4gICAgICAgICsrZGVjO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xuICAgICAgc2l6ZSA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSAxMDtcbiAgICB9XG5cbiAgICBzaXplICo9IG1hZ247XG5cbiAgICAvLyByZWR1Y2Ugc3RhcnRpbmcgZGVjaW1hbHMgaWYgbm90IG5lZWRlZFxuICAgIGlmIChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUpIHtcbiAgICAgIGRlYyA9IDA7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdDogYW55ID0ge307XG4gICAgcmVzdWx0LmRlY2ltYWxzID0gTWF0aC5tYXgoMCwgZGVjKTtcbiAgICByZXN1bHQuc2NhbGVkRGVjaW1hbHMgPSByZXN1bHQuZGVjaW1hbHMgLSBNYXRoLmZsb29yKE1hdGgubG9nKHNpemUpIC8gTWF0aC5MTjEwKSArIDI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGEpIHtcbiAgICBkYXRhLmZsb3RwYWlycyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuc2VyaWVzLmxlbmd0aCA+IDEgfHwgdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IFtdO1xuICAgICAgbGV0IGxhc3RWYWx1ZSA9IFtdO1xuICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGFzdFBvaW50W2luZGV4XSA9IF8ubGFzdChlbGVtZW50LmRhdGFwb2ludHMpO1xuICAgICAgICBsYXN0VmFsdWVbaW5kZXhdID0gXy5pc0FycmF5KGxhc3RQb2ludFtpbmRleF0pID8gbGFzdFBvaW50W2luZGV4XVswXSA6IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbmFtZScpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMuc2VyaWVzWzBdLmFsaWFzO1xuXG4gICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGFzdFZhbHVlWzBdKSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGxhc3RWYWx1ZVswXSk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICdsYXN0X3RpbWUnKSB7XG4gICAgICAgIGxldCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWUgPSBsYXN0UG9pbnRbMF1bMV07XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgMCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBtYXRoRnVuY3Rpb24gPSB0aGlzLnBhbmVsLm1hdGg7XG4gICAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIG1hdGhGdW5jdGlvbiA9IG1hdGhGdW5jdGlvbi5yZXBsYWNlKG5ldyBSZWdFeHAoZWxlbWVudC5hbGlhcywgJ2dpJyksIFN0cmluZyhlbGVtZW50LnN0YXRzW3RoaXMucGFuZWwudmFsdWVOYW1lXSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtYXRoRnVuY3Rpb24gPSBtYXRoRnVuY3Rpb24ucmVwbGFjZShuZXcgUmVnRXhwKCdbQS16YS16XSsnLCAnZ2knKSwgU3RyaW5nKDApKTtcbiAgICAgICAgICAgIGRhdGEudmFsdWUgPSBtYXRoLmV2YWwobWF0aEZ1bmN0aW9uKTtcbiAgICAgICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vRXJyb3IgZXZhbHVhdGluZyBmdW5jdGlvbi4gRGVmYXVsdGluZyB0byB6ZXJvLlxuICAgICAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgICAgICBkYXRhLmZsb3RwYWlycyA9IFswLCAwXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGF0YS52YWx1ZSA9IHRoaXMuc2VyaWVzWzBdLnN0YXRzW3RoaXMucGFuZWwudmFsdWVOYW1lXTtcbiAgICAgICAgICBkYXRhLmZsb3RwYWlycyA9IHRoaXMuc2VyaWVzWzBdLmZsb3RwYWlycztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICAgIGRhdGEuc2NvcGVkVmFyc1snX19uYW1lJ10gPSB7IHZhbHVlOiB0aGlzLnNlcmllc1swXS5sYWJlbCB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXJpZXMubGVuZ3RoIDwgMiAmJiAhdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgIGxldCBsYXN0VmFsdWUgPSBfLmlzQXJyYXkobGFzdFBvaW50KSA/IGxhc3RQb2ludFswXSA6IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnNlcmllc1swXS5hbGlhcztcbiAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ2xhc3RfdGltZScpIHtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGxhc3RQb2ludFsxXTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBkYXRhLnZhbHVlO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICBkYXRhLnNjb3BlZFZhcnNbJ19fbmFtZSddID0geyB2YWx1ZTogdGhpcy5zZXJpZXNbMF0ubGFiZWwgfTtcbiAgICB9XG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBzZXRWYWx1ZU1hcHBpbmcoZGF0YSkge1xuICAgIC8vIGNoZWNrIHZhbHVlIHRvIHRleHQgbWFwcGluZ3MgaWYgaXRzIGVuYWJsZWRcbiAgICBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnZhbHVlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC52YWx1ZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAudmFsdWUgPT09ICdudWxsJykge1xuICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlL251bWJlciB0byB0ZXh0IG1hcHBpbmdcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChtYXAudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnJhbmdlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC5yYW5nZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAuZnJvbSA9PT0gJ251bGwnICYmIG1hcC50byA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IG51bGwgfHwgZGF0YS52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsdWUvbnVtYmVyIHRvIHJhbmdlIG1hcHBpbmdcbiAgICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG1hcC5mcm9tKTtcbiAgICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChtYXAudG8pO1xuICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHsgdmFsdWU6ICcnLCBvcDogJz0nLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7IGZyb206ICcnLCB0bzogJycsIHRleHQ6ICcnIH0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICB2YXIgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgdmFyIGxpbmtTcnYgPSB0aGlzLmxpbmtTcnY7XG4gICAgdmFyICR0aW1lb3V0ID0gdGhpcy4kdGltZW91dDtcbiAgICB2YXIgcGFuZWwgPSBjdHJsLnBhbmVsO1xuICAgIHZhciB0ZW1wbGF0ZVNydiA9IHRoaXMudGVtcGxhdGVTcnY7XG4gICAgdmFyIGRhdGEsIGxpbmtJbmZvO1xuICAgIGVsZW0gPSBlbGVtLmZpbmQoJy5zaW5nbGVzdGF0bWF0aC1wYW5lbCcpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UGFuZWxDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gZWxlbS5jbG9zZXN0KCcucGFuZWwtY29udGVudCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlLCB2YWx1ZVN0cmluZykge1xuICAgICAgaWYgKCFwYW5lbC5jb2xvclZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVN0cmluZztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcblxuICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBjb2xvciA9IHBhbmVsLnZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiAnPHNwYW4gc3R5bGU9XCJjb2xvcjonICsgY29sb3IgKyAnXCI+JyArIHZhbHVlU3RyaW5nICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3BhbihjbGFzc05hbWUsIGZvbnRTaXplLCB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHZhbHVlLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCIgc3R5bGU9XCJmb250LXNpemU6JyArIGZvbnRTaXplICsgJ1wiPicgKyB2YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICB2YXIgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdG1hdGgtcGFuZWwtdmFsdWUtY29udGFpbmVyXCI+JztcblxuICAgICAgaWYgKHBhbmVsLnByZWZpeCkge1xuICAgICAgICB2YXIgcHJlZml4ID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgcGFuZWwucHJlZml4KTtcbiAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC1wcmVmaXgnLCBwYW5lbC5wcmVmaXhGb250U2l6ZSwgcHJlZml4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXZhbHVlJywgcGFuZWwudmFsdWVGb250U2l6ZSwgdmFsdWUpO1xuXG4gICAgICBpZiAocGFuZWwucG9zdGZpeCkge1xuICAgICAgICB2YXIgcG9zdGZpeCA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIHBhbmVsLnBvc3RmaXgpO1xuICAgICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXBvc3RmaXgnLCBwYW5lbC5wb3N0Zml4Rm9udFNpemUsIHBvc3RmaXgpO1xuICAgICAgfVxuXG4gICAgICBib2R5ICs9ICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZVRleHQoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFuZWwucHJlZml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wcmVmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcbiAgICAgIHJlc3VsdCArPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgcmVzdWx0ICs9IHBhbmVsLnBvc3RmaXggPyB0ZW1wbGF0ZVNydi5yZXBsYWNlKHBhbmVsLnBvc3RmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRHYXVnZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgIHZhciBoZWlnaHQgPSBlbGVtLmhlaWdodCgpO1xuICAgICAgLy8gQWxsb3cgdG8gdXNlIGEgYml0IG1vcmUgc3BhY2UgZm9yIHdpZGUgZ2F1Z2VzXG4gICAgICB2YXIgZGltZW5zaW9uID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCAqIDEuMyk7XG5cbiAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSBmYWxzZTtcbiAgICAgIGlmIChwYW5lbC5nYXVnZS5taW5WYWx1ZSA+IHBhbmVsLmdhdWdlLm1heFZhbHVlKSB7XG4gICAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIHZhciBwbG90Q3NzID0ge1xuICAgICAgICB0b3A6ICcxMHB4JyxcbiAgICAgICAgbWFyZ2luOiAnYXV0bycsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCAqIDAuOSArICdweCcsXG4gICAgICAgIHdpZHRoOiBkaW1lbnNpb24gKyAncHgnLFxuICAgICAgfTtcblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIHZhciB0aHJlc2hvbGRzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhbmVsLnRocmVzaG9sZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogcGFuZWwudGhyZXNob2xkc1tpXS52YWx1ZSxcbiAgICAgICAgICBjb2xvcjogcGFuZWwudGhyZXNob2xkc1tpXS5jb2xvcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICB2YWx1ZTogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgIGNvbG9yOiBwYW5lbC50aHJlc2hvbGRzW3BhbmVsLnRocmVzaG9sZHMubGVuZ3RoIC0gMV0sXG4gICAgICB9KTtcblxuICAgICAgdmFyIGJnQ29sb3IgPSBjb25maWcuYm9vdERhdGEudXNlci5saWdodFRoZW1lID8gJ3JnYigyMzAsMjMwLDIzMCknIDogJ3JnYigzOCwzOCwzOCknO1xuXG4gICAgICB2YXIgZm9udFNjYWxlID0gcGFyc2VJbnQocGFuZWwudmFsdWVGb250U2l6ZSkgLyAxMDA7XG4gICAgICB2YXIgZm9udFNpemUgPSBNYXRoLm1pbihkaW1lbnNpb24gLyA1LCAxMDApICogZm9udFNjYWxlO1xuICAgICAgLy8gUmVkdWNlIGdhdWdlIHdpZHRoIGlmIHRocmVzaG9sZCBsYWJlbHMgZW5hYmxlZFxuICAgICAgdmFyIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbyA9IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyA/IDEuNSA6IDE7XG4gICAgICB2YXIgZ2F1Z2VXaWR0aCA9IE1hdGgubWluKGRpbWVuc2lvbiAvIDYsIDYwKSAvIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbztcbiAgICAgIHZhciB0aHJlc2hvbGRNYXJrZXJzV2lkdGggPSBnYXVnZVdpZHRoIC8gNTtcbiAgICAgIHZhciB0aHJlc2hvbGRMYWJlbEZvbnRTaXplID0gZm9udFNpemUgLyAyLjU7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBnYXVnZXM6IHtcbiAgICAgICAgICAgIGdhdWdlOiB7XG4gICAgICAgICAgICAgIG1pbjogcGFuZWwuZ2F1Z2UubWluVmFsdWUsXG4gICAgICAgICAgICAgIG1heDogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHsgY29sb3I6IGJnQ29sb3IgfSxcbiAgICAgICAgICAgICAgYm9yZGVyOiB7IGNvbG9yOiBudWxsIH0sXG4gICAgICAgICAgICAgIHNoYWRvdzogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgICB3aWR0aDogZ2F1Z2VXaWR0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmcmFtZTogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgbGFiZWw6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxheW91dDogeyBtYXJnaW46IDAsIHRocmVzaG9sZFdpZHRoOiAwIH0sXG4gICAgICAgICAgICBjZWxsOiB7IGJvcmRlcjogeyB3aWR0aDogMCB9IH0sXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IHtcbiAgICAgICAgICAgICAgdmFsdWVzOiB0aHJlc2hvbGRzLFxuICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHRocmVzaG9sZE1hcmtlcnNXaWR0aCArIDEsXG4gICAgICAgICAgICAgICAgZm9udDogeyBzaXplOiB0aHJlc2hvbGRMYWJlbEZvbnRTaXplIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZE1hcmtlcnMsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHBhbmVsLmNvbG9yVmFsdWUgPyBnZXRDb2xvckZvclZhbHVlKHBhbmVsLnRocmVzaG9sZHMsIGRhdGEudmFsdWVSb3VuZGVkKSA6IG51bGwsXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZVRleHQoKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZm9udDoge1xuICAgICAgICAgICAgICAgIHNpemU6IGZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZhbWlseTogJ1wiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgZWxlbS5hcHBlbmQocGxvdENhbnZhcyk7XG5cbiAgICAgIHZhciBwbG90U2VyaWVzID0ge1xuICAgICAgICBkYXRhOiBbWzAsIGRhdGEudmFsdWVSb3VuZGVkXV0sXG4gICAgICB9O1xuXG4gICAgICAkLnBsb3QocGxvdENhbnZhcywgW3Bsb3RTZXJpZXNdLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTcGFya2xpbmUoKSB7XG4gICAgICB2YXIgd2lkdGggPSBlbGVtLndpZHRoKCkgKyAyMDtcbiAgICAgIGlmICh3aWR0aCA8IDMwKSB7XG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIG5vdCBnb3R0ZW4gaXQncyB3aWR0aCB5ZXRcbiAgICAgICAgLy8gZGVsYXkgc3BhcmtsaW5lIHJlbmRlclxuICAgICAgICBzZXRUaW1lb3V0KGFkZFNwYXJrbGluZSwgMzApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBoZWlnaHQgPSBjdHJsLmhlaWdodDtcbiAgICAgIHZhciBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIHZhciBwbG90Q3NzOiBhbnkgPSB7fTtcbiAgICAgIHBsb3RDc3MucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gICAgICBpZiAocGFuZWwuc3BhcmtsaW5lLmZ1bGwpIHtcbiAgICAgICAgcGxvdENzcy5ib3R0b20gPSAnNXB4JztcbiAgICAgICAgcGxvdENzcy5sZWZ0ID0gJy01cHgnO1xuICAgICAgICBwbG90Q3NzLndpZHRoID0gd2lkdGggLSAxMCArICdweCc7XG4gICAgICAgIHZhciBkeW5hbWljSGVpZ2h0TWFyZ2luID0gaGVpZ2h0IDw9IDEwMCA/IDUgOiBNYXRoLnJvdW5kKGhlaWdodCAvIDEwMCkgKiAxNSArIDU7XG4gICAgICAgIHBsb3RDc3MuaGVpZ2h0ID0gaGVpZ2h0IC0gZHluYW1pY0hlaWdodE1hcmdpbiArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICcwcHgnO1xuICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgIHBsb3RDc3Mud2lkdGggPSB3aWR0aCAtIDEwICsgJ3B4JztcbiAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAqIDAuMjUpICsgJ3B4JztcbiAgICAgIH1cblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBsZWdlbmQ6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgbGluZXM6IHtcbiAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICBmaWxsOiAxLFxuICAgICAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICAgICAgZmlsbENvbG9yOiBwYW5lbC5zcGFya2xpbmUuZmlsbENvbG9yLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHlheGVzOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgIHhheGlzOiB7XG4gICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgbW9kZTogJ3RpbWUnLFxuICAgICAgICAgIG1pbjogY3RybC5yYW5nZS5mcm9tLnZhbHVlT2YoKSxcbiAgICAgICAgICBtYXg6IGN0cmwucmFuZ2UudG8udmFsdWVPZigpLFxuICAgICAgICB9LFxuICAgICAgICBncmlkOiB7IGhvdmVyYWJsZTogZmFsc2UsIHNob3c6IGZhbHNlIH0sXG4gICAgICB9O1xuXG4gICAgICBlbGVtLmFwcGVuZChwbG90Q2FudmFzKTtcblxuICAgICAgdmFyIHBsb3RTZXJpZXMgPSB7XG4gICAgICAgIGRhdGE6IGRhdGEuZmxvdHBhaXJzLFxuICAgICAgICBjb2xvcjogcGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvcixcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIGlmICghY3RybC5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRhdGEgPSBjdHJsLmRhdGE7XG4gICAgICB2YXIgYm9keSA9IHBhbmVsLmdhdWdlLnNob3cgPyAnJyA6IGdldEJpZ1ZhbHVlSHRtbCgpO1xuICAgICAgdmFyIGNvbG9yID0gJyc7XG4gICAgICBpZiAocGFuZWwuY29sb3JCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGlmIChkYXRhLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICBjb2xvciA9IHBhbmVsLnZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDsgLy9udWxsIG9yIGdyZXkgdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2xvciA9IGdldENvbG9yRm9yVmFsdWUocGFuZWwudGhyZXNob2xkcywgZGF0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgZ2V0UGFuZWxDb250YWluZXIoKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldFBhbmVsQ29udGFpbmVyKCkuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgcGFuZWwuY2lyY2xlQmFja2dyb3VuZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCB0byBDaXJjbGVcbiAgICAgIGlmIChwYW5lbC5jaXJjbGVCYWNrZ3JvdW5kKSB7XG4gICAgICAgICQoZ2V0UGFuZWxDb250YWluZXIoKSkuYWRkQ2xhc3MoJ2NpcmNsZScpO1xuICAgICAgICBnZXRQYW5lbENvbnRhaW5lcigpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgZWxlbS5jc3Moe1xuICAgICAgICAgICdib3JkZXItcmFkaXVzJzogNTAgKyAnJScsXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBjb2xvclxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZ2V0UGFuZWxDb250YWluZXIoKS5yZW1vdmVDbGFzcygnY2lyY2xlJykpO1xuICAgICAgICBlbGVtLmNzcyh7ICdib3JkZXItcmFkaXVzJzogJzAnIH0pO1xuICAgICAgfVxuXG4gICAgICBlbGVtLmh0bWwoYm9keSk7XG5cbiAgICAgIGlmIChwYW5lbC5zcGFya2xpbmUuc2hvdykge1xuICAgICAgICBhZGRTcGFya2xpbmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmVsLmdhdWdlLnNob3cpIHtcbiAgICAgICAgYWRkR2F1Z2UoKTtcbiAgICAgIH1cblxuICAgICAgZWxlbS50b2dnbGVDbGFzcygncG9pbnRlcicsIHBhbmVsLmxpbmtzLmxlbmd0aCA+IDApO1xuXG4gICAgICBpZiAocGFuZWwubGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5rSW5mbyA9IGxpbmtTcnYuZ2V0UGFuZWxMaW5rQW5jaG9ySW5mbyhwYW5lbC5saW5rc1swXSwgZGF0YS5zY29wZWRWYXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmtJbmZvID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpIHtcbiAgICAgIC8vIGRyaWxsZG93biBsaW5rIHRvb2x0aXBcblxuICAgICAgaWYgKGN0cmwucGFuZWwuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdmFyIGRyaWxsZG93blRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwidG9vbHRpcFwiIGNsYXNzPVwiXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOndoaXRlO21hcmdpbjphdXRvO2NvbG9yOmJsYWNrO3dpZHRoOjIwMHB4O2JveC1zaGFkb3c6IDAgM3B4IDZweCByZ2JhKDAsIDAsIDAsIDAuMSk7XCI+PGg2IHN0eWxlPVwiY29sb3I6YmxhY2s7XCI+J1xuICAgICAgICAgICsgY3RybC5wYW5lbC50aXRsZSArICc8L2g2PicgKyBjdHJsLnBhbmVsLmRlc2NyaXB0aW9uICsgJzwvZGl2PlwiJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZHJpbGxkb3duVG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJ0b29sdGlwXCIgY2xhc3M9XCJcIiBzdHlsZT1cImJhY2tncm91bmQ6d2hpdGU7bWFyZ2luOmF1dG87Y29sb3I6YmxhY2s7d2lkdGg6MjAwcHg7Ym94LXNoYWRvdzogMCAzcHggNnB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcIj48aDYgc3R5bGU9XCJjb2xvcjpibGFjaztcIj4nXG4gICAgICAgICAgKyBjdHJsLnBhbmVsLnRpdGxlICsgJzwvaDY+Tm8gRGVzY3JpcHRpb248L2Rpdj5cIicpO1xuICAgICAgfVxuXG4gICAgICBlbGVtLm1vdXNlbGVhdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZHJpbGxkb3duVG9vbHRpcC5kZXRhY2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZWxlbS5jbGljayhmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGlmICghbGlua0luZm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWdub3JlIHRpdGxlIGNsaWNrcyBpbiB0aXRsZVxuICAgICAgICBpZiAoJChldnQpLnBhcmVudHMoJy5wYW5lbC1oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLnRhcmdldCA9PT0gJ19ibGFuaycpIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihsaW5rSW5mby5ocmVmLCAnX2JsYW5rJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLmhyZWYuaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rSW5mby5ocmVmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi51cmwobGlua0luZm8uaHJlZik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmlsbGRvd25Ub29sdGlwLmRldGFjaCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGVsZW0ubW91c2Vtb3ZlKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghY3RybC5wYW5lbC50b29sdGlwLnNob3cpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL2RyaWxsZG93blRvb2x0aXAudGV4dChkYXRhLnZhbHVlRm9ybWF0dGVkKTtcbiAgICAgICAgLy9kcmlsbGRvd25Ub29sdGlwLnRleHQoJ2NsaWNrIHRvIGdvIHRvOiAnICsgbGlua0luZm8udGl0bGUpO1xuICAgICAgICAvL2RyaWxsZG93blRvb2x0aXAudGV4dChjdHJsLnBhbmVsLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgZHJpbGxkb3duVG9vbHRpcC5wbGFjZV90dChlLnBhZ2VYLCBlLnBhZ2VZIC0gNTApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaG9va3VwRHJpbGxkb3duTGlua1Rvb2x0aXAoKTtcblxuICAgIHRoaXMuZXZlbnRzLm9uKCdyZW5kZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JGb3JWYWx1ZSh0aHJlc2hvbGRzLCB2YWx1ZSkge1xuICBsZXQgY29sb3IgPSAnJztcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG4gIGZvciAobGV0IGkgPSB0aHJlc2hvbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGV0IGFUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW2ldO1xuICAgIGNvbG9yID0gYVRocmVzaG9sZC5jb2xvcjtcbiAgICBpZiAodmFsdWUgPj0gYVRocmVzaG9sZC52YWx1ZSkge1xuICAgICAgcmV0dXJuIGFUaHJlc2hvbGQuY29sb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IHsgU2luZ2xlU3RhdE1hdGhDdHJsLCBTaW5nbGVTdGF0TWF0aEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH1cbi8vIGV4cG9ydCB7IFNpbmdsZVN0YXRDdHJsLCBTaW5nbGVTdGF0Q3RybCBhcyBQYW5lbEN0cmwsIGdldENvbG9yRm9yVmFsdWUgfTtcbiJdfQ==
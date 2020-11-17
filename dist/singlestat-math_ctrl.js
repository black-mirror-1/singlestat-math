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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlc3RhdC1tYXRoX2N0cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2luZ2xlc3RhdC1tYXRoX2N0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwMEJBLFNBQVMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLEtBQUs7UUFDekMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzdCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQzthQUN6QjtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkF0MEJnQyxzQ0FBZ0I7Z0JBZ0YvQyw0QkFBWSxNQUFNLEVBQUUsU0FBUyxFQUFVLFNBQVMsRUFBVSxPQUFPO29CQUFqRSxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FnQnpCO29CQWpCc0MsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkFBVSxhQUFPLEdBQVAsT0FBTyxDQUFBO29CQTdFakUsY0FBUSxHQUFHLFlBQVksQ0FBQztvQkFReEIsc0JBQWdCLEdBQVU7d0JBQ3hCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO3dCQUM3QixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFF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QkFDNUIsQ0FBQyxDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFTLENBQUM7NEJBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0NBQzVCLE9BQU87NkJBQ1I7NEJBS0QsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDbkQsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFFRCwwQkFBMEIsRUFBRSxDQUFDO29CQUU3QixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7d0JBQ3ZCLE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUM1QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQXJ6Qk0sOEJBQVcsR0FBRywrREFBK0QsQ0FBQztnQkFzekJ2Rix5QkFBQzthQUFBLEFBdnpCRCxDQUFpQyxzQkFBZ0I7OztRQTAwQmpELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCAnanF1ZXJ5LmZsb3QnO1xuaW1wb3J0ICcuL2xpYi9mbG90L2pxdWVyeS5mbG90LmdhdWdlJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QudGltZSc7XG5pbXBvcnQgJ2pxdWVyeS5mbG90LmNyb3NzaGFpcic7XG5pbXBvcnQgJy4vY3NzL3BhbmVsX3NpbmdsZXN0YXRtYXRoLmNzcyEnO1xuaW1wb3J0IG1hdGggZnJvbSAnLi9saWIvbWF0aGpzL21hdGgnXG5cbmltcG9ydCBrYm4gZnJvbSAnYXBwL2NvcmUvdXRpbHMva2JuJztcbmltcG9ydCBjb25maWcgZnJvbSAnYXBwL2NvcmUvY29uZmlnJztcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gJ2FwcC9jb3JlL3RpbWVfc2VyaWVzMic7XG5pbXBvcnQgeyBNZXRyaWNzUGFuZWxDdHJsLCBQYW5lbEN0cmwgfSBmcm9tICdhcHAvcGx1Z2lucy9zZGsnO1xuLy9pbXBvcnQgeyBzdHJpY3QgfSBmcm9tICdhc3NlcnQnO1xuXG5jbGFzcyBTaW5nbGVTdGF0TWF0aEN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gJ3B1YmxpYy9wbHVnaW5zL2JsYWNrbWlycm9yMS1zaW5nbGVzdGF0LW1hdGgtcGFuZWwvbW9kdWxlLmh0bWwnO1xuXG4gIGRhdGFUeXBlID0gJ3RpbWVzZXJpZXMnO1xuICBzZXJpZXM6IGFueVtdO1xuICBkYXRhOiBhbnk7XG4gIGZvbnRTaXplczogYW55W107XG4gIHVuaXRGb3JtYXRzOiBhbnlbXTtcbiAgaW52YWxpZEdhdWdlUmFuZ2U6IGJvb2xlYW47XG4gIHBhbmVsOiBhbnk7XG4gIGV2ZW50czogYW55O1xuICB2YWx1ZU5hbWVPcHRpb25zOiBhbnlbXSA9IFtcbiAgICB7IHZhbHVlOiAnbWluJywgdGV4dDogJ01pbicgfSxcbiAgICB7IHZhbHVlOiAnbWF4JywgdGV4dDogJ01heCcgfSxcbiAgICB7IHZhbHVlOiAnYXZnJywgdGV4dDogJ0F2ZXJhZ2UnIH0sXG4gICAgeyB2YWx1ZTogJ2N1cnJlbnQnLCB0ZXh0OiAnQ3VycmVudCcgfSxcbiAgICB7IHZhbHVlOiAndG90YWwnLCB0ZXh0OiAnVG90YWwnIH0sXG4gICAgeyB2YWx1ZTogJ25hbWUnLCB0ZXh0OiAnTmFtZScgfSxcbiAgICB7IHZhbHVlOiAnZmlyc3QnLCB0ZXh0OiAnRmlyc3QnIH0sXG4gICAgeyB2YWx1ZTogJ2RlbHRhJywgdGV4dDogJ0RlbHRhJyB9LFxuICAgIHsgdmFsdWU6ICdkaWZmJywgdGV4dDogJ0RpZmZlcmVuY2UnIH0sXG4gICAgeyB2YWx1ZTogJ3JhbmdlJywgdGV4dDogJ1JhbmdlJyB9LFxuICAgIHsgdmFsdWU6ICdsYXN0X3RpbWUnLCB0ZXh0OiAnVGltZSBvZiBsYXN0IHBvaW50JyB9LFxuICBdO1xuICB0YWJsZUNvbHVtbk9wdGlvbnM6IGFueTtcbiAgdGhyZXNob2xkczogYW55W107XG5cbiAgLy8gU2V0IGFuZCBwb3B1bGF0ZSBkZWZhdWx0c1xuICBwYW5lbERlZmF1bHRzID0ge1xuICAgIGxpbmtzOiBbXSxcbiAgICBkYXRhc291cmNlOiBudWxsLFxuICAgIG1heERhdGFQb2ludHM6IDEwMCxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICB0YXJnZXRzOiBbe31dLFxuICAgIGNhY2hlVGltZW91dDogbnVsbCxcbiAgICBkZWZhdWx0Q29sb3I6ICdyZ2IoMTE3LCAxMTcsIDExNyknLFxuICAgIHRocmVzaG9sZHM6ICcnLFxuICAgIGZvcm1hdDogJ25vbmUnLFxuICAgIHRvb2x0aXA6IHtcbiAgICAgIHNob3c6IHRydWVcbiAgICB9LFxuICAgIHNvcnRPcmRlcjogJ2FzYycsXG4gICAgcHJlZml4OiAnJyxcbiAgICBwb3N0Zml4OiAnJyxcbiAgICBudWxsVGV4dDogbnVsbCxcbiAgICB2YWx1ZU1hcHM6IFt7IHZhbHVlOiAnbnVsbCcsIG9wOiAnPScsIHRleHQ6ICdObyBkYXRhJyB9XSxcbiAgICBtYXBwaW5nVHlwZXM6IFt7IG5hbWU6ICd2YWx1ZSB0byB0ZXh0JywgdmFsdWU6IDEgfSwgeyBuYW1lOiAncmFuZ2UgdG8gdGV4dCcsIHZhbHVlOiAyIH1dLFxuICAgIHJhbmdlTWFwczogW3sgZnJvbTogJ251bGwnLCB0bzogJ251bGwnLCB0ZXh0OiAnTi9BJyB9XSxcbiAgICBtYXBwaW5nVHlwZTogMSxcbiAgICBudWxsUG9pbnRNb2RlOiAnY29ubmVjdGVkJyxcbiAgICB2YWx1ZU5hbWU6ICdhdmcnLFxuICAgIHByZWZpeEZvbnRTaXplOiAnNTAlJyxcbiAgICB2YWx1ZUZvbnRTaXplOiAnODAlJyxcbiAgICBwb3N0Zml4Rm9udFNpemU6ICc1MCUnLFxuICAgIG1hdGg6ICcnLFxuICAgIGNvbG9yQmFja2dyb3VuZDogZmFsc2UsXG4gICAgY2lyY2xlQmFja2dyb3VuZDogZmFsc2UsXG4gICAgdmFsdWVNYXBwaW5nQ29sb3JCYWNrZ3JvdW5kOiAnIzc2NzE3MScsXG4gICAgY29sb3JWYWx1ZTogZmFsc2UsXG4gICAgc3BhcmtsaW5lOiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGZ1bGw6IGZhbHNlLFxuICAgICAgbGluZUNvbG9yOiAncmdiKDMxLCAxMjAsIDE5MyknLFxuICAgICAgZmlsbENvbG9yOiAncmdiYSgzMSwgMTE4LCAxODksIDAuMTgpJyxcbiAgICB9LFxuICAgIGdhdWdlOiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIG1pblZhbHVlOiAwLFxuICAgICAgbWF4VmFsdWU6IDEwMCxcbiAgICAgIHRocmVzaG9sZE1hcmtlcnM6IHRydWUsXG4gICAgICB0aHJlc2hvbGRMYWJlbHM6IGZhbHNlLFxuICAgIH0sXG4gICAgc29ydE9yZGVyT3B0aW9uczogW1xuICAgICAgeyB2YWx1ZTogJ2FzYycsIHRleHQ6ICdBc2NlbmRpbmcnfSxcbiAgICAgIHsgdmFsdWU6ICdkZXNjJywgdGV4dDogJ0Rlc2NlbmRpbmcnfSxcbiAgICBdLFxuICAgIHRhYmxlQ29sdW1uOiAnJyxcbiAgfTtcblxuICAvKiogQG5nSW5qZWN0ICovXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCBwcml2YXRlICRsb2NhdGlvbiwgcHJpdmF0ZSBsaW5rU3J2KSB7XG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xuICAgIF8uZGVmYXVsdHModGhpcy5wYW5lbCwgdGhpcy5wYW5lbERlZmF1bHRzKTtcblxuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLXJlY2VpdmVkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1lcnJvcicsIHRoaXMub25EYXRhRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtc25hcHNob3QtbG9hZCcsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oJ2luaXQtZWRpdC1tb2RlJywgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMub25TcGFya2xpbmVDb2xvckNoYW5nZSA9IHRoaXMub25TcGFya2xpbmVDb2xvckNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25TcGFya2xpbmVGaWxsQ2hhbmdlID0gdGhpcy5vblNwYXJrbGluZUZpbGxDaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgIC8vR3JhYiBwcmV2aW91cyB2ZXJzaW9uIHRocmVzaG9sZHMgYW5kIHN0b3JlIGludG8gbmV3IGZvcm1hdFxuICAgIHZhciB0ID0gdGhpcy5wYW5lbC50aHJlc2hvbGRzO1xuICAgIGlmICh0eXBlb2YgdCA9PT0gJ3N0cmluZycgfHwgdCBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgdGhpcy5vbGRUaHJlc2hlc0NoYW5nZSh0KTtcbiAgICB9XG4gIH1cblxuICBvbkluaXRFZGl0TW9kZSgpIHtcbiAgICB0aGlzLmZvbnRTaXplcyA9IFsnMjAlJywgJzMwJScsICc1MCUnLCAnNzAlJywgJzgwJScsICcxMDAlJywgJzExMCUnLCAnMTIwJScsICcxNTAlJywgJzE3MCUnLCAnMjAwJSddO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKCdPcHRpb25zJywgJ3B1YmxpYy9wbHVnaW5zL2JsYWNrbWlycm9yMS1zaW5nbGVzdGF0LW1hdGgtcGFuZWwvZWRpdG9yLmh0bWwnLCAyKTtcbiAgICB0aGlzLmFkZEVkaXRvclRhYignVmFsdWUgTWFwcGluZ3MnLCAncHVibGljL3BsdWdpbnMvYmxhY2ttaXJyb3IxLXNpbmdsZXN0YXQtbWF0aC1wYW5lbC9tYXBwaW5ncy5odG1sJywgMyk7XG4gICAgdGhpcy51bml0Rm9ybWF0cyA9IGtibi5nZXRVbml0Rm9ybWF0cygpO1xuICB9XG5cbiAgb2xkVGhyZXNoZXNDaGFuZ2UodGhyZXNoZXMpIHtcbiAgICB2YXIgYXJyYXkgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBhcnJheSA9IEpTT04ucGFyc2UoXCJbXCIgKyB0aHJlc2hlcyArIFwiXVwiKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiSlNPTiBwYXJzZSBmYWlsZWRcIiArIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gICAgaWYgKGFycmF5ID09PSBudWxsKSB7XG4gICAgICAvLyB1c2Ugc3BsaXQgbWV0aG9kIGluc3RlYWRcbiAgICAgIGFycmF5ID0gdGhyZXNoZXMuc3BsaXQoXCIsXCIpO1xuICAgIH1cbiAgICB0aGlzLnRocmVzaG9sZHMgPSBbXTsgLy9pbnN0YW50aWF0ZSBhIG5ldyBkZWZpbmVkIGRpY3Rpb25hcnlcblxuICAgIC8vcHVzaCBvbGQgaXRlbXMgaW50byBuZXcgZGljdGlvbmFyeVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB1c2VDb2xvciA9IHRoaXMucGFuZWwuZGVmYXVsdENvbG9yO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhbmVsLmNvbG9ycyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAoaSA8IHRoaXMucGFuZWwuY29sb3JzLmxlbmd0aCkge1xuICAgICAgICAgIHVzZUNvbG9yID0gdGhpcy5wYW5lbC5jb2xvcnNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgY29sb3I6IHVzZUNvbG9yLFxuICAgICAgICB2YWx1ZTogTnVtYmVyKGFycmF5W2ldKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vT3ZlcndyaXRlIEpTT05cbiAgICB0aGlzLnBhbmVsW1widGhyZXNob2xkc1wiXSA9IHRoaXMudGhyZXNob2xkcztcbiAgfVxuXG4gIHNvcnRNeVRocmVzaGVzKGNvbnRyb2wpIHtcbiAgICBpZih0aGlzLnBhbmVsLnNvcnRPcmRlciA9PT0gJ2FzYycpIHtcbiAgICAgIGNvbnRyb2wucGFuZWwudGhyZXNob2xkcyA9IF8ub3JkZXJCeShjb250cm9sLnBhbmVsLnRocmVzaG9sZHMsIFtcInZhbHVlXCJdLCBbXCJhc2NcIl0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5zb3J0T3JkZXIgPT09ICdkZXNjJykge1xuICAgICAgY29udHJvbC5wYW5lbC50aHJlc2hvbGRzID0gXy5vcmRlckJ5KGNvbnRyb2wucGFuZWwudGhyZXNob2xkcywgW1widmFsdWVcIl0sIFtcImRlc2NcIl0pO1xuICAgIH1cbiAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgfVxuXG4gIHNldFVuaXRGb3JtYXQoc3ViSXRlbSkge1xuICAgIHRoaXMucGFuZWwuZm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9uRGF0YUVycm9yKGVycikge1xuICAgIHRoaXMub25EYXRhUmVjZWl2ZWQoW10pO1xuICB9XG5cbiAgb25FZGl0b3JSZW1vdmVUaHJlc2hvbGQoaW5kZXgpIHtcbiAgICB0aGlzLnBhbmVsLnRocmVzaG9sZHMuc3BsaWNlKGluZGV4LCAxKVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvbkVkaXRvckFkZFRocmVzaG9sZCgpIHtcbiAgICB0aGlzLnBhbmVsLnRocmVzaG9sZHMucHVzaCh7Y29sb3I6IHRoaXMucGFuZWwuZGVmYXVsdENvbG9yfSlcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgb25EYXRhUmVjZWl2ZWQoZGF0YUxpc3QpIHtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSB7fTtcbiAgICBpZiAoZGF0YUxpc3QubGVuZ3RoID4gMCAmJiBkYXRhTGlzdFswXS50eXBlID09PSAndGFibGUnKSB7XG4gICAgICB0aGlzLmRhdGFUeXBlID0gJ3RhYmxlJztcbiAgICAgIGNvbnN0IHRhYmxlRGF0YSA9IGRhdGFMaXN0Lm1hcCh0aGlzLnRhYmxlSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc2V0VGFibGVWYWx1ZXModGFibGVEYXRhLCBkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0aW1lc2VyaWVzJztcbiAgICAgIHRoaXMuc2VyaWVzID0gZGF0YUxpc3QubWFwKHRoaXMuc2VyaWVzSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc2V0VmFsdWVzKGRhdGEpO1xuICAgIH1cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBzZXJpZXNIYW5kbGVyKHNlcmllc0RhdGEpIHtcbiAgICB2YXIgc2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgZGF0YXBvaW50czogc2VyaWVzRGF0YS5kYXRhcG9pbnRzIHx8IFtdLFxuICAgICAgYWxpYXM6IHNlcmllc0RhdGEudGFyZ2V0LFxuICAgIH0pO1xuXG4gICAgc2VyaWVzLmZsb3RwYWlycyA9IHNlcmllcy5nZXRGbG90UGFpcnModGhpcy5wYW5lbC5udWxsUG9pbnRNb2RlKTtcbiAgICByZXR1cm4gc2VyaWVzO1xuICB9XG5cbiAgdGFibGVIYW5kbGVyKHRhYmxlRGF0YSkge1xuICAgIGNvbnN0IGRhdGFwb2ludHMgPSBbXTtcbiAgICBjb25zdCBjb2x1bW5OYW1lcyA9IHt9O1xuXG4gICAgdGFibGVEYXRhLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgY29sdW1uTmFtZXNbY29sdW1uSW5kZXhdID0gY29sdW1uLnRleHQ7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRhYmxlQ29sdW1uT3B0aW9ucyA9IGNvbHVtbk5hbWVzO1xuICAgIGlmICghXy5maW5kKHRhYmxlRGF0YS5jb2x1bW5zLCBbJ3RleHQnLCB0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXSkpIHtcbiAgICAgIHRoaXMuc2V0VGFibGVDb2x1bW5Ub1NlbnNpYmxlRGVmYXVsdCh0YWJsZURhdGEpO1xuICAgIH1cblxuICAgIHRhYmxlRGF0YS5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFwb2ludCA9IHt9O1xuXG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XTtcbiAgICAgICAgZGF0YXBvaW50W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhcG9pbnRzLnB1c2goZGF0YXBvaW50KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhcG9pbnRzO1xuICB9XG5cbiAgc2V0VGFibGVDb2x1bW5Ub1NlbnNpYmxlRGVmYXVsdCh0YWJsZURhdGEpIHtcbiAgICBpZiAodGFibGVEYXRhLmNvbHVtbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLnBhbmVsLnRhYmxlQ29sdW1uID0gdGFibGVEYXRhLmNvbHVtbnNbMF0udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IF8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgY29sID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbC50eXBlICE9PSAndGltZSc7XG4gICAgICB9KS50ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHNldFRhYmxlVmFsdWVzKHRhYmxlRGF0YSwgZGF0YSkge1xuICAgIGlmICghdGFibGVEYXRhIHx8IHRhYmxlRGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGFibGVEYXRhWzBdLmxlbmd0aCA9PT0gMCB8fCB0YWJsZURhdGFbMF1bMF1bdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFwb2ludCA9IHRhYmxlRGF0YVswXVswXTtcbiAgICBkYXRhLnZhbHVlID0gZGF0YXBvaW50W3RoaXMucGFuZWwudGFibGVDb2x1bW5dO1xuXG4gICAgaWYgKF8uaXNTdHJpbmcoZGF0YS52YWx1ZSkpIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBfLmVzY2FwZShkYXRhLnZhbHVlKTtcbiAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgIGNvbnN0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKFxuICAgICAgICBkYXRhcG9pbnRbdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0sXG4gICAgICAgIGRlY2ltYWxJbmZvLmRlY2ltYWxzLFxuICAgICAgICBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFsc1xuICAgICAgKTtcbiAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YS52YWx1ZSwgdGhpcy5wYW5lbC5kZWNpbWFscyB8fCAwKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFZhbHVlTWFwcGluZyhkYXRhKTtcbiAgfVxuXG4gIGNhbkNoYW5nZUZvbnRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmdhdWdlLnNob3c7XG4gIH1cblxuICBvblNwYXJrbGluZUNvbG9yQ2hhbmdlKG5ld0NvbG9yKSB7XG4gICAgdGhpcy5wYW5lbC5zcGFya2xpbmUubGluZUNvbG9yID0gbmV3Q29sb3I7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG9uU3BhcmtsaW5lRmlsbENoYW5nZShuZXdDb2xvcikge1xuICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmZpbGxDb2xvciA9IG5ld0NvbG9yO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXREZWNpbWFsc0ZvclZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKF8uaXNOdW1iZXIodGhpcy5wYW5lbC5kZWNpbWFscykpIHtcbiAgICAgIHJldHVybiB7IGRlY2ltYWxzOiB0aGlzLnBhbmVsLmRlY2ltYWxzLCBzY2FsZWREZWNpbWFsczogbnVsbCB9O1xuICAgIH1cblxuICAgIHZhciBkZWx0YSA9IHZhbHVlIC8gMjtcbiAgICB2YXIgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKTtcblxuICAgIHZhciBtYWduID0gTWF0aC5wb3coMTAsIC1kZWMpLFxuICAgICAgbm9ybSA9IGRlbHRhIC8gbWFnbiwgLy8gbm9ybSBpcyBiZXR3ZWVuIDEuMCBhbmQgMTAuMFxuICAgICAgc2l6ZTtcblxuICAgIGlmIChub3JtIDwgMS41KSB7XG4gICAgICBzaXplID0gMTtcbiAgICB9IGVsc2UgaWYgKG5vcm0gPCAzKSB7XG4gICAgICBzaXplID0gMjtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgMi41LCByZXF1aXJlcyBhbiBleHRyYSBkZWNpbWFsXG4gICAgICBpZiAobm9ybSA+IDIuMjUpIHtcbiAgICAgICAgc2l6ZSA9IDIuNTtcbiAgICAgICAgKytkZWM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub3JtIDwgNy41KSB7XG4gICAgICBzaXplID0gNTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2l6ZSA9IDEwO1xuICAgIH1cblxuICAgIHNpemUgKj0gbWFnbjtcblxuICAgIC8vIHJlZHVjZSBzdGFydGluZyBkZWNpbWFscyBpZiBub3QgbmVlZGVkXG4gICAgaWYgKE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSkge1xuICAgICAgZGVjID0gMDtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0OiBhbnkgPSB7fTtcbiAgICByZXN1bHQuZGVjaW1hbHMgPSBNYXRoLm1heCgwLCBkZWMpO1xuICAgIHJlc3VsdC5zY2FsZWREZWNpbWFscyA9IHJlc3VsdC5kZWNpbWFscyAtIE1hdGguZmxvb3IoTWF0aC5sb2coc2l6ZSkgLyBNYXRoLkxOMTApICsgMjtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzZXRWYWx1ZXMoZGF0YSkge1xuICAgIGRhdGEuZmxvdHBhaXJzID0gW107XG5cbiAgICBpZiAodGhpcy5zZXJpZXMubGVuZ3RoID4gMSB8fCB0aGlzLnBhbmVsLm1hdGgubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFzdFBvaW50ID0gW107XG4gICAgICBsZXQgbGFzdFZhbHVlID0gW107XG4gICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBsYXN0UG9pbnRbaW5kZXhdID0gXy5sYXN0KGVsZW1lbnQuZGF0YXBvaW50cyk7XG4gICAgICAgIGxhc3RWYWx1ZVtpbmRleF0gPSBfLmlzQXJyYXkobGFzdFBvaW50W2luZGV4XSkgPyBsYXN0UG9pbnRbaW5kZXhdWzBdIDogbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbC52YWx1ZU5hbWUgPT09ICduYW1lJykge1xuICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gdGhpcy5zZXJpZXNbMF0uYWxpYXM7XG5cbiAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsYXN0VmFsdWVbMF0pKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlWzBdKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ2xhc3RfdGltZScpIHtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGxhc3RQb2ludFswXVsxXTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBkYXRhLnZhbHVlO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLm1hdGgubGVuZ3RoKXtcbiAgICAgICAgICB2YXIgbWF0aEZ1bmN0aW9uID0gdGhpcy5wYW5lbC5tYXRoO1xuICAgICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBtYXRoRnVuY3Rpb24gPSBtYXRoRnVuY3Rpb24ucmVwbGFjZShuZXcgUmVnRXhwKGVsZW1lbnQuYWxpYXMsICdnaScpLCBTdHJpbmcoZWxlbWVudC5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbWF0aEZ1bmN0aW9uID0gbWF0aEZ1bmN0aW9uLnJlcGxhY2UobmV3IFJlZ0V4cCgnW0EtemEtel0rJywgJ2dpJyksIFN0cmluZygwKSk7XG4gICAgICAgICAgICBkYXRhLnZhbHVlID0gbWF0aC5ldmFsKG1hdGhGdW5jdGlvbik7XG4gICAgICAgICAgICBkYXRhLmZsb3RwYWlycyA9IHRoaXMuc2VyaWVzWzBdLmZsb3RwYWlycztcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvL0Vycm9yIGV2YWx1YXRpbmcgZnVuY3Rpb24uIERlZmF1bHRpbmcgdG8gemVyby5cbiAgICAgICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICAgICAgZGF0YS5mbG90cGFpcnMgPSBbMCwwXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBkYXRhLnZhbHVlID0gdGhpcy5zZXJpZXNbMF0uc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdO1xuICAgICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2ltYWxJbmZvID0gdGhpcy5nZXREZWNpbWFsc0ZvclZhbHVlKGRhdGEudmFsdWUpO1xuICAgICAgICBsZXQgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5mb3JtYXRdO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscywgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHMpO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkICRfX25hbWUgdmFyaWFibGUgZm9yIHVzaW5nIGluIHByZWZpeCBvciBwb3N0Zml4XG4gICAgICBpZih0aGlzLnNlcmllcyAmJiB0aGlzLnNlcmllcy5sZW5ndGggPiAwKXtcbiAgICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICAgIGRhdGEuc2NvcGVkVmFyc1snX19uYW1lJ10gPSB7IHZhbHVlOiB0aGlzLnNlcmllc1swXS5sYWJlbCB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXJpZXMubGVuZ3RoIDwgMiAmJiAhdGhpcy5wYW5lbC5tYXRoLmxlbmd0aCkge1xuICAgICAgbGV0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgIGxldCBsYXN0VmFsdWUgPSBfLmlzQXJyYXkobGFzdFBvaW50KSA/IGxhc3RQb2ludFswXSA6IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSB0aGlzLnNlcmllc1swXS5hbGlhcztcbiAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSAwO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLnZhbHVlTmFtZSA9PT0gJ2xhc3RfdGltZScpIHtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGxhc3RQb2ludFsxXTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBkYXRhLnZhbHVlO1xuICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgIGxldCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgbGV0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMsIGRlY2ltYWxJbmZvLnNjYWxlZERlY2ltYWxzKTtcbiAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgZGF0YS5zY29wZWRWYXJzID0gXy5leHRlbmQoe30sIHRoaXMucGFuZWwuc2NvcGVkVmFycyk7XG4gICAgICBkYXRhLnNjb3BlZFZhcnNbJ19fbmFtZSddID0geyB2YWx1ZTogdGhpcy5zZXJpZXNbMF0ubGFiZWwgfTtcbiAgICB9XG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBzZXRWYWx1ZU1hcHBpbmcoZGF0YSkge1xuICAgIC8vIGNoZWNrIHZhbHVlIHRvIHRleHQgbWFwcGluZ3MgaWYgaXRzIGVuYWJsZWRcbiAgICBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnZhbHVlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC52YWx1ZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAudmFsdWUgPT09ICdudWxsJykge1xuICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlL251bWJlciB0byB0ZXh0IG1hcHBpbmdcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VGbG9hdChtYXAudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnJhbmdlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5wYW5lbC5yYW5nZU1hcHNbaV07XG4gICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgIGlmIChtYXAuZnJvbSA9PT0gJ251bGwnICYmIG1hcC50byA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IG51bGwgfHwgZGF0YS52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsdWUvbnVtYmVyIHRvIHJhbmdlIG1hcHBpbmdcbiAgICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG1hcC5mcm9tKTtcbiAgICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChtYXAudG8pO1xuICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnZhbHVlTWFwcywgbWFwKTtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhZGRWYWx1ZU1hcCgpIHtcbiAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHsgdmFsdWU6ICcnLCBvcDogJz0nLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIHJlbW92ZVJhbmdlTWFwKHJhbmdlTWFwKSB7XG4gICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwucmFuZ2VNYXBzLCByYW5nZU1hcCk7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYWRkUmFuZ2VNYXAoKSB7XG4gICAgdGhpcy5wYW5lbC5yYW5nZU1hcHMucHVzaCh7IGZyb206ICcnLCB0bzogJycsIHRleHQ6ICcnIH0pO1xuICB9XG5cbiAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICB2YXIgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgdmFyIGxpbmtTcnYgPSB0aGlzLmxpbmtTcnY7XG4gICAgdmFyICR0aW1lb3V0ID0gdGhpcy4kdGltZW91dDtcbiAgICB2YXIgcGFuZWwgPSBjdHJsLnBhbmVsO1xuICAgIHZhciB0ZW1wbGF0ZVNydiA9IHRoaXMudGVtcGxhdGVTcnY7XG4gICAgdmFyIGRhdGEsIGxpbmtJbmZvO1xuICAgIHZhciAkcGFuZWxDb250YWluZXIgPSBlbGVtLmZpbmQoJy5wYW5lbC1jb250YWluZXInKTtcbiAgICBlbGVtID0gZWxlbS5maW5kKCcuc2luZ2xlc3RhdG1hdGgtcGFuZWwnKTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlLCB2YWx1ZVN0cmluZykge1xuICAgICAgaWYgKCFwYW5lbC5jb2xvclZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVN0cmluZztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcblxuICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBjb2xvciA9IHBhbmVsLnZhbHVlTWFwcGluZ0NvbG9yQmFja2dyb3VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiAnPHNwYW4gc3R5bGU9XCJjb2xvcjonICsgY29sb3IgKyAnXCI+JyArIHZhbHVlU3RyaW5nICsgJzwvc3Bhbj4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3BhbihjbGFzc05hbWUsIGZvbnRTaXplLCB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHZhbHVlLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCIgc3R5bGU9XCJmb250LXNpemU6JyArIGZvbnRTaXplICsgJ1wiPicgKyB2YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICB2YXIgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdG1hdGgtcGFuZWwtdmFsdWUtY29udGFpbmVyXCI+JztcblxuICAgICAgaWYgKHBhbmVsLnByZWZpeCkge1xuICAgICAgICB2YXIgcHJlZml4ID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgcGFuZWwucHJlZml4KTtcbiAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0bWF0aC1wYW5lbC1wcmVmaXgnLCBwYW5lbC5wcmVmaXhGb250U2l6ZSwgcHJlZml4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gYXBwbHlDb2xvcmluZ1RocmVzaG9sZHMoZGF0YS52YWx1ZSwgZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXZhbHVlJywgcGFuZWwudmFsdWVGb250U2l6ZSwgdmFsdWUpO1xuXG4gICAgICBpZiAocGFuZWwucG9zdGZpeCkge1xuICAgICAgICB2YXIgcG9zdGZpeCA9IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKGRhdGEudmFsdWUsIHBhbmVsLnBvc3RmaXgpO1xuICAgICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXRtYXRoLXBhbmVsLXBvc3RmaXgnLCBwYW5lbC5wb3N0Zml4Rm9udFNpemUsIHBvc3RmaXgpO1xuICAgICAgfVxuXG4gICAgICBib2R5ICs9ICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZVRleHQoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFuZWwucHJlZml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wcmVmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcbiAgICAgIHJlc3VsdCArPSBkYXRhLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgcmVzdWx0ICs9IHBhbmVsLnBvc3RmaXggPyB0ZW1wbGF0ZVNydi5yZXBsYWNlKHBhbmVsLnBvc3RmaXgsIGRhdGEuc2NvcGVkVmFycykgOiAnJztcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRHYXVnZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgIHZhciBoZWlnaHQgPSBlbGVtLmhlaWdodCgpO1xuICAgICAgLy8gQWxsb3cgdG8gdXNlIGEgYml0IG1vcmUgc3BhY2UgZm9yIHdpZGUgZ2F1Z2VzXG4gICAgICB2YXIgZGltZW5zaW9uID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCAqIDEuMyk7XG5cbiAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSBmYWxzZTtcbiAgICAgIGlmIChwYW5lbC5nYXVnZS5taW5WYWx1ZSA+IHBhbmVsLmdhdWdlLm1heFZhbHVlKSB7XG4gICAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIHZhciBwbG90Q3NzID0ge1xuICAgICAgICB0b3A6ICcxMHB4JyxcbiAgICAgICAgbWFyZ2luOiAnYXV0bycsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCAqIDAuOSArICdweCcsXG4gICAgICAgIHdpZHRoOiBkaW1lbnNpb24gKyAncHgnLFxuICAgICAgfTtcblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIHZhciB0aHJlc2hvbGRzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhbmVsLnRocmVzaG9sZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogcGFuZWwudGhyZXNob2xkc1tpXS52YWx1ZSxcbiAgICAgICAgICBjb2xvcjogcGFuZWwudGhyZXNob2xkc1tpXS5jb2xvcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aHJlc2hvbGRzLnB1c2goe1xuICAgICAgICB2YWx1ZTogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgIGNvbG9yOiBwYW5lbC50aHJlc2hvbGRzW3BhbmVsLnRocmVzaG9sZHMubGVuZ3RoIC0gMV0sXG4gICAgICB9KTtcblxuICAgICAgdmFyIGJnQ29sb3IgPSBjb25maWcuYm9vdERhdGEudXNlci5saWdodFRoZW1lID8gJ3JnYigyMzAsMjMwLDIzMCknIDogJ3JnYigzOCwzOCwzOCknO1xuXG4gICAgICB2YXIgZm9udFNjYWxlID0gcGFyc2VJbnQocGFuZWwudmFsdWVGb250U2l6ZSkgLyAxMDA7XG4gICAgICB2YXIgZm9udFNpemUgPSBNYXRoLm1pbihkaW1lbnNpb24gLyA1LCAxMDApICogZm9udFNjYWxlO1xuICAgICAgLy8gUmVkdWNlIGdhdWdlIHdpZHRoIGlmIHRocmVzaG9sZCBsYWJlbHMgZW5hYmxlZFxuICAgICAgdmFyIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbyA9IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyA/IDEuNSA6IDE7XG4gICAgICB2YXIgZ2F1Z2VXaWR0aCA9IE1hdGgubWluKGRpbWVuc2lvbiAvIDYsIDYwKSAvIGdhdWdlV2lkdGhSZWR1Y2VSYXRpbztcbiAgICAgIHZhciB0aHJlc2hvbGRNYXJrZXJzV2lkdGggPSBnYXVnZVdpZHRoIC8gNTtcbiAgICAgIHZhciB0aHJlc2hvbGRMYWJlbEZvbnRTaXplID0gZm9udFNpemUgLyAyLjU7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBnYXVnZXM6IHtcbiAgICAgICAgICAgIGdhdWdlOiB7XG4gICAgICAgICAgICAgIG1pbjogcGFuZWwuZ2F1Z2UubWluVmFsdWUsXG4gICAgICAgICAgICAgIG1heDogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHsgY29sb3I6IGJnQ29sb3IgfSxcbiAgICAgICAgICAgICAgYm9yZGVyOiB7IGNvbG9yOiBudWxsIH0sXG4gICAgICAgICAgICAgIHNoYWRvdzogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgICB3aWR0aDogZ2F1Z2VXaWR0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmcmFtZTogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICAgICAgbGFiZWw6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxheW91dDogeyBtYXJnaW46IDAsIHRocmVzaG9sZFdpZHRoOiAwIH0sXG4gICAgICAgICAgICBjZWxsOiB7IGJvcmRlcjogeyB3aWR0aDogMCB9IH0sXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IHtcbiAgICAgICAgICAgICAgdmFsdWVzOiB0aHJlc2hvbGRzLFxuICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHRocmVzaG9sZE1hcmtlcnNXaWR0aCArIDEsXG4gICAgICAgICAgICAgICAgZm9udDogeyBzaXplOiB0aHJlc2hvbGRMYWJlbEZvbnRTaXplIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZE1hcmtlcnMsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHBhbmVsLmNvbG9yVmFsdWUgPyBnZXRDb2xvckZvclZhbHVlKHBhbmVsLnRocmVzaG9sZHMsIGRhdGEudmFsdWVSb3VuZGVkKSA6IG51bGwsXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlVGV4dCgpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZmFtaWx5OiAnXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBlbGVtLmFwcGVuZChwbG90Q2FudmFzKTtcblxuICAgICAgdmFyIHBsb3RTZXJpZXMgPSB7XG4gICAgICAgIGRhdGE6IFtbMCwgZGF0YS52YWx1ZVJvdW5kZWRdXSxcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFNwYXJrbGluZSgpIHtcbiAgICAgIHZhciB3aWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgaWYgKHdpZHRoIDwgMzApIHtcbiAgICAgICAgLy8gZWxlbWVudCBoYXMgbm90IGdvdHRlbiBpdCdzIHdpZHRoIHlldFxuICAgICAgICAvLyBkZWxheSBzcGFya2xpbmUgcmVuZGVyXG4gICAgICAgIHNldFRpbWVvdXQoYWRkU3BhcmtsaW5lLCAzMCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGhlaWdodCA9IGN0cmwuaGVpZ2h0O1xuICAgICAgdmFyIHBsb3RDYW52YXMgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgICAgdmFyIHBsb3RDc3M6IGFueSA9IHt9O1xuICAgICAgcGxvdENzcy5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cbiAgICAgIGlmIChwYW5lbC5zcGFya2xpbmUuZnVsbCkge1xuICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICc1cHgnO1xuICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgIHBsb3RDc3Mud2lkdGggPSB3aWR0aCAtIDEwICsgJ3B4JztcbiAgICAgICAgdmFyIGR5bmFtaWNIZWlnaHRNYXJnaW4gPSBoZWlnaHQgPD0gMTAwID8gNSA6IE1hdGgucm91bmQoaGVpZ2h0IC8gMTAwKSAqIDE1ICsgNTtcbiAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBoZWlnaHQgLSBkeW5hbWljSGVpZ2h0TWFyZ2luICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsb3RDc3MuYm90dG9tID0gJzBweCc7XG4gICAgICAgIHBsb3RDc3MubGVmdCA9ICctNXB4JztcbiAgICAgICAgcGxvdENzcy53aWR0aCA9IHdpZHRoIC0gMTAgKyAncHgnO1xuICAgICAgICBwbG90Q3NzLmhlaWdodCA9IE1hdGguZmxvb3IoaGVpZ2h0ICogMC4yNSkgKyAncHgnO1xuICAgICAgfVxuXG4gICAgICBwbG90Q2FudmFzLmNzcyhwbG90Q3NzKTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGxlZ2VuZDogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBsaW5lczoge1xuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGw6IDEsXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IHBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgeWF4ZXM6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgeGF4aXM6IHtcbiAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICBtb2RlOiAndGltZScsXG4gICAgICAgICAgbWluOiBjdHJsLnJhbmdlLmZyb20udmFsdWVPZigpLFxuICAgICAgICAgIG1heDogY3RybC5yYW5nZS50by52YWx1ZU9mKCksXG4gICAgICAgIH0sXG4gICAgICAgIGdyaWQ6IHsgaG92ZXJhYmxlOiBmYWxzZSwgc2hvdzogZmFsc2UgfSxcbiAgICAgIH07XG5cbiAgICAgIGVsZW0uYXBwZW5kKHBsb3RDYW52YXMpO1xuXG4gICAgICB2YXIgcGxvdFNlcmllcyA9IHtcbiAgICAgICAgZGF0YTogZGF0YS5mbG90cGFpcnMsXG4gICAgICAgIGNvbG9yOiBwYW5lbC5zcGFya2xpbmUubGluZUNvbG9yLFxuICAgICAgfTtcblxuICAgICAgJC5wbG90KHBsb3RDYW52YXMsIFtwbG90U2VyaWVzXSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgaWYgKCFjdHJsLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGF0YSA9IGN0cmwuZGF0YTtcbiAgICAgIHZhciBib2R5ID0gcGFuZWwuZ2F1Z2Uuc2hvdyA/ICcnIDogZ2V0QmlnVmFsdWVIdG1sKCk7XG4gICAgICB2YXIgY29sb3IgPSAnJztcbiAgICAgIGlmIChwYW5lbC5jb2xvckJhY2tncm91bmQpIHtcbiAgICAgICAgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbG9yID0gcGFuZWwudmFsdWVNYXBwaW5nQ29sb3JCYWNrZ3JvdW5kOyAvL251bGwgb3IgZ3JleSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShwYW5lbC50aHJlc2hvbGRzLCBkYXRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgIGlmIChzY29wZS5mdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgcGFuZWwuY2lyY2xlQmFja2dyb3VuZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCB0byBDaXJjbGVcbiAgICAgIGlmIChwYW5lbC5jaXJjbGVCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGxldCBjaXJjbGVIZWlnaHQgPSAkKCRwYW5lbENvbnRhaW5lci5oZWlnaHQoKSlbMF0gLSAyNjtcbiAgICAgICAgbGV0IGNpcmNsZVdpZHRoID0gJCgkcGFuZWxDb250YWluZXIud2lkdGgoKSlbMF07XG5cbiAgICAgICAgJCgkcGFuZWxDb250YWluZXIpLmFkZENsYXNzKCdjaXJjbGUnKTtcbiAgICAgICAgJHBhbmVsQ29udGFpbmVyLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcblxuICAgICAgICBpZiAoY2lyY2xlV2lkdGggPj0gY2lyY2xlSGVpZ2h0KSB7XG4gICAgICAgICAgZWxlbS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlci1yYWRpdXMnOiA1MCArICclJyxcbiAgICAgICAgICAgICd3aWR0aCc6IGNpcmNsZUhlaWdodCArICdweCcsXG4gICAgICAgICAgICAnaGVpZ2h0JzogY2lyY2xlSGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IDUwICsgJyUnLFxuICAgICAgICAgICAgJ3dpZHRoJzogY2lyY2xlV2lkdGggKyAncHgnLFxuICAgICAgICAgICAgJ2hlaWdodCc6IGNpcmNsZVdpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgkcGFuZWxDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NpcmNsZScpKTtcbiAgICAgICAgZWxlbS5jc3MoeyAnYm9yZGVyLXJhZGl1cyc6ICcwJywgd2lkdGg6ICcnLCBoZWlnaHQ6ICcnIH0pO1xuICAgICAgfVxuXG4gICAgICBlbGVtLmh0bWwoYm9keSk7XG5cbiAgICAgIGlmIChwYW5lbC5zcGFya2xpbmUuc2hvdykge1xuICAgICAgICBhZGRTcGFya2xpbmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmVsLmdhdWdlLnNob3cpIHtcbiAgICAgICAgYWRkR2F1Z2UoKTtcbiAgICAgIH1cblxuICAgICAgZWxlbS50b2dnbGVDbGFzcygncG9pbnRlcicsIHBhbmVsLmxpbmtzLmxlbmd0aCA+IDApO1xuXG4gICAgICBpZiAocGFuZWwubGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5rSW5mbyA9IGxpbmtTcnYuZ2V0UGFuZWxMaW5rQW5jaG9ySW5mbyhwYW5lbC5saW5rc1swXSwgZGF0YS5zY29wZWRWYXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmtJbmZvID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpIHtcbiAgICAgIC8vIGRyaWxsZG93biBsaW5rIHRvb2x0aXBcblxuICAgICAgaWYgKGN0cmwucGFuZWwuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdmFyIGRyaWxsZG93blRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwidG9vbHRpcFwiIGNsYXNzPVwiXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOndoaXRlO21hcmdpbjphdXRvO2NvbG9yOmJsYWNrO3dpZHRoOjIwMHB4O2JveC1zaGFkb3c6IDAgM3B4IDZweCByZ2JhKDAsIDAsIDAsIDAuMSk7XCI+PGg2IHN0eWxlPVwiY29sb3I6YmxhY2s7XCI+JyBcbiAgICAgICsgY3RybC5wYW5lbC50aXRsZSArICc8L2g2PicgKyBjdHJsLnBhbmVsLmRlc2NyaXB0aW9uICsgJzwvZGl2PlwiJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZHJpbGxkb3duVG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJ0b29sdGlwXCIgY2xhc3M9XCJcIiBzdHlsZT1cImJhY2tncm91bmQ6d2hpdGU7bWFyZ2luOmF1dG87Y29sb3I6YmxhY2s7d2lkdGg6MjAwcHg7Ym94LXNoYWRvdzogMCAzcHggNnB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcIj48aDYgc3R5bGU9XCJjb2xvcjpibGFjaztcIj4nIFxuICAgICAgKyBjdHJsLnBhbmVsLnRpdGxlICsgJzwvaDY+Tm8gRGVzY3JpcHRpb248L2Rpdj5cIicpO1xuICAgICAgfVxuXG4gICAgICBlbGVtLm1vdXNlbGVhdmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGVsZW0uY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmICghbGlua0luZm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWdub3JlIHRpdGxlIGNsaWNrcyBpbiB0aXRsZVxuICAgICAgICBpZiAoJChldnQpLnBhcmVudHMoJy5wYW5lbC1oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLnRhcmdldCA9PT0gJ19ibGFuaycpIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihsaW5rSW5mby5ocmVmLCAnX2JsYW5rJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmtJbmZvLmhyZWYuaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rSW5mby5ocmVmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnVybChsaW5rSW5mby5ocmVmKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgZWxlbS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIWN0cmwucGFuZWwudG9vbHRpcC5zaG93KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kcmlsbGRvd25Ub29sdGlwLnRleHQoZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIC8vZHJpbGxkb3duVG9vbHRpcC50ZXh0KCdjbGljayB0byBnbyB0bzogJyArIGxpbmtJbmZvLnRpdGxlKTtcbiAgICAgICAgLy9kcmlsbGRvd25Ub29sdGlwLnRleHQoY3RybC5wYW5lbC5kZXNjcmlwdGlvbik7XG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAucGxhY2VfdHQoZS5wYWdlWCwgZS5wYWdlWSAtIDUwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhvb2t1cERyaWxsZG93bkxpbmtUb29sdGlwKCk7XG5cbiAgICB0aGlzLmV2ZW50cy5vbigncmVuZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JGb3JWYWx1ZSh0aHJlc2hvbGRzLCB2YWx1ZSkge1xuICBsZXQgY29sb3IgPSAnJztcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG4gIGZvciAobGV0IGkgPSB0aHJlc2hvbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGV0IGFUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW2ldO1xuICAgIGNvbG9yID0gYVRocmVzaG9sZC5jb2xvcjtcbiAgICAgIGlmICh2YWx1ZSA+PSBhVGhyZXNob2xkLnZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhVGhyZXNob2xkLmNvbG9yO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuZXhwb3J0IHtTaW5nbGVTdGF0TWF0aEN0cmwsIFNpbmdsZVN0YXRNYXRoQ3RybCBhcyBQYW5lbEN0cmwsIGdldENvbG9yRm9yVmFsdWV9XG4vLyBleHBvcnQgeyBTaW5nbGVTdGF0Q3RybCwgU2luZ2xlU3RhdEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH07XG4iXX0=
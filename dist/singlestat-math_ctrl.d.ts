/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import 'jquery.flot';
import './lib/flot/jquery.flot.gauge';
import 'jquery.flot.time';
import 'jquery.flot.crosshair';
import './css/panel_singlestatmath.css!';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
declare class SingleStatMathCtrl extends MetricsPanelCtrl {
    private $location;
    private linkSrv;
    static templateUrl: string;
    dataType: string;
    series: any[];
    data: any;
    fontSizes: any[];
    unitFormats: any[];
    invalidGaugeRange: boolean;
    panel: any;
    events: any;
    valueNameOptions: any[];
    tableColumnOptions: any;
    thresholds: any[];
    panelDefaults: {
        links: any[];
        datasource: any;
        maxDataPoints: number;
        interval: any;
        targets: {}[];
        cacheTimeout: any;
        defaultColor: string;
        thresholds: string;
        format: string;
        sortOrder: string;
        prefix: string;
        postfix: string;
        nullText: any;
        valueMaps: {
            value: string;
            op: string;
            text: string;
        }[];
        mappingTypes: {
            name: string;
            value: number;
        }[];
        rangeMaps: {
            from: string;
            to: string;
            text: string;
        }[];
        mappingType: number;
        nullPointMode: string;
        valueName: string;
        prefixFontSize: string;
        valueFontSize: string;
        postfixFontSize: string;
        math: string;
        colorBackground: boolean;
        circleBackground: boolean;
        valueMappingColorBackground: string;
        colorValue: boolean;
        sparkline: {
            show: boolean;
            full: boolean;
            lineColor: string;
            fillColor: string;
        };
        gauge: {
            show: boolean;
            minValue: number;
            maxValue: number;
            thresholdMarkers: boolean;
            thresholdLabels: boolean;
        };
        sortOrderOptions: {
            value: string;
            text: string;
        }[];
        tableColumn: string;
    };
    constructor($scope: any, $injector: any, $location: any, linkSrv: any);
    onInitEditMode(): void;
    oldThreshesChange(threshes: any): void;
    sortMyThreshes(control: any): void;
    setUnitFormat(subItem: any): void;
    onDataError(err: any): void;
    onEditorRemoveThreshold(index: any): void;
    onEditorAddThreshold(): void;
    onDataReceived(dataList: any): void;
    seriesHandler(seriesData: any): any;
    tableHandler(tableData: any): any[];
    setTableColumnToSensibleDefault(tableData: any): void;
    setTableValues(tableData: any, data: any): void;
    canChangeFontSize(): any;
    onSparklineColorChange(newColor: any): void;
    onSparklineFillChange(newColor: any): void;
    getDecimalsForValue(value: any): any;
    setValues(data: any): void;
    setValueMapping(data: any): void;
    removeValueMap(map: any): void;
    addValueMap(): void;
    removeRangeMap(rangeMap: any): void;
    addRangeMap(): void;
    link(scope: any, elem: any, attrs: any, ctrl: any): void;
}
declare function getColorForValue(thresholds: any, value: any): any;
export { SingleStatMathCtrl, SingleStatMathCtrl as PanelCtrl, getColorForValue };

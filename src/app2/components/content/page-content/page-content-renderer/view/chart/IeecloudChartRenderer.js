import './styles/chart-monitoring.scss';
import {Chart, Tooltip} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import {v4 as uuidv4} from "uuid";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

import 'chartjs-adapter-date-fns';

import {ru} from 'date-fns/locale';
import {find, findIndex, isEqual, isNull, max, min, remove} from "lodash-es";

import annotationPlugin from 'chartjs-plugin-annotation';
import * as IeecloudChartsEventRenderer from "./IeecloudChartsEventCtxExtention.js";
import moment from "moment/moment.js";
import 'moment/locale/ru';

Chart.register(annotationPlugin);


Chart.register(zoomPlugin);
Chart.register(Tooltip);

export default class IeecloudChartRenderer {
    #node;
    #indicatorsElement;
    myChart;
    #uuid;

    #linesMap = {};

    #annotationElement = null;
    #circleElement = null;
    #moverPlugin;
    #htmlLegendPluginMap = {};
    #chartCountMoreThanOne;
    #container;

    constructor(node, indicatorsElement,  chartCountMoreThanOne) {
        this.#node = node;
        this.#indicatorsElement = indicatorsElement;
        this.#chartCountMoreThanOne = chartCountMoreThanOne;
        this.#init();

    }


    generateTemplate() {
        this.#uuid = uuidv4();
        return `     <div class="${(this.#chartCountMoreThanOne ? "col-md-6" : "col-md-12")}" 
     id="chart-container-` + this.#node.id + `-indicator-` + this.#uuid + `" style="position: relative; text-align: center">
     <div id="chart-container-1-` + this.#node.id + `-indicator-` + this.#uuid + `" style="position: relative; text-align: center; height:${(this.#chartCountMoreThanOne ? '450px' : '600px')};  ">
               <div class="chart-actions-area d-none" id="chart-actions-area-` + this.#uuid + `">
<div class="chart-zoom-top"><div class="chart-zoom-control">
<a  title="Увеличить" role="button" aria-label="Увеличить" id="chart-zoom-in-` + this.#uuid + `">+</a>
<a  title="Уменьшить" role="button" aria-label="Уменьшить" id="chart-zoom-out-` + this.#uuid + `">−</a>
<a  title="Cбросить" role="button" aria-label="Zoom out" id="chart-zoom-reset-` + this.#uuid + `"><i class="fas fa-undo fa-xs"></i></a>
</div></div></div>

                        <canvas id="canvas-1` + this.#node.id + `-indicator-` + this.#uuid + `""></canvas>
</div>`;
    }


    render(container) {
        const scope = this;
        const viewTemplate = this.generateTemplate();
        scope.#container = container;
        scope.#container.insertAdjacentHTML('beforeend', viewTemplate);
    }

    #findMaxXAxisIndex(datasets) {
        const scope = this;
        if (!datasets) {
            return undefined;
        }
        if (datasets.length === 1) {
            return datasets[0].data[datasets[0].data.length - 1]?.x ;
        } else if (datasets.length > 1) {

            let maxXValue = scope.#getValByIndex(datasets, 0);

            for (let i = 1; i < datasets.length; i++) {
                const potentialVal = scope.#getValByIndex(datasets, i);
                if (maxXValue < potentialVal) {
                    maxXValue = potentialVal;
                }

            }
            return maxXValue;
        }
        return undefined;
    }

    #getValByIndex(datasets, i) {
        return datasets[i].data.map(a => a.x)[datasets[i].data.length - 1];
    }

    #findMinXAxisIndex(datasets) {
        if (!datasets) {
            return undefined;
        }
        if (datasets.length === 1) {
            return datasets[0].data[0]?.x;
        } else if (datasets.length > 1) {
            let minXValue = datasets[0].data.map(a => a.x)[0];

            for (let i = 1; i < datasets.length; i++) {
                const potentialVal = datasets[i].data.map(a => a.x)[0];
                if (minXValue > potentialVal) {
                    minXValue = potentialVal;
                }

            }

            return  minXValue;
        }

        return undefined;
    }
    #convertUnixTimeToHumanDateWitFormat(milliseconds, format) {
        const dateObject = new Date(milliseconds);
        moment.locale('ru');
        return moment(dateObject).format(format);
    }

    #calculateDataPositionTooltip(tooltip, elements, position) {
        if (!elements.length) {
            return false;
        }
        let offset = 0;
        if (tooltip.chart.width / 2 > position.x) {
            offset = tooltip.width / 2;
        } else {
            offset = -tooltip.width / 2;
        }
        return {
            x: position.x + offset,
            y: position.y
        }
    }

    renderChart(settings) {
        const scope = this;
        let titleY = '';
        let chartCode = '';
        let chartName = '';
        let zoomLimit = 0;
        if (this.#indicatorsElement) {
            titleY = this.#indicatorsElement.title;
            chartCode = this.#indicatorsElement.code;
            zoomLimit = this.#indicatorsElement.zoomLimit;
            chartName = this.#indicatorsElement.name;
        }

        if (settings.withEventsTooltip) {
            Tooltip.positioners['lineAnnotation-' + chartCode] = function (elements, position) {
                const tooltip = this;
                if (scope.#annotationElement != null) {
                    if (scope.#circleElement && !tooltip.circleElement ||
                        scope.#circleElement && tooltip.circleElement
                        && tooltip.circleElement.eventData.id !== scope.#circleElement.eventData.id) {
                        return scope.#circleElement.foundCoordinate ? scope.#circleElement.foundCoordinate
                            : scope.#annotationElement.getCenterPoint();
                    }
                    return Tooltip.positioners.nearest.call(tooltip, elements, position);
                } else {
                    return scope.#calculateDataPositionTooltip(tooltip, elements, position);
                }

            };
        } else {
            Tooltip.positioners.custom = function (elements, position) {
                const tooltip = this;
                return scope.#calculateDataPositionTooltip(tooltip, elements, position);
            }

            Chart.register(IeecloudChartsEventRenderer.setColorToCanvas(this.#uuid,
                'white'));
        }

        const config = {
            uuid : scope.#uuid,
            type: 'line',
            plugins: [scope.#moverPlugin],
            options: {
                events: IeecloudAppUtils.isMobileDevice() ? ['click'] : ['mousemove', 'mouseout', 'click'],
                onResize: function (myChart) {
                    if (IeecloudAppUtils.isMobileDevice()) {
                        myChart.canvas.style.touchAction = 'pan-y';
                    }
                },
                interaction: {
                    intersect: !IeecloudAppUtils.isMobileDevice()
                },
                animation: {
                    onComplete: function (myChart) {
                        if (myChart.initial) {
                            const chartActionsArea = document.querySelector("#chart-actions-area-" + scope.#uuid);
                            chartActionsArea?.classList.remove('d-none');
                            scope.#addDomListeners();
                        }
                    }
                },
                spanGaps: true,
                scales: {
                    x: {
                        type: 'time',
                        adapters: {
                            date: {
                                locale: ru,
                            },
                        },

                        time: {
                            unit: "week",
                            tooltipFormat: 'dd MMM yyyy г., HH:mm'
                        },

                        title: {
                            display: true,
                            text: 'Дата Измерения'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: titleY
                        }
                    }
                },
                maintainAspectRatio: false,
                plugins: {
                    annotation: {
                        common: {
                            drawTime: 'beforeDraw'
                        },
                        annotations: {}
                    },
                    zoom: {
                        limits: {
                            x: {
                                minRange: zoomLimit, // This is smallest time window you want to zoom into
                            }
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            overScaleMode: 'y'
                        },
                        zoom: {
                            wheel: {
                                enabled: true
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'xy',
                            overScaleMode: 'y'
                        }
                    },
                    title: {
                        display: true,
                        text: chartName,
                        font: {
                            size: 20
                        }
                    },
                    tooltip: {
                        enabled: false,
                        position: 'custom',
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            title: function (tooltipItems) {
                                if (scope.#annotationElement != null && scope.#circleElement != null) {
                                    return scope.#convertUnixTimeToHumanDateWitFormat(scope.#circleElement.eventData.time, 'DD MMM yyyy г., HH:mm');
                                }
                                return tooltipItems[0].label;
                            },
                        },
                        external: IeecloudChartsEventRenderer.externalTooltipHandler
                    }
                }
            }
        };

        let ctx = document.getElementById("canvas-1" + this.#node.id + "-indicator-" + this.#uuid)?.getContext('2d');
        if (this.myChart) {
            this.myChart.destroy();
        }

        if (ctx) {
            this.myChart = new Chart(
                ctx,
                config
            );
        }

        if (settings.withEventsTooltip) {
            scope.myChart.config.options.plugins.tooltip.position = 'lineAnnotation-' + chartCode;
            document.addEventListener('click', scope.#documentClickListener);
        }
    }

    addSpinner(){
        const scope = this;
        // TODO:add common solution for all views
        const spinner = `<div style="z-index:1000; width:fit-content; display: inline-block; position:absolute;top:50%" id="chart-spinner-${scope.#uuid}">
            <div class="spinner-border" style="width: 3rem; height: 3em;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        const container = document.querySelector("#chart-container-1-" + scope.#node.id + "-indicator-" + this.#uuid);
        container.insertAdjacentHTML('beforeend', spinner);
    }

    removeSpinner() {
        const spinnerContainer = document.querySelector("#chart-spinner-" + this.#uuid);
        spinnerContainer?.remove();
    }

    destroy() {
        for(let key in this.#htmlLegendPluginMap){
            this.clearEventStore(key);
        }
        if (this.myChart) {
            this.myChart.destroy();
        }
        this.#removeDomListeners();
    }

    clearEventStore(storeId) {
        const scope = this;
        if (scope.#htmlLegendPluginMap[storeId]) {
            Chart.unregister(scope.#htmlLegendPluginMap[storeId]);
        }
        const htmlLegendContainer = document.getElementById(
            scope.myChart.config.options.plugins['htmlLegend-' + storeId].containerID);
        if (htmlLegendContainer) {
            htmlLegendContainer.innerHTML = '';
        }

        for (let key in scope.#linesMap[storeId]) {
            delete scope.myChart.config.options.plugins.annotation.annotations[key];
        }
        scope.myChart.update();
    }


    loadEventStore(itemStore, eventsData) {
        const scope = this;

        const storeId = itemStore.id;

        let eventsForLegend = [];
        scope.#linesMap[storeId] = {};

        for (let i = 0; i < eventsData.length; i++) {
            scope.#linesMap[storeId]["line-" + storeId + "-" + i] = {
                type: 'line',
                xMin: eventsData[i].time, // event data
                xMax: eventsData[i].time,
                click: ({element}, event) => IeecloudChartsEventRenderer.selectEvent(element, event),
                enter(ctx, event) {
                    scope.#annotationElement = ctx.element;
                },
                leave(ctx, event) {
                    scope.#annotationElement = null;
                    const chart = ctx.chart;
                    const tooltip = chart.tooltip;
                    tooltip.circleElement = undefined;
                    tooltip.setActiveElements([]);
                    chart.update();
                },
                label: {
                    content: IeecloudChartsEventRenderer.getCirclesByEvents(eventsData[i].events, eventsData[i].time),
                    backgroundColor: 'transparent',
                    display: true,
                    padding: 0,
                    position: 'start'
                },
                borderDash: [2, 2],
                borderColor: IeecloudChartsEventRenderer.CHART_COLORS.blue,
                borderWidth: 2,
            }

            eventsData[i].events.forEach(function (event) {
                eventsForLegend.push(event);
            });
        }

        scope.#htmlLegendPluginMap[storeId] = IeecloudChartsEventRenderer.createLegendByStoreType(storeId,
            eventsForLegend, itemStore);

        Chart.register(scope.#htmlLegendPluginMap[storeId]);

        let legendTemplate = `<div id="legend-container` + this.#node.id + `-indicator-` + this.#uuid + `-store-` + storeId + `"  class="chart-legend" style="padding-left: 2rem;"></div>`
        const chartContainer = document.querySelector("#chart-container-" +
            this.#node.id + "-indicator-" + this.#uuid);
        if (chartContainer) {
            chartContainer.insertAdjacentHTML('afterbegin', legendTemplate);
        }


        scope.myChart.config.options.plugins["htmlLegend-" + storeId] = {
            containerID: 'legend-container' + scope.#node.id + '-indicator-' + scope.#uuid + '-store-' + storeId,
        }
        for (let key in scope.#linesMap[storeId]) {
            scope.myChart.config.options.plugins.annotation.annotations[key] = scope.#linesMap[storeId][key]
        }
        scope.myChart.update();
    }

    #addDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#chart-zoom-in-" + this.#uuid);
        zoomIn?.addEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#chart-zoom-out-" + this.#uuid);
        zoomOut?.addEventListener('click', scope.#zoomOutListener);
        const zoomReset = document.querySelector("#chart-zoom-reset-" + this.#uuid);
        zoomReset?.addEventListener('click', scope.#zoomResetListener);
    }

    #removeDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#chart-zoom-in-" + this.#uuid);
        zoomIn?.removeEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#chart-zoom-out-" + this.#uuid);
        zoomOut?.removeEventListener('click', scope.#zoomOutListener);
        const zoomReset = document.querySelector("#chart-zoom-reset-" + this.#uuid);
        zoomReset?.removeEventListener('click', scope.#zoomResetListener);

        document.removeEventListener('click', scope.#documentClickListener);
    }

    #documentClickListener = (event) => {
        const scope = this;
        if(scope.myChart.hasOwnProperty('_lastEvent')) {
            scope.myChart._lastEvent = null;
        }
        // TODO : figure out wtf
        // scope.myChart.setActiveElements([{datasetIndex: 0, index: 2}]);
        // scope.myChart.tooltip.setActiveElements([], {x: 100, y: 100});
        scope.myChart.update();
    }

    #zoomInListener = (event) => {
        const scope = this;
        scope.myChart.zoom(1.1);
    }

    #zoomOutListener = (event) => {
        const scope = this;
        scope.myChart.zoom(0.9);
    }

    #zoomResetListener = (event) => {
        const scope = this;
        scope.resetZoom();
    }

    resetZoom() {
        this.myChart.resetZoom();
    }

    screenshot(){
        const url = this.myChart.toBase64Image("image/png", 1.0);
        let link = document.createElement('a');
        link.href = url
        link.style.display = "none";
        link.download = `${this.myChart.name || 'chart'}.png`;
        link.click();
    }

    #init() {
        const scope = this;
        scope.#moverPlugin = {
            id: 'mover',
            beforeEvent(chart, args, options) {
                if (scope.#handleMove(chart, args.event)) {
                    args.changed = true;

                }
            }
        };
    }
    #handleMove(chart, event) {
        const scope = this;
        if (scope.#annotationElement) {
            switch (event.type) {
                case 'mousemove':
                    return scope.#handleMouseMove(chart, event);
                default:
            }
        }
    }

    loadDataStore(singleLineData) {
        if (this.myChart.config._config.data.datasets.length === 0) { // chart is empty
            this.myChart.config._config.data = singleLineData;
        } else {
            let newDataSet = singleLineData.datasets[0];
            this.myChart.config._config.data.datasets.push(newDataSet);
        }
        this.myChart.update();
    }

    loadDataStoreWithPrevSettings(singleLineData, criteriaParams) {

        const oldDataset = find(this.myChart.config._config.data.datasets, item => item.id === criteriaParams.id);
        let oldDatasetIndex = -1;
        if (oldDataset) {
            oldDatasetIndex = findIndex(this.myChart.config._config.data.datasets, oldDataset);
        }

        if (oldDatasetIndex !== -1) {
            let meta = this.myChart.getDatasetMeta(oldDatasetIndex);
            this.myChart.config._config.data.datasets.splice(oldDatasetIndex, 1);
            let newDataSet = singleLineData.datasets[0];
            let length = this.myChart.config._config.data.datasets.push(newDataSet);
            this.myChart.setDatasetVisibility(length - 1, !meta.hidden);
            this.myChart.update();
        } else {
            const oldTitle = this.myChart.config.options.scales.y.title.text;
            if (oldTitle.trim().length === 0) {
                this.myChart.config.options.scales.y.title.text = criteriaParams["indicator_code"]?.name
            } else if(!oldTitle.includes( criteriaParams["indicator_code"]?.name)){
                this.myChart.config.options.scales.y.title.text = oldTitle + " / " + criteriaParams["indicator_code"]?.name
            }
            this.loadDataStore(singleLineData)
        }

    }

    cleanChart(){
        this.myChart.config._config.data.datasets = [];
        this.myChart.update();
    }

    scaleAfterDataLoaded(){
        const scope = this;
        if(!this.myChart){
            return;
        }
        const data = this.myChart.config._config.data;

        const nonNullFirstX = scope.#findMinXAxisIndex(data.datasets);
        const nonNullLastX = scope.#findMaxXAxisIndex(data.datasets);

        if (nonNullFirstX) {
            scope.myChart.config.options.scales.x.min = nonNullFirstX;
            scope.myChart.config.options.plugins.zoom.limits.x.min = nonNullFirstX;
        }

        if (nonNullLastX) {
            scope.myChart.config.options.scales.x.max = nonNullLastX;
            scope.myChart.config.options.plugins.zoom.limits.x.max = nonNullLastX;
        }

        scope.myChart.update();
    }

    clearDataStore(itemStoreId) {
        let indexToHide = -1;
        const dataset = find(this.myChart.config._config.data.datasets, item => item.id === itemStoreId);
        if (dataset) {
            indexToHide = findIndex(this.myChart.config._config.data.datasets, dataset);
        }

        if (indexToHide !== -1) {
            let meta = this.myChart.getDatasetMeta(indexToHide);
            const yTitle = meta.label.split(' - ')[2];
            const fullTitle = this.myChart.config.options.scales.y.title.text;
            if (fullTitle.includes(" / " + yTitle)) {
                this.myChart.config.options.scales.y.title.text = fullTitle.replaceAll(" / " + yTitle, '');
            }
            if (fullTitle.includes(yTitle + " / ")) {
                this.myChart.config.options.scales.y.title.text = fullTitle.replaceAll(yTitle + " / ", '');
            }
            remove(this.myChart.config._config.data.datasets, item => item.id === itemStoreId);
        }


        this.myChart.update();
    }

    hideShowChartLine(criteriaParams, value) {

        let indexToHide = -1;

        const dataset = find(this.myChart.config._config.data.datasets, item => item.id === criteriaParams.id);
        if (dataset) {
            indexToHide = findIndex(this.myChart.config._config.data.datasets, dataset);
        }

        if (indexToHide !== -1) {
            let meta = this.myChart.getDatasetMeta(indexToHide);
            meta.hidden = value;
            this.myChart.update();
        }
    }

    #handleMouseMove(chart, event) {
        const scope = this;
        if (!scope.#annotationElement) {
            return;
        }

        scope.#circleElement = IeecloudChartsEventRenderer.enter(scope.#annotationElement, event);

        if (scope.#circleElement && !chart.tooltip.circleElement ||
            scope.#circleElement && chart.tooltip.circleElement &&
            chart.tooltip.circleElement.eventData.id !== scope.#circleElement.eventData.id) {
            const tooltip = chart.tooltip;
            const elements = [{
                datasetIndex: 0,
                index: 0
            }];
            tooltip.setActiveElements(elements, event);
            tooltip.circleElement = scope.#circleElement;
        }

        if (!scope.#circleElement && chart.tooltip.circleElement) {
            const tooltip = chart.tooltip;
            tooltip.circleElement = null;
            tooltip.setActiveElements([]);
            chart.update();
        }

        return true;
    }
}
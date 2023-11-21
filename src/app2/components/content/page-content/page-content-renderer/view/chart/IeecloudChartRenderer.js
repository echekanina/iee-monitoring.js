import './styles/chart-monitoring.scss';
import {Chart, Tooltip} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import {v4 as uuidv4} from "uuid";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

import 'chartjs-adapter-date-fns';

import {ru} from 'date-fns/locale';
import {isEqual, isNull, max, min, remove} from "lodash-es";

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

    #singleLineMap = {};

    constructor(node, indicatorsElement) {
        this.#node = node;
        this.#indicatorsElement = indicatorsElement;
        this.#init();

    }


    generateTemplate() {
        this.#uuid = uuidv4();
        return `     <div class="col-md-6" id="chart-container-` + this.#node.id + `-indicator-` + this.#uuid + `">
     <div class="chart-container-1-` + this.#node.id + `-indicator-` + this.#uuid + `" style="position: relative; height:450px;  ">
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
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);

        // TODO:add common solution for all views
        const spinner = `<div style="position: absolute;left:40%;top:50%;z-index:1000; width:fit-content;" id="chart-spinner">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);
    }

    #findMaxXAxisIndex(datasets) {
        if (!datasets) {
            return -1;
        }
        const scope = this;
        if (datasets.length === 1) {
            return scope.#getIndexNonNullLast(datasets[0].data);
        } else if (datasets.length > 1) {
            let maxIndexApplicants = [];
            datasets.forEach(function (dataset) {
                maxIndexApplicants.push(scope.#getIndexNonNullLast(dataset.data));
            });
            return max(maxIndexApplicants);
        }
        return -1;
    }

    #findMinXAxisIndex(datasets) {
        const scope = this;
        if (!datasets) {
            return Infinity;
        }
        if (datasets.length === 1) {
            return scope.#getIndexNonNullFirst(datasets[0].data);
        } else if (datasets.length > 1) {
            let minIndexApplicants = [];
            datasets.forEach(function (dataset) {
                minIndexApplicants.push(scope.#getIndexNonNullFirst(dataset.data));
            });
            return min(minIndexApplicants);
        }

        return Infinity;
    }

    #getIndexNonNullLast(arr) {
        if (!arr || arr.length === 0) {
            return -1;
        }
        for (let i = arr.length - 1; i >= 0; i--) {
            if (!isNull(arr[i])) {
                return i;
            }
        }
        return -1;
    }

    #getIndexNonNullFirst(arr) {
        if (!arr || arr.length === 0) {
            return -1;
        }
        for (let i = 0; i < arr.length; i++) {
            if (!isNull(arr[i])) {
                return i;
            }
        }
        return -1;
    }

    #convertUnixTimeToHumanDateWitFormat(milliseconds, format) {
        const dateObject = new Date(milliseconds);
        moment.locale('ru');
        return moment(dateObject).format(format);
    }

    renderChart(data) {
        console.log(data);
        const scope = this;

        let spinnerContainer = document.querySelector("#chart-spinner");
        spinnerContainer?.remove();

        let titleY = '';
        let chartCode = '';
        let zoomLimit = 0;
        if (this.#indicatorsElement && this.#indicatorsElement.length > 0) {
            titleY = this.#indicatorsElement[0].title;
            chartCode = this.#indicatorsElement[0].code;
            zoomLimit = this.#indicatorsElement[0].zoomLimit;
        }

        Tooltip.positioners['lineAnnotation-' + chartCode] = function (elements, eventPosition) {
            const tooltip = this;
            if (scope.#annotationElement != null) {
                if (scope.#circleElement && !tooltip.circleElement ||
                    scope.#circleElement && tooltip.circleElement
                    && tooltip.circleElement.eventData.id !== scope.#circleElement.eventData.id) {
                    return scope.#circleElement.foundCoordinate ? scope.#circleElement.foundCoordinate
                        : scope.#annotationElement.getCenterPoint();
                }
            }
            return Tooltip.positioners.nearest.call(tooltip, elements, eventPosition);
        };

        // const nonNullLastIndex = scope.#findMaxXAxisIndex(data.datasets);
        // const nonNullFirstIndex = scope.#findMinXAxisIndex(data.datasets);

        const config = {
            uuid : scope.#uuid,
            type: 'line',
            plugins: [scope.#moverPlugin],
            // data: data,
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
                            scope.scaleAfterDefaultDataLoaded();
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
                        // min: isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined,
                        // max: nonNullLastIndex >= 0 ? data.labels[nonNullLastIndex] : undefined,
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
                                // min: isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined,
                                // max: nonNullLastIndex >= 0 ? data.labels[nonNullLastIndex] : undefined,
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
                        // text: data.title,
                        font: {
                            size: 20
                        }
                    },
                    tooltip: {
                        enabled: false,
                        position: 'lineAnnotation-' + chartCode,
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

        document.addEventListener('click', scope.#documentClickListener);
    }

    destroy() {
        if (this.myChart) {
            this.myChart.destroy();
        }
        this.#removeDomListeners();
    }

    clearEventStore(storeType) {
        const scope = this;
        if (scope.#htmlLegendPluginMap[storeType]) {
            Chart.unregister(scope.#htmlLegendPluginMap[storeType]);
        }
        const htmlLegendContainer = document.getElementById(
            scope.myChart.config.options.plugins['htmlLegend-' + storeType].containerID);
        if (htmlLegendContainer) {
            htmlLegendContainer.innerHTML = '';
        }

        for (let key in scope.#linesMap[storeType]) {
            delete scope.myChart.config.options.plugins.annotation.annotations[key];
        }
        scope.myChart.update();
    }


    loadEventStore(itemStore, eventsData) {
        const scope = this;

        const storeType = itemStore.store;

        let eventsForLegend = [];
        scope.#linesMap[storeType] = {};

        for (let i = 0; i < eventsData.length; i++) {
            scope.#linesMap[storeType]["line-" + storeType + "-" + i] = {
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

        scope.#htmlLegendPluginMap[storeType] = IeecloudChartsEventRenderer.createLegendByStoreType(storeType,
            eventsForLegend, itemStore);

        Chart.register(scope.#htmlLegendPluginMap[storeType]);

        let legendTemplate = `<div id="legend-container` + this.#node.id + `-indicator-` + this.#uuid + `-store-` + storeType + `"  class="chart-legend" style="padding-left: 2rem;"></div>`
        const chartContainer = document.querySelector("#chart-container-" +
            this.#node.id + "-indicator-" + this.#uuid);
        if (chartContainer) {
            chartContainer.insertAdjacentHTML('afterbegin', legendTemplate);
        }


        scope.myChart.config.options.plugins["htmlLegend-" + storeType] = {
            containerID: 'legend-container' + scope.#node.id + '-indicator-' + scope.#uuid + '-store-' + storeType,
        }
        for (let key in scope.#linesMap[storeType]) {
            scope.myChart.config.options.plugins.annotation.annotations[key] = scope.#linesMap[storeType][key]
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
        scope.myChart.setActiveElements([{datasetIndex: 0, index: 2}]);
        scope.myChart.tooltip.setActiveElements([], {x: 100, y: 100});
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
        scope.myChart.resetZoom();
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

    loadDataStore(itemStore, singleLineData) {
        if (this.myChart.config._config.data.datasets.length === 0) { // chart is empty
            this.myChart.config._config.data = singleLineData;
            this.myChart.config.options.plugins.title.text = singleLineData.title;
            this.myChart.config._config.data.datasets[0].label = itemStore.name;
        } else {
            let newDataSet = singleLineData.datasets[0];
            newDataSet.label =  itemStore.name;
            this.myChart.config._config.data.datasets.push(newDataSet);
        }

        this.#singleLineMap[itemStore.store] = singleLineData.datasets[0];
        this.myChart.update();
    }

    scaleAfterDefaultDataLoaded(){
        const scope = this;
        const data = this.myChart.config._config.data;
        const nonNullLastIndex = scope.#findMaxXAxisIndex(data.datasets);
        const nonNullFirstIndex = scope.#findMinXAxisIndex(data.datasets);

        scope.myChart.config.options.scales.x.min = isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined;
        scope.myChart.config.options.scales.x.max =  nonNullLastIndex >= 0 ? data.labels[nonNullLastIndex] : undefined;
        scope.myChart.config.options.plugins.zoom.limits.x.min  = isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined;
        scope.myChart.config.options.plugins.zoom.limits.x.max  =  nonNullLastIndex >= 0 ? data.labels[nonNullLastIndex] : undefined;
        scope.myChart.update();
    }

    clearDataStore(itemStore) {
        if (this.#singleLineMap[itemStore]) {
            remove(this.myChart.config._config.data.datasets, item => isEqual(item, this.#singleLineMap[itemStore]))
        }

        delete this.#singleLineMap[itemStore];
        this.myChart.update();
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
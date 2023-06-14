import './styles/chart-monitoring.scss';
import IeecloudChartService from "./IeecloudChartService";
import {Chart, Tooltip} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import {v4 as uuidv4} from "uuid";
import IeecloudAppUtils from "../../../../../main/utils/IeecloudAppUtils.js";

import 'chartjs-adapter-date-fns';

import {ru} from 'date-fns/locale';
import {isNull, max, min, uniqBy} from "lodash-es";

import annotationPlugin from 'chartjs-plugin-annotation';
import * as IeecloudChartsEventRenderer from "./IeecloudChartsEventCtxExtention.js";
import moment from "moment/moment.js";

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
        const scope = this;
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);

        const nodeProps = this.#node.properties;
        const chartService = new IeecloudChartService(nodeProps.dataService);

        // TODO:add common solution for all views
        const spinner = `<div style="position: absolute;left:40%;top:50%;z-index:1000; width:fit-content;" id="chart-spinner">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);

        chartService.readScheme(nodeProps, function (result) {
            chartService.readData(nodeProps, result.schema, result.filterUrlParams, scope.#indicatorsElement, function (data) {
                let spinnerContainer = document.querySelector("#chart-spinner");
                spinnerContainer?.remove();
                scope.#renderChart(data);
            });
        });
    }

    #findMaxXAxisIndex(datasets) {
        if (!datasets) {
            return -1;
        }
        const scope = this;
        if (datasets.length === 1) {
            return scope.#getIndexNonNullLast(datasets[0].data, datasets[0].data.length - 1);
        } else if (datasets.length > 1) {
            let maxIndexApplicants = [];
            datasets.forEach(function (dataset) {
                maxIndexApplicants.push(scope.#getIndexNonNullLast(dataset.data, dataset.data.length - 1));
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
            return scope.#getIndexNonNullFirst(datasets[0].data, 0);
        } else if (datasets.length > 1) {
            let minIndexApplicants = [];
            datasets.forEach(function (dataset) {
                minIndexApplicants.push(scope.#getIndexNonNullFirst(dataset.data, 0));
            });
            return min(minIndexApplicants);
        }

        return Infinity;
    }

    #getIndexNonNullLast(array, index) {
        let scope = this;
        if (!isNull(array[index])) {
            return index;
        } else {
            let newIndex = index - 1;
            if(newIndex >= 0){
                return scope.#getIndexNonNullLast(array, newIndex)
            }
        }
        return -1;
    }

    #getIndexNonNullFirst(array, index) {
        let scope = this;
        if (!isNull(array[index])) {
            return index;
        } else {
            let newIndex = index + 1;
            if (newIndex <= array.length - 1) {
                return scope.#getIndexNonNullFirst(array, newIndex)
            }
        }
        return Infinity;
    }

    #renderChart(data) {
        const scope = this;
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

        const nonNullLastIndex = scope.#findMaxXAxisIndex(data.datasets);
        const nonNullFirstIndex = scope.#findMinXAxisIndex(data.datasets);
        const config = {
            type: 'line',
            plugins: [scope.#moverPlugin],
            data: data,
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
                        min: isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined,
                        max: nonNullLastIndex >=0 ? data.labels[nonNullLastIndex] : undefined,
                        adapters: {
                            date: {
                                locale: ru,
                            },
                        },

                        time: {
                            unit: "week"
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
                                min: isFinite(nonNullFirstIndex) ? data.labels[nonNullFirstIndex] : undefined,
                                max: nonNullLastIndex >=0 ? data.labels[nonNullLastIndex] : undefined,
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
                        text: data.title,
                        font: {
                            size: 20
                        }
                    },
                    tooltip: {
                        position: 'lineAnnotation-' + chartCode,
                        callbacks: {
                            footer() {
                                if (scope.#annotationElement != null && scope.#circleElement!= null) {
                                    return scope.#circleElement.eventData.name;
                                }
                            }
                        }/*,
                        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']*/
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

    clearEventStore(storeEventType){
        const scope = this;
        if(scope.#htmlLegendPluginMap[storeEventType]){
            Chart.unregister(scope.#htmlLegendPluginMap[storeEventType]);
        }
        const htmlLegendContainer = document.querySelector("#" +
            scope.myChart.config.options.plugins['htmlLegend-' + storeEventType].containerID);
        if (htmlLegendContainer) {
            htmlLegendContainer.innerHTML = '';
        }

        for (let key in scope.#linesMap[storeEventType]) {
            delete scope.myChart.config.options.plugins.annotation.annotations[key];
        }
        scope.myChart.update();
    }


    loadEventStore(itemStore, eventsData){
        const scope = this;

        const storeEventType = itemStore.event;

        let eventsForLegend = [];
        scope.#linesMap[storeEventType] = {};

        for (let i = 0; i < eventsData.length; i++) {
            scope.#linesMap[storeEventType]["line-" + storeEventType + "-" + i] = {
                type: 'line',
                xMin: eventsData[i].time, // event data
                xMax:  eventsData[i].time,
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
                    content: IeecloudChartsEventRenderer.getCirclesByEvents(eventsData[i].events,  eventsData[i].time),
                    backgroundColor: 'transparent',
                    display: true,
                    padding : 0,
                    position: 'start'
                },
                borderDash: [2, 2],
                borderColor:  IeecloudChartsEventRenderer.CHART_COLORS.blue,
                borderWidth: 2,
            }

            eventsData[i].events.forEach(function(event){
                eventsForLegend.push(event);
            });


        }

        scope.#htmlLegendPluginMap[storeEventType] = {
            id: 'htmlLegend-' + storeEventType,
            afterUpdate(chart, args, options) {
                const ul = scope.#getOrCreateLegendList(chart, options.containerID);

                // Remove old legend items
                while (ul.firstChild) {
                    ul.firstChild.remove();
                }
                let items = [];
                eventsForLegend.forEach(function(event){
                    let item = { text : event.typeName + " ( " + itemStore.name + " ) ",  fillStyle : event.bgColor }
                    items.push(item);

                });

                let result = uniqBy(items, 'text');

                result.forEach(item => {
                    const li = document.createElement('li');
                    li.style.alignItems = 'center';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    // li.style.marginLeft = '10px';
                    li.style.marginTop = '5px';

                    li.onclick = () => {
                        // const {type} = chart.config;
                        // if (type === 'pie' || type === 'doughnut') {
                        //     // Pie and doughnut charts only have a single dataset and visibility is per item
                        //     chart.toggleDataVisibility(item.index);
                        // } else {
                        //     chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                        // }
                        // chart.update();
                    };

                    // Color box
                    const boxSpan = document.createElement('span');
                    boxSpan.style.background = item.fillStyle;
                    boxSpan.style.borderColor = item.strokeStyle;
                    boxSpan.style.borderWidth = item.lineWidth + 'px';
                    boxSpan.style.display = 'inline-block';
                    boxSpan.style.height = '20px';
                    boxSpan.style.marginRight = '10px';
                    boxSpan.style.width = '20px';

                    // Text
                    const textContainer = document.createElement('p');
                    textContainer.style.color = item.fontColor;
                    textContainer.style.margin = 0;
                    textContainer.style.padding = 0;
                    textContainer.style.font = "bold 12px serif";
                    textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                    const text = document.createTextNode(item.text);
                    textContainer.appendChild(text);

                    li.appendChild(boxSpan);
                    li.appendChild(textContainer);
                    ul.appendChild(li);
                });
            }
        };

        Chart.register(scope.#htmlLegendPluginMap[storeEventType]);

        let legendTemplate =  `<div id="legend-container` + this.#node.id + `-indicator-` + this.#uuid + `-store-` + storeEventType + `"  class="chart-legend" style="padding-left: 2rem;"></div>`
        const chartContainer = document.querySelector("#chart-container-" +
            this.#node.id + "-indicator-" + this.#uuid);
        if (chartContainer) {
            chartContainer.insertAdjacentHTML('afterbegin', legendTemplate);
        }


        scope.myChart.config.options.plugins["htmlLegend-" + storeEventType] = {
            containerID: 'legend-container' + scope.#node.id + '-indicator-' + scope.#uuid + '-store-' + storeEventType,
        }
        for(let key in scope.#linesMap[storeEventType]){
            scope.myChart.config.options.plugins.annotation.annotations[key] = scope.#linesMap[storeEventType][key]
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
        scope.myChart._lastEvent = null;
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
            const elements = chart.getElementsAtEventForMode(event, 'nearest', {}, true);
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

    #getOrCreateLegendList(chart, id) {
        const legendContainer = document.getElementById(id);
        let listContainer = legendContainer?.querySelector('ul');

        if (!listContainer) {
            listContainer = document.createElement('ul');
            // listContainer.style.display = 'flex';
            listContainer.style.flexDirection = 'row';
            listContainer.style.margin = 0;
            listContainer.style.padding = 0;

            legendContainer?.appendChild(listContainer);
        }

        return listContainer;
    }
}
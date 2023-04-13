import './styles/chart-monitoring.scss';
import IeecloudChartService from "./IeecloudChartService";
import {Chart, Tooltip} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import {v4 as uuidv4} from "uuid";
import IeecloudAppUtils from "../../../../../main/utils/IeecloudAppUtils.js";

import 'chartjs-adapter-date-fns';

import {ru} from 'date-fns/locale';
import {max, min} from "lodash-es";


Chart.register(zoomPlugin);
Chart.register(Tooltip);

export default class IeecloudChartRenderer {
    #node;
    #indicatorsElement;
    myChart;
    #uuid;

    constructor(node, indicatorsElement) {
        this.#node = node;
        this.#indicatorsElement = indicatorsElement;

    }


    generateTemplate() {
        this.#uuid = uuidv4();
        return `     <div class="col-md-6">

     <div class="chart-container-1-` + this.#node.id + `-indicator-` + this.#uuid + `" style="position: relative; height:450px;  ">
               <div class="chart-actions-area d-none" id="chart-actions-area-` + this.#uuid + `">
<div class="chart-zoom-top"><div class="chart-zoom-control">
<a  title="Увеличить" role="button" aria-label="Увеличить" id="chart-zoom-in-` + this.#uuid + `">+</a>
<a  title="Уменьшить" role="button" aria-label="Уменьшить" id="chart-zoom-out-` + this.#uuid + `">−</a>
<a  title="Cбросить" role="button" aria-label="Zoom out" id="chart-zoom-reset-` + this.#uuid + `"><i class="fas fa-undo fa-xs"></i></a>
</div></div></div>
                        <canvas id="canvas-1` + this.#node.id + `-indicator-` + this.#uuid + `""></canvas>
                    </div>
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
        if (array[index]) {
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
        if (array[index]) {
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
        let zoomLimit = 0;
        if (this.#indicatorsElement && this.#indicatorsElement.length > 0) {
            titleY = this.#indicatorsElement[0].title;
            zoomLimit = this.#indicatorsElement[0].zoomLimit;
        }
        const nonNullLastIndex = scope.#findMaxXAxisIndex(data.datasets);
        const nonNullFirstIndex = scope.#findMinXAxisIndex(data.datasets);
        const config = {
            type: 'line',
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
                            unit: "week",
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
                        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
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
}
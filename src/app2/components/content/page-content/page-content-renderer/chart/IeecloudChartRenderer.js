import IeecloudChartService from "./IeecloudChartService";
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import {v4 as uuidv4} from "uuid";

Chart.register(zoomPlugin);

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
        this.#uuid =  uuidv4();
        return `     <div class="col-md-6">
     <div class="chart-container-1-` + this.#node.id + `-indicator-` + this.#uuid + `" style="position: relative; height:450px;  ">
                        <canvas id="canvas-1` + this.#node.id +`-indicator-` +  this.#uuid + `""></canvas>
                    </div>
</div>`;
    }


    render(container) {
        const scope = this;
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);

        const nodeProps = this.#node.properties;
        const chartService = new IeecloudChartService(nodeProps.dataService);

        chartService.readScheme(nodeProps, function (result) {
            chartService.readData(nodeProps, result.schema, result.filterUrlParams, scope.#indicatorsElement,  function (data) {
                scope.#renderChart(data);
            });
        });
    }

    #renderChart(data) {
        const config = {
            type: 'line',
            data: data,
            options: {
                spanGaps: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Дата Измерения'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Наклон, угл. секунды'
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            scaleMode: 'y'
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'xy',
                            scaleMode: 'y'
                        }
                    },
                    title: {
                        display: true,
                        text: data.title,
                        font: {
                            size: 20
                        }
                    }
                }
            }
        };

        let ctx = document.getElementById("canvas-1" + this.#node.id +"-indicator-" + this.#uuid).getContext('2d');
        if(this.myChart) {
            this.myChart.destroy();
        }

        this.myChart = new Chart(
            ctx,
            config
        );

    }
}
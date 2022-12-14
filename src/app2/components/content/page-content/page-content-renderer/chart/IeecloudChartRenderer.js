import IeecloudChartService from "./IeecloudChartService";
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

export default class IeecloudChartRenderer {
    #node;
    #indicator;
    myChart;
    constructor(node, indicator) {
        this.#node = node;
        this.#indicator = indicator;

    }


    generateTemplate() {
        return `     <div class="col-md-6">
     <div class="chart-container-1-` + this.#node.id + `-indicator-` +  this.#indicator.code + `" style="position: relative; height:450px;  ">
                        <canvas id="canvas-1` + this.#node.id +`-indicator-` +  this.#indicator.code + `""></canvas>
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
            chartService.readData(nodeProps, result.schema, result.filterUrlParams, scope.#indicator,  function (data) {
                scope.#renderChart(data);
            });
        });
    }

    #renderChart(data) {
        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            overScaleMode: 'y'
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
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
                    }
                }
            }
        };

        let ctx = document.getElementById("canvas-1" + this.#node.id +"-indicator-" + this.#indicator.code).getContext('2d');
        if(this.myChart) {
            this.myChart.destroy();
        }

        this.myChart = new Chart(
            ctx,
            config
        );

    }
}
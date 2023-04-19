import * as Utils from "./example-utils.js";
import {BarController, Chart} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

import './../../styles/scss/sb-admin-2.scss'
Chart.register(zoomPlugin);
function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


docReady(function () {
    let newArr;
    let pointClickListener = (event, array) => {
        console.log("click")
        if(typeof newArr === 'undefined'){
            newArr = array;
        }

        // if (window.config === 'undefined' || window.config == null)
        // {
        //     return;
        // }
        if (event === 'undefined' || event == null)
        {
            return;
        }
        if (newArr === 'undefined' || newArr == null)
        {
            return;
        }
        if (newArr.length <= 0)
        {
            return;
        }
        var active = window.config.getElementAtEvent(event);
        if (active === 'undefined' || active == null || active.length === 0)
        {
            return;
        }

        var elementIndex = active[0]._datasetIndex;
        console.log("elementIndex: " + elementIndex + "; array length: " + newArr.length);

        if (newArr[elementIndex] === 'undefined' || newArr[elementIndex] == null){
            return;
        }

        var chartData = newArr[elementIndex]['_chart'].config.data;
        var idx = newArr[elementIndex]['_index'];

        var label = chartData.labels[idx];
        var value = chartData.datasets[elementIndex].data[idx];
        var series = chartData.datasets[elementIndex].label;

        alert(series + ':' + label + ':' + value);
    }


    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
    const NUMBER_CFG2 = {count: DATA_COUNT, min: 0, max: 0.9};

    const img = new Image(16, 16);
    img.src = 'https://i.stack.imgur.com/Q94Tt.png';



    const labels = Utils.months({count: 7});
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: Utils.numbers(NUMBER_CFG),
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
                yAxisID: 'y',
            },
            {
                label: 'Events',
                // data: Utils.numbers(NUMBER_CFG),
                data: Utils.numbersWithValue(NUMBER_CFG, 0),
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
                yAxisID: 'y1',
                pointStyle: img,
                borderWidth: 1
            },
            {
                label: 'Dataset 3',
                // data: Utils.numbers(NUMBER_CFG),
                data: Utils.numbers(NUMBER_CFG2),
                // data: Utils.numbersWithValue(NUMBER_CFG, 0.9),
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 1),
                type: 'dashedBorderBar',
                barThickness: 1,
                yAxisID: 'y1',
                dashedBorderColor: Utils.CHART_COLORS.blue,
                dashedBorderWidth: 1,
                borderDash: [10, 5],
                borderSkipped : 'right'
            }
        ]
    };

    console.log(data)


    const config = {
        type: 'line',
        data: data,
        options: {

            // animation: {
            //     onComplete: function (myChart) {
            //         if (myChart.initial) {
            //             console.log(myChart)
            //             myChart.chart.render();
            //         }
            //     }
            // },
            // onClick: (event, elements, chart) => {
            //     if (elements[0]) {
            //         const i = elements[0].index;
            //         console.log(elements[0])
            //         alert(chart.data.labels[i] + ': ' + chart.data.datasets[1].data[i]);
            //     }
            // },
            // onClick: pointClickListener,
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Chart.js Line Chart - Multi Axis'
                },
                zoom: {
                    limits: {
                        y1: {
                            min:-1,
                            max: 1,
                        }
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                        overScaleMode: 'y'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',

                    max: 1,
                    min: -1,
                    suggestedMax : 1,

                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            }
        },
    };

    let ctx = document.getElementById("event-chart-canvas")?.getContext('2d');

    if (ctx) {

        class DashedBorderBar extends BarController {
            draw() {
                super.draw(arguments);
                const ctx = this.chart.ctx;
                ctx.save();
                const dataset = this.chart.data.datasets[2];
                ctx.strokeStyle = dataset.dashedBorderColor;
                ctx.lineWidth = dataset.dashedBorderWidth;

                if(dataset.borderDash){
                    ctx.setLineDash(dataset.borderDash);
                    // console.log(this.getMeta().data)
                    this.getMeta().data.forEach(d => {
                        ctx.strokeRect(d.x - d.width / 2, d.y, d.width, d.height + ctx.lineWidth);
                    });
                    ctx.restore();
                }

            }
        }
        DashedBorderBar.id = 'dashedBorderBar';
        Chart.register(DashedBorderBar);



        let myChart = new Chart(
            ctx,
            config
        );
        setTimeout(function(){
            myChart.update('none');
        }, 50)

    }



});
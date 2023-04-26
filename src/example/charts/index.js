import * as Utils from "./example-utils.js";
import {BarController, Chart} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

import 'chartjs-adapter-date-fns';

import {ru} from 'date-fns/locale';

import './../../styles/scss/sb-admin-2.scss'
import {getCircles, getCirclesByEvents1, numbersWithValue1} from "./example-utils.js";
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);
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
        if (typeof newArr === 'undefined') {
            newArr = array;
        }

        // if (window.config === 'undefined' || window.config == null)
        // {
        //     return;
        // }
        if (event === 'undefined' || event == null) {
            return;
        }
        if (newArr === 'undefined' || newArr == null) {
            return;
        }
        if (newArr.length <= 0) {
            return;
        }
        var active = window.config.getElementAtEvent(event);
        if (active === 'undefined' || active == null || active.length === 0) {
            return;
        }

        var elementIndex = active[0]._datasetIndex;
        console.log("elementIndex: " + elementIndex + "; array length: " + newArr.length);

        if (newArr[elementIndex] === 'undefined' || newArr[elementIndex] == null) {
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


    let dataForEvents = Utils.numbersWithValue(NUMBER_CFG, 0.6);


    const labels = Utils.months({count: 7});
    console.log(labels)
    const data = {
        // labels: labels,
        labels: Utils.TIMES,
        datasets: [
            {
                label: 'Dataset 1',
                // data: Utils.numbers(NUMBER_CFG),
                data: Utils.DATA,
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
                yAxisID: 'y',
            },
            /* {
                 label: 'Events',
                 // data: Utils.numbers(NUMBER_CFG),
                 data: Utils.numbersWithValue({count: Utils.DATA.length, min: -100, max: 100}, 0),
                 borderColor: Utils.CHART_COLORS.black,
                 backgroundColor: Utils.transparentize(Utils.CHART_COLORS.black, 0.5),
                 yAxisID: 'y1',
                 // pointStyle: img,
                 pointStyle: 'circle',
                 borderWidth: 1
             },*/
            // {
            //     label: 'Dataset 3',
            //     // data: Utils.numbers(NUMBER_CFG),
            //     // data: Utils.numbers(NUMBER_CFG2),
            //     data: Utils.numbersWithValue({count: Utils.DATA.length, min: -100, max: 100}, 1),
            //     borderColor: Utils.CHART_COLORS.blue,
            //     backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            //     type: 'dashedBorderBar',
            //     barThickness: 0,
            //     yAxisID: 'y1',
            //     dashedBorderColor: Utils.CHART_COLORS.blue,
            //     dashedBorderWidth: 1,
            //     borderDash: [3, 3],
            //     borderSkipped : 'right'
            // }
        ]
    };

    console.log(data)

    const canvas123 = Utils.getCirclesByEvents([{
        name: 'Работы по замене перектырия',
        bgColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)'
    },
        {
            name: 'Проверка',
            bgColor:  Utils.CHART_COLORS.green,
            borderColor:  Utils.CHART_COLORS.green
        }]);


    // canvas123.addEventListener("click", (event) => {
    //     console.log(event)
    //     // Check whether point is inside circle
    // });

    // const plugin = {
    //     id: 'customer',
    //     afterEvent(chart, args, options) {
    //         const test = document.getElementById('canvasID');
    //         const elements = chart.getElementsAtEventForMode(args.event, 'nearest', { intersect: true }, false);
    //         // const elements = chart.getElementsAtEventForMode(args.event, 'nearest', { mode: 'point', axis: 'xy', intersect: true }, true);
    //        console.log(chart, args, options)
    //
    //         // test.addEventListener("click", (event) => {
    //         //     console.log(" canvas123.addEventListener(\"click\"", event)
    //         // });
    //     }
    // };

    const getOrCreateLegendList = (chart, id) => {
        const legendContainer = document.getElementById(id);
        let listContainer = legendContainer.querySelector('ul');

        if (!listContainer) {
            listContainer = document.createElement('ul');
            listContainer.style.display = 'flex';
            listContainer.style.flexDirection = 'row';
            listContainer.style.margin = 0;
            listContainer.style.padding = 0;

            legendContainer.appendChild(listContainer);
        }

        return listContainer;
    };

    const htmlLegendPlugin = {
        id: 'htmlLegend',
        afterUpdate(chart, args, options) {
            const ul = getOrCreateLegendList(chart, options.containerID);

            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }

            // Reuse the built-in legendItems generator
let items = [];
            const mockEvents = [{
                name: 'Работы по замене перектырия',
                bgColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)'
            },
                {
                    name: 'Проверка',
                    bgColor:  Utils.CHART_COLORS.green,
                    borderColor:  Utils.CHART_COLORS.green
                },
                {
                    name: 'Проверка3',
                    bgColor: Utils.CHART_COLORS.orange,
                    borderColor: Utils.CHART_COLORS.orange
                },
                {
                    name: 'Проверка4',
                    bgColor: Utils.CHART_COLORS.green,
                    borderColor: Utils.CHART_COLORS.green
                },
                {
                    name: 'Проверка5',
                    bgColor: Utils.CHART_COLORS.purple,
                    borderColor: Utils.CHART_COLORS.purple
                }]
            mockEvents.forEach(function(event){
                let item = { text : event.name,  fillStyle : event.bgColor }
                items.push(item);

            })
            // const items = chart.options.plugins.legend.labels.generateLabels(chart);

            items.forEach(item => {
                const li = document.createElement('li');
                li.style.alignItems = 'center';
                li.style.cursor = 'pointer';
                li.style.display = 'flex';
                li.style.flexDirection = 'row';
                li.style.marginLeft = '10px';

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
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        }
    };

    let ctx = document.getElementById("event-chart-canvas")?.getContext('2d');

    const config = {
        type: 'line',
        plugins: [htmlLegendPlugin],
        data: data,
        options: {

            //
            // animation: {
            //     onComplete: function (myChart) {
            //         if (myChart.initial) {
            //             console.log("COMPLETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!", myChart)
            //             // const test = document.getElementById('canvasID');
            //             // test.addEventListener("click", (event) => {
            //             //     console.log(" canvas123.addEventListener(\"click\"", event)
            //             // });
            //
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
                intersect: true,
            },
            stacked: false,
            plugins: {
                htmlLegend: {
                    // ID of the container to put the legend in
                    containerID: 'legend-container',
                },
                // legend: {
                //     display: false,
                // },
                // customer: {
                //     events: ['click']
                // },
                title: {
                    display: false,
                    text: 'Chart.js Line Chart - Multi Axis'
                },
                annotation: {
                    common: {
                        drawTime: 'beforeDraw'
                    },
                    // animations: {
                    //     numbers: {
                    //         properties: ['x', 'y', 'x2', 'y2', 'width', 'height', 'radius'],
                    //         type: 'number'
                    //     },
                    // },
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: 1627938000000, // event data
                            xMax: 1627938000000,
                            click: ({element}, event) => Utils.select(element, event),
                            label: {
                                content: Utils.getCirclesByEvents([{
                                    name: 'Работы по замене перектырия',
                                    bgColor: 'rgb(255, 99, 132)',
                                    borderColor: 'rgb(255, 99, 132)'
                                },
                                    {
                                        name: 'Проверка',
                                        bgColor:  Utils.CHART_COLORS.green,
                                        borderColor:  Utils.CHART_COLORS.green
                                    }], 1627938000000),
                                backgroundColor: 'transparent',
                                display: true,
                                width: '50%',
                                height: '50%',
                                position: 'start'/*,
                                rotation: 90*/
                            },
                            borderDash: [2, 2],
                            borderColor:  Utils.CHART_COLORS.blue,
                            borderWidth: 2,
                        },
                        line2: {
                            type: 'line',
                            xMin: 1621890000000, // event data
                            xMax: 1621890000000,
                            click: ({element}, event) => Utils.select(element, event),
                            label: {
                                content: Utils.getCirclesByEvents([{
                                    name: 'Работы по замене перектырия',
                                    bgColor: 'rgb(255, 99, 132)',
                                    borderColor: 'rgb(255, 99, 132)'
                                },
                                    {
                                        name: 'Проверка',
                                        bgColor: 'rgb(54, 162, 235)',
                                        borderColor: 'rgb(54, 162, 235)'
                                    },
                                    {
                                        name: 'Проверка3',
                                        bgColor: Utils.CHART_COLORS.orange,
                                        borderColor: Utils.CHART_COLORS.orange
                                    },
                                    {
                                        name: 'Проверка4',
                                        bgColor: Utils.CHART_COLORS.green,
                                        borderColor: Utils.CHART_COLORS.green
                                    },
                                    {
                                        name: 'Проверка5',
                                        bgColor: Utils.CHART_COLORS.purple,
                                        borderColor: Utils.CHART_COLORS.purple
                                    }/*,
                                    {
                                        name: 'Проверка6',
                                        bgColor: Utils.CHART_COLORS.grey,
                                        borderColor: Utils.CHART_COLORS.grey
                                    }*/], 1621890000000),
                                backgroundColor: 'transparent',
                                display: true,
                                width: '50%',
                                height: '50%',
                                position: 'start'/*,
                                rotation: 90*/
                            },
                            borderDash: [2, 2],
                            borderColor: Utils.CHART_COLORS.blue,
                            borderWidth: 2,
                        },
                        line3: {
                            type: 'line',
                            xMin: 1637010000000, // event data
                            xMax: 1637010000000,
                            click: ({element}, event) => Utils.select(element, event),
                            // enter: ({element}) => Utils.enter(element),
                            // leave: ({element}) => Utils.leave(element),
                            label: {
                                content: Utils.getCirclesByEvents([{
                                    name: 'Работы по замене перектырия',
                                    bgColor: 'rgb(255, 99, 132)',
                                    borderColor: 'rgb(255, 99, 132)'
                                },
                                    {
                                        name: 'Проверка',
                                        bgColor: 'rgb(54, 162, 235)',
                                        borderColor: 'rgb(54, 162, 235)'
                                    },
                                    {
                                        name: 'Проверка3',
                                        bgColor: Utils.CHART_COLORS.orange,
                                        borderColor: Utils.CHART_COLORS.orange
                                    },
                                    {
                                        name: 'Проверка4',
                                        bgColor: Utils.CHART_COLORS.green,
                                        borderColor: Utils.CHART_COLORS.green
                                    },
                                    {
                                        name: 'Проверка5',
                                        bgColor: Utils.CHART_COLORS.purple,
                                        borderColor: Utils.CHART_COLORS.purple
                                    },
                                    {
                                        name: 'Проверка6',
                                        bgColor: Utils.CHART_COLORS.grey,
                                        borderColor: Utils.CHART_COLORS.grey
                                    }], 1637010000000),
                                backgroundColor: 'transparent',
                                display: true,
                                width: '50%',
                                height: '50%',
                                position: 'start'
                            },
                            borderDash: [2, 2],
                            borderColor: Utils.CHART_COLORS.blue,
                            borderWidth: 2,
                        }
                    }
                },
                zoom: {
                    limits: {
                        y1: {
                            min: 0,
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
                        unit: "week"
                    },

                    title: {
                        display: true,
                        text: 'Дата Измерения'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                }/*,
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',

                    max: 1,
                    min: 0,
                    suggestedMax: 1,

                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },*/
            }
        },
    };



    if (ctx) {

        class DashedBorderBar extends BarController {
            draw() {
                super.draw(arguments);
                const ctx = this.chart.ctx;
                ctx.save();
                const dataset = this.chart.data.datasets[1];
                ctx.strokeStyle = dataset.dashedBorderColor;
                ctx.lineWidth = dataset.dashedBorderWidth;

                if (dataset.borderDash) {
                    const meta = this.getMeta();
                    const pt0 = meta.data[0];
                    const {radius} = pt0.options;
                    console.log("radius", radius)
                    ctx.setLineDash(dataset.borderDash);
                    // console.log(this.getMeta().data)
                    meta.data.forEach(d => {
                        ctx.strokeRect(d.x - d.width / 2, d.y, d.width, d.height + ctx.lineWidth);

                        // ctx.textAlign = 'center';
                        // ctx.fillText("Работы по замене перектырия", d.x - d.width / 2 , d.y  - 10);
                        console.log(d.y, d.height)
                        // ctx.fillText("Y", d.x - d.width / 2 , d.y +  d.height - 10);
                        // ctx.arc(d.x, d.y  + 30 , 3, 0, 2 * Math.PI);
                        // ctx.fill();
                        // ctx.fillText("Работы по замене перектырия", d.x - d.width / 2 , 0);
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
        setTimeout(function () {
            myChart.update('none');
        }, 50)

    }


});
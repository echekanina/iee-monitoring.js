import {Modal} from "bootstrap";
import moment from "moment/moment.js";
import {toFont, isObject} from 'chart.js/helpers';
import {uniqBy} from "lodash-es";

const numberOrZero = (v) => +v || 0;

const deltaBtwCircles = 3;
const bigRadius  =12;
const smallRadius  = 8;

export const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    black: 'rgb(0,0,0)',
    lightgreen: 'rgb(146,181,151)'
};

export function enter(element, event) {
    const labelSize = getLabelSize(element.label);
    const smallCanvas = element.label.options.content;
    const ctx = smallCanvas.getContext('2d');

    const mouseX1 = event.native.offsetX;
    const mouseY1 = event.native.offsetY;

    const x = mouseX1 - labelSize.x;
    const y = mouseY1 - labelSize.y;

    const foundCircleEvent = smallCanvas.eventCircles.find(eventCircle => ctx.isPointInPath(eventCircle.eventPath, x
        , y));

    if (foundCircleEvent) {

        foundCircleEvent.foundCoordinate = {
            x: foundCircleEvent.centerCoordinate.centerX + labelSize.x,
            y: foundCircleEvent.centerCoordinate.centerY + labelSize.y
        };
    }

    return foundCircleEvent;
}

function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

function readValueToProps(value, props) {
    const ret = {};
    const objProps = isObject(props);
    const keys = objProps ? Object.keys(props) : props;
    const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
    for (const prop of keys) {
        ret[prop] = numberOrZero(read(prop));
    }
    return ret;
}

function toTRBL(value) {
    return readValueToProps(value, {
        top: 'y',
        right: 'x',
        bottom: 'y',
        left: 'x'
    });
}

function  getOrCreateLegendList(chart, id) {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer?.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;

        legendContainer?.appendChild(listContainer);
    }

    return listContainer;
}

function getOrCreateTooltip(chart) {
    let tooltipEl = document.querySelector("#custom-chart-tooltip-" + chart.config._config.uuid);

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.setAttribute("id", "custom-chart-tooltip-" + chart.config._config.uuid);
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.zIndex = 1000;

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
}

function toPadding(value) {
    const obj = toTRBL(value);
    obj.width = obj.left + obj.right;
    obj.height = obj.top + obj.bottom;
    return obj;
}

function getLabelSize({x, y, width, height, options}) {
    const hBorderWidth = options.borderWidth / 2;
    const padding = toPadding(options.padding);
    return {
        x: x + padding.left + hBorderWidth,
        y: y + padding.top + hBorderWidth,
        width: width - padding.left - padding.right - options.borderWidth,
        height: height - padding.top - padding.bottom - options.borderWidth
    };
}

export function selectEvent(element, event) {
    const labelSize = getLabelSize(element.label);
    const smallCanvas = element.label.options.content;
    const ctx = smallCanvas.getContext('2d');

    const mouseX1 = event.native.offsetX;
    const mouseY1 = event.native.offsetY;

    const x = mouseX1 - labelSize.x;
    const y = mouseY1 - labelSize.y;

    const foundCircleEvent = smallCanvas.eventCircles.find(eventCircle => ctx.isPointInPath(eventCircle.eventPath, x
        , y));

    const modalElement = document.getElementById('eventChartModal');

    const dateObject = new Date(element.label.options.content.time)
    const timeStr = moment(dateObject).format('DD.MM.YYYY HH:mm');
    const eventTime = document.getElementById('event-time');
    eventTime.innerText = timeStr;

    const eventContainer = document.getElementById('event-container');

    eventContainer.innerHTML = '';

    const eventItem = foundCircleEvent.eventData;

    if (isObject(eventItem)) {
        const textContainer = document.createElement('p');
        textContainer.style.color = eventItem.fontColor;
        textContainer.style.margin = 0;
        textContainer.style.padding = 0;

        const text = document.createTextNode(eventItem.name);
        textContainer.appendChild(text);

        eventContainer?.appendChild(textContainer);
    } else if (Array.isArray(eventItem)) {
        const ul = document.createElement('ul');
        eventItem.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';


            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.background = item.bgColor;
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

            const text = document.createTextNode(item.name);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });

        eventContainer?.appendChild(ul);
    }
    let pageContentModal = new Modal(modalElement, {
        backdrop: false
    })
    pageContentModal.show();

    return true;
}

export function getCirclesByEvents(events, time) {
    const canvas = document.createElement('canvas');
    canvas.width = events.length <= 5 ? smallRadius * 2 : bigRadius * 2;
    canvas.height = events.length <= 5 ? events.length * ((smallRadius + deltaBtwCircles) * 2) : (bigRadius + deltaBtwCircles) * 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ctx = canvas.getContext('2d');
    let eventCircles = []
    if (events.length <= 5) {
        for (let k = 0; k < events.length; k++) {
            const event = events[k];
            ctx.strokeStyle = event.borderColor;
            ctx.fillStyle = event.bgColor;
            ctx.beginPath();

            let radius = smallRadius; // Arc radius
            let startAngle = 0; // Starting point on circle
            let endAngle = 2 * Math.PI; // End point on circle
            const GAP = radius + deltaBtwCircles;

            let y = canvas.height - GAP - k * (2 * GAP); // y coordinate

            const circle = new Path2D();
            circle.arc(centerX, y, radius, startAngle, endAngle);
            ctx.fill(circle);

            // eventCircles.push(circle);
            event.time = time;
            eventCircles.push({eventData: event, eventPath: circle, centerCoordinate: {centerX: centerX, centerY: y}});
        }
    } else {
        ctx.strokeStyle = 'rgb(146,181,151)';
        ctx.fillStyle = 'rgb(146,181,151)';
        ctx.beginPath();

        let startAngle = 0; // Starting point on circle
        let endAngle = 2 * Math.PI; // End point on circle
        const GAP = bigRadius + deltaBtwCircles;
        let y = canvas.height - GAP; // y coordinate
        const circle = new Path2D();

        circle.arc(centerX, y, bigRadius, startAngle, endAngle);
        ctx.fill(circle);
        events.time = time;
        eventCircles.push({eventData: events, eventPath: circle, centerCoordinate: {centerX: centerX, centerY: y}});

        ctx.beginPath();
        ctx.font = "bold " + bigRadius + "px serif";
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = 'rgb(0,0,0)';
        const text = events.length;
        const measureText = ctx.measureText(text);
        let actualHeight = measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent;
        ctx.fillText(text, centerX - measureText.width/2, centerY + actualHeight/2)
    }


    ctx.stroke();

    canvas.data = events;
    canvas.time = time;
    canvas.eventCircles = eventCircles;


    return canvas;
}

export function externalTooltipHandler(context) {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);

    const active = tooltip._active;
    if (!active.length) {
        if (tooltip.opacity === 0 && !tooltip.circleElement) {
            tooltipEl.style.opacity = 0;
            return;
        }
    }

    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        let bodyLines = [];

        if (tooltip.circleElement) {
            const eventItem = tooltip.circleElement.eventData;

            if (isObject(eventItem)) {
                bodyLines.push([tooltip.circleElement.eventData.name]);
            } else if (Array.isArray(eventItem)) {
                eventItem.forEach(function (item) {
                    bodyLines.push([item.name]);
                })
            }


        } else {
            bodyLines = tooltip.body.map(b => b.lines);
        }
        let tableHead = document.createElement('thead');
        tableHead.style.whiteSpace = 'nowrap';
        titleLines.forEach(title => {
            const tr = document.createElement('tr');
            tr.style.borderWidth = 0;

            const th = document.createElement('th');
            th.style.borderWidth = 0;
            const text = document.createTextNode(title);

            th.appendChild(text);
            tr.appendChild(th);
            tableHead.appendChild(tr);
        });


        let tableBody = document.createElement('tbody');
        tableBody.style.whiteSpace = 'nowrap';
        bodyLines.forEach((body, i) => {
            const colors = tooltip.labelColors[i];
            const span = document.createElement('span');

            if (!tooltip.circleElement) {
                span.style.background = colors.backgroundColor;
                span.style.borderColor = colors.borderColor;
                span.style.borderWidth = '2px';
                span.style.marginRight = '10px';
                span.style.height = '10px';
                span.style.width = '10px';
                span.style.display = 'inline-block';
            } else {
                const eventItem = tooltip.circleElement.eventData;
                if (isObject(eventItem)) {
                    span.style.background = tooltip.circleElement.eventData.bgColor;
                    span.style.borderColor = tooltip.circleElement.eventData.borderColor;
                    span.style.borderWidth = '2px';
                    span.style.marginRight = '10px';
                    span.style.height = '10px';
                    span.style.width = '10px';
                    span.style.display = 'inline-block';
                }

            }

            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.borderWidth = 0;

            const tr2 = document.createElement('tr');
            tr2.style.backgroundColor = 'inherit';
            tr2.style.borderWidth = 0;

            const td = document.createElement('td');
            td.style.borderWidth = 0;

            const td2 = document.createElement('td');
            td2.style.borderWidth = 0;

            const text = document.createTextNode(body);
            td.appendChild(span);
            td.appendChild(text);
            if (tooltip.circleElement) {
                const eventItem = tooltip.circleElement.eventData;
                const imageUrl = tooltip.circleElement.eventData.imageUrl;
                if (isObject(eventItem) && imageUrl) {
                    let img = document.createElement('img');
                    img.src = tooltip.circleElement.eventData.imageUrl;
                    td2.appendChild(img);
                }

            }


            tr.appendChild(td);
            tr2.appendChild(td2);
            tableBody.appendChild(tr);
            tableBody.appendChild(tr2);
        });

        const tableRoot = tooltipEl.querySelector('table');

        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    const bodyFont = toFont(tooltip.options.bodyFont);

    tooltipEl.style.font = bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
}

export function setColorToCanvas(uuid, color) {
    return {
        id: 'backgroundCanvas-' + uuid,
        afterRender: function (chart) {
            let ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }
}
export function createLegendByStoreType(type, eventsForLegend, itemStore) {
    return {
        id: 'htmlLegend-' + type,
        afterUpdate(chart, args, options) {
            const ul = getOrCreateLegendList(chart, options.containerID);

            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            let items = [];
            eventsForLegend.forEach(function (event) {
                let item = {text: event.typeName + " ( " + itemStore.name + " ) ", fillStyle: event.bgColor}
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
    }
}

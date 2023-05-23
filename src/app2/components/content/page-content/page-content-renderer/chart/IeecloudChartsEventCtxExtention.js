import {Modal} from "bootstrap";
import moment from "moment/moment.js";

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
    black: 'rgb(0,0,0)'
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

function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
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

    if(isObject(eventItem)){
        const textContainer = document.createElement('p');
        textContainer.style.color = eventItem.fontColor;
        textContainer.style.margin = 0;
        textContainer.style.padding = 0;

        const text = document.createTextNode(eventItem.name);
        textContainer.appendChild(text);

        eventContainer?.appendChild(textContainer);
    }else if(Array.isArray(eventItem)){
        console.log("list of events")
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
    let pageContentModal = new Modal(modalElement)
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

        eventCircles.push({eventData: events, eventPath: circle, centerCoordinate: {centerX: centerX, centerY: y}});

        ctx.beginPath();
        ctx.font = "bold 25px serif";
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = 'rgb(0,0,0)';

        ctx.fillText(events.length, centerX - 8, centerY + 8)
    }


    ctx.stroke();

    canvas.data = events;
    canvas.time = time;
    canvas.eventCircles = eventCircles;


    return canvas;
}

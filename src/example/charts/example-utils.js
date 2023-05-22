import colorLib from "@kurkle/color";
import {Modal} from "bootstrap";
import moment from "moment/moment.js";
// import {toPadding} from "chart.js-helpers";

// let eventCircles = [];
const deltaBtwCircles = 8;
const bigRadius  =25;
const smallRadius  = 20;
const numberOrZero = (v)=>+v || 0;
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const TIMES = [
    1605474000000, 1605517200000, 1606078800000, 1607893200000, 1608498000000, 1609102800000, 1610917200000, 1612126800000, 1613336400000, 1614546000000, 1615755600000, 1616965200000, 1618174800000, 1619470800000, 1620680400000, 1621285200000, 1621890000000, 1623704400000, 1624914000000, 1625259600000, 1626123600000, 1627246800000, 1627938000000, 1629752400000, 1631653200000, 1632776400000, 1634590800000, 1635800400000, 1637010000000, 1663837200000, 1666256400000, 1666861200000, 1667293200000, 1667984400000, 1668589200000, 1670317200000, 1678179600000, 1679216400000
]

export const DATA = [
    0.003, null, 0, 0.001, -0.007, -0.005, -0.009000000000000001, -0.009000000000000001, -0.005, -0.01, -0.009000000000000001, -0.01, -0.01, -0.006, -0.01, null, -0.012, -0.012, -0.015, -0.012, -0.008, -0.016, -0.012, -0.012, -0.016, -0.018000000000000002, -0.008, -0.01, -0.008, null, null, null, null, null, null, null, null, null
]
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

let _seed = Date.now();

export function months(config) {
    let cfg = config || {};
    let count = cfg.count || 12;
    let section = cfg.section;
    let values = [];
    let i, value;

    for (i = 0; i < count; ++i) {
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
    }

    return values;
}

export function transparentize(value, opacity) {
    let alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
}

function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

export function numbers(config) {
    let cfg = config || {};
    let min = valueOrDefault(cfg.min, 0);
    let max = valueOrDefault(cfg.max, 100);
    let from = valueOrDefault(cfg.from, []);
    let count = valueOrDefault(cfg.count, 8);
    let decimals = valueOrDefault(cfg.decimals, 8);
    let continuity = valueOrDefault(cfg.continuity, 1);
    let dfactor = Math.pow(10, decimals) || 0;
    let data = [];
    let i, value;

    for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + this.rand(min, max);
        if (this.rand() <= continuity) {
            data.push(Math.round(dfactor * value) / dfactor);
        } else {
            data.push(null);
        }
    }

    return data;
}

export function numbersWithValue(config, number) {
    let cfg = config || {};
    let count = valueOrDefault(cfg.count, 8);
    let data = [];
    let i, value;

    for (i = 0; i < count; ++i) {
        value = number;
        data.push(value);
    }

    return data;
}

export function numbersWithValue1(config, number) {
    let cfg = config || {};
    let count = valueOrDefault(cfg.count, 8);
    let data = [];
    let i, value;

    for (i = 0; i < count; ++i) {
        value = number;
        // data.push(value);
        data.push({text: 'ts', value: value});
    }

    return data;
}

export function getHouse() {
    const canvas = document.createElement('canvas');
    canvas.width = 230;
    canvas.height = 210;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#666';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 10;
    ctx.strokeRect(40, 90, 150, 110);
    ctx.fillRect(95, 140, 40, 60);
    ctx.beginPath();
    ctx.moveTo(15, 90);
    ctx.lineTo(115, 10);
    ctx.lineTo(215, 90);
    ctx.closePath();
    ctx.stroke();
    return canvas;
}

export function getSpiral() {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ctx = canvas.getContext('2d');
    ctx.moveTo(centerX, centerY);
    ctx.beginPath();
    for (let i = 0; i < 720; i++) {
        const angle = 0.1 * i;
        const x = centerX + angle * Math.cos(angle);
        const y = centerX + angle * Math.sin(angle);
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#666";
    ctx.stroke();
    return canvas;
}
export function getCirclesByEvents(events, time) {
    const canvas = document.createElement('canvas');
    canvas.width = events.length <= 5 ? smallRadius * 2 : bigRadius * 2;
    canvas.height =  events.length <= 5 ? events.length * ((smallRadius + deltaBtwCircles) * 2) : (bigRadius + deltaBtwCircles) * 2;
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
            eventCircles.push({eventData : event, eventPath: circle, centerCoordinate: {centerX : centerX, centerY : y}});
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

        // eventCircles.push(circle);

        eventCircles.push({eventData : events, eventPath: circle, centerCoordinate: {centerX : centerX, centerY : y}});

        ctx.beginPath();
        ctx.font = "bold 25px serif";
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = 'rgb(0,0,0)';

        ctx.fillText(events.length, centerX - 8 , centerY + 8)
    }


    ctx.stroke();

    canvas.data = events;
    canvas.time = time;
    canvas.eventCircles = eventCircles;


    return canvas;
}


export function enter(element, event) {
    const labelSize = getLabelSize(element.label);
    const smallCanvas = element.label.options.content;
    const ctx = smallCanvas.getContext('2d');

    const mouseX1 = event.native.offsetX;
    const mouseY1 = event.native.offsetY;

    const x = mouseX1 - labelSize.x;
    const y = mouseY1 - labelSize.y;

    const foundCircleEvent = smallCanvas.eventCircles.find(eventCircle =>  ctx.isPointInPath(eventCircle.eventPath,   x
        ,y ));

    if(foundCircleEvent){

        foundCircleEvent.foundCoordinate = {x: foundCircleEvent.centerCoordinate.centerX + labelSize.x,
            y: foundCircleEvent.centerCoordinate.centerY + labelSize.y};
    }

    return foundCircleEvent;
}

export function leave(element) {
    console.log(element + ' leave');
}

// export function select(element, event) {
//     // console.log(element.label.options.content , ' selected', element);
//     // console.log(element.label.options.content.data , 'ctx selected', element.options);
//     const ctx =  element.label.options.content.getContext('2d');
//     // const ctx2 =  element.options.content.getContext('2d');
//     const mouseX = event.x;
//     const mouseY = event.y;
//     // console.log("mouseXmouseY", mouseX, mouseY, eventCircles, ctx2);
//     // console.log(element, "element", event);
//
//
//     // const dialog = document.getElementById("eventDialog");
//     // dialog?.showModal();
//     const modalElement = document.getElementById('exampleModal');
//     const eventsList = document.getElementById('events-list');
//     const eventTime = document.getElementById('event-time');
//
//
//
//
//     const dateObject = new Date(element.label.options.content.time)
//     const timeStr = moment(dateObject).format( 'DD.MM.YYYY HH:mm');
//
//     // console.log(element.label.options.content.time, timeStr)
//
//     eventTime.innerText = timeStr;
//
//     while (eventsList.firstChild) {
//         eventsList.firstChild.remove();
//     }
//
//     element.label.options.content.data.forEach(item => {
//         const li = document.createElement('li');
//         li.style.alignItems = 'center';
//         li.style.cursor = 'pointer';
//         li.style.display = 'flex';
//         li.style.flexDirection = 'row';
//         li.style.marginLeft = '10px';
//
//
//         // Color box
//         const boxSpan = document.createElement('span');
//         boxSpan.style.background = item.bgColor;
//         boxSpan.style.borderColor = item.strokeStyle;
//         boxSpan.style.borderWidth = item.lineWidth + 'px';
//         boxSpan.style.display = 'inline-block';
//         boxSpan.style.height = '20px';
//         boxSpan.style.marginRight = '10px';
//         boxSpan.style.width = '20px';
//
//         // Text
//         const textContainer = document.createElement('p');
//         textContainer.style.color = item.fontColor;
//         textContainer.style.margin = 0;
//         textContainer.style.padding = 0;
//         textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
//
//         const text = document.createTextNode(item.name);
//         textContainer.appendChild(text);
//
//         li.appendChild(boxSpan);
//         li.appendChild(textContainer);
//         eventsList.appendChild(li);
//     });
//
//
//     let pageContentModal = new Modal(modalElement)
//     pageContentModal.show();
//
//
//
//     return true;
// }

function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}
function readValueToProps(value, props) {
    const ret = {};
    const objProps = isObject(props);
    const keys = objProps ? Object.keys(props) : props;
    const read = isObject(value) ? objProps ? (prop)=>valueOrDefault(value[prop], value[props[prop]]) : (prop)=>value[prop] : ()=>value;
    for (const prop of keys){
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
export function select2(element, event) {
    const labelSize = getLabelSize(element.label);
    const smallCanvas = element.label.options.content;
    const ctx = smallCanvas.getContext('2d');

    const mouseX1 = event.native.offsetX;
    const mouseY1 = event.native.offsetY;

    const x = mouseX1 - labelSize.x;
    const y = mouseY1 - labelSize.y;

    const foundCircleEvent = smallCanvas.eventCircles.find(eventCircle =>  ctx.isPointInPath(eventCircle.eventPath,   x
        ,y ));


    console.log("ssss", foundCircleEvent)

    return true;
}
export function getCircles(events) {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ctx = canvas.getContext('2d');
    // ctx.moveTo(centerX, centerY);
    // ctx.strokeStyle =  'rgb(255, 99, 132)' // border pink
    // ctx.fillStyle = 'rgb(255, 99, 132)' /color
    ctx.strokeStyle = 'rgb(54, 162, 235)'
    ctx.fillStyle = 'rgb(54, 162, 235)'
    // ctx.strokeStyle = 'rgb(255, 205, 86)'
    // ctx.fillStyle =  'rgb(255, 205, 86)'
    ctx.beginPath();
    for (let k = 0; k <= events.length; i++) {

    }
    // for (let i = 0; i <= 3; i++) {
    //     for (let j = 0; j <= 2; j++) {
    let i = 3;
    let j = 2;
    // ctx.beginPath();
    let radius = 30; // Arc radius
    let startAngle = 0; // Starting point on circle
    let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
    let counterclockwise = i % 2 === 1; // Draw counterclockwise

    ctx.arc(centerX, centerY + radius + 13, radius, 0, 2 * Math.PI, counterclockwise);
    ctx.fill();
    //     }
    // }
    // ctx.strokeStyle = "#666";
    ctx.stroke();
    return canvas;
}

export function rand(min, max) {
    min = valueOrDefault(min, 0);
    max = valueOrDefault(max, 0);
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
}
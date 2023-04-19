import colorLib from "@kurkle/color";

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

export const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
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

export function rand(min, max) {
    min = valueOrDefault(min, 0);
    max = valueOrDefault(max, 0);
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
}
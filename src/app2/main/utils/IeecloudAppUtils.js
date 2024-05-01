import moment from "moment/moment.js";

export default class IeecloudAppUtils {


    static {
        this.ramdomSaturatedColorList = this.generateColorList();
    }

    static generateColorList() {
        let result = [];
        for (let i = 1; i <= 1024; i++) {
            const colorHex = this.getUniqueColor(i);
            result.push(colorHex);
        }
        return result;
    }

    static isMobileDevice() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    static convertUnixTimeToHumanDateWitFormat(unixTime, local, format) {
        const unixTimestamp = parseInt(unixTime)
        const milliseconds = unixTimestamp * 1000 // 1575909015000
        const dateObject = new Date(milliseconds);
        const momentDate = moment(dateObject);
        return momentDate.isValid() ? moment(dateObject).format(format) : '';
    }

    static dynamicColors() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    static randomColor() {
        let result;
        let count = 0;
        for (let i = 0; i <= this.ramdomSaturatedColorList.length; i++) {
            if (Math.random() < 1 / ++count) {
                result = this.ramdomSaturatedColorList[i];
            }


        }
        return result;
    }

    static getUniqueColor(n) {
        const rgb = [0, 0, 0];

        for (let i = 0; i < 24; i++) {
            rgb[i % 3] <<= 1;
            rgb[i % 3] |= n & 0x01;
            n >>= 1;
        }

        return '#' + rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '')
    }


    static parseJsonWithMoment(json) {
        let parse = JSON.parse;
        const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        return parse(json, function (key, value) {
            let parsedValue = value;
            if (typeof value === 'string') {
                let a = reISO.exec(value);
                if (a) {
                    parsedValue = moment(value);
                }
            }
            return parsedValue;
        });
    }

    static parseHashParams(locationHash) {
        const params = {};
        locationHash.split('?').forEach(function (item) {
            const parts = item.split('=');
            params[parts[0]] = decodeURIComponent(parts[1]);
        });
        return params;
    }

    static parseHashApp(locationHash) {
        let regExpr = /\/([^\/?]+)\/?/;
        const result = locationHash.match(regExpr);
        return result ? result[1] : '';
    }

    static isOnlyProjectInHash(locationHash) {
        let regExpr = /\/([^\/?]+)\/?/;
        return locationHash.split(regExpr)[locationHash.split(regExpr).length - 1]?.trim().length === 0
    }

    static parseSPAAppName(locationHash) {
        let regExpr = /\/([^\/?]+)\/?/;
        const tail = locationHash.split(regExpr)[locationHash.split(regExpr).length - 1]?.trim();
        return tail.split('?')[0];
    }

    static isRoot(locationHash) {
        let regExpr = /\/([^\/?]+)\/?/;
        return !(locationHash.match(regExpr) && locationHash.match(regExpr).length >= 1)
    }

    /**
     * Adds query params to existing URLs (inc merging duplicates)
     * @param {string} url - src URL to modify
     * @param {object} params - key/value object of params to add
     * @returns {string} modified URL
     */
    static addQueryParamsToUrl(url, params) {

        // if URL is relative, we'll need to add a fake base
        let fakeBase = !url.startsWith('http') ? 'http://fake-base.com' : undefined;
        let modifiedUrl = new URL(url || '', fakeBase);

        // add/update params
        Object.keys(params).forEach(function (key) {
            if (modifiedUrl.searchParams.has(key)) {
                modifiedUrl.searchParams.set(key, params[key]);
            } else {
                modifiedUrl.searchParams.append(key, params[key]);
            }
        });

        // return as string (remove fake base if present)
        return modifiedUrl.toString().replace(fakeBase, '');
    }

}
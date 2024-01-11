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
        const dateObject = new Date(milliseconds)
        return moment(dateObject).format(format);
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

}
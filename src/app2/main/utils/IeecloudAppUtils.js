import moment from "moment/moment.js";

export default class IeecloudAppUtils {
    static isMobileDevice() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    static convertUnixTimeToHumanDateWitFormat(unixTime, local, format) {
        const unixTimestamp = parseInt(unixTime)
        const milliseconds = unixTimestamp * 1000 // 1575909015000
        const dateObject = new Date(milliseconds)
        return moment(dateObject).format(format);
    }
}
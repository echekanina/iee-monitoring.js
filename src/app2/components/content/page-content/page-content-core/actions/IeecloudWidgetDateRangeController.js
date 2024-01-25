import moment from "moment/moment.js";
import "../../../../../main/common/external/vanilla-datetimerange-picker.css";
import {DateRangePicker} from "../../../../../main/common/external/vanilla-datetimerange-picker.js";
import EventDispatcher from "../../../../../main/events/EventDispatcher.js";

export default class IeecloudWidgetDateRangeController extends EventDispatcher {
    #widgetBodyController;

    constructor(widgetBodyController) {
        super();
        this.#widgetBodyController = widgetBodyController;
    }

    init(inputId) {
        const scope = this;
        const callBack = function (start, end) {
            let spanElement = document.querySelector('#' + inputId + ' span');
            if (spanElement) {
                spanElement.innerHTML = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
            }
        }
        const dateRangePicker = new DateRangePicker(inputId,
            {
                //startDate: '2000-01-01',
                //endDate: '2000-01-03',
                //minDate: '2021-07-15 15:00',
                //maxDate: '2021-08-16 15:00',
                //maxSpan: { "days": 9 },
                //showDropdowns: true,
                //minYear: 2020,
                //maxYear: 2022,
                //showWeekNumbers: true,
                //showISOWeekNumbers: true,
                timePicker: true,
                //timePickerIncrement: 10,
                //timePicker24Hour: true,
                //timePickerSeconds: true,
                showCustomRangeLabel: false,
                alwaysShowCalendars: true,
                opens: 'center',
                //drops: 'up',
                // singleDatePicker: true,
                //autoApply: true,
                //linkedCalendars: false,
                //isInvalidDate: function(m){
                //    return m.weekday() == 3;
                //},
                //isCustomDate: function(m){
                //    return "weekday-" + m.weekday();
                //},
                //autoUpdateInput: false,
                ranges: {
                    'Сегодня': [moment().startOf('day'), moment().endOf('day')],
                    'Вчера': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                    'Последние 3 дня': [moment().subtract(2, 'days').startOf('day'), moment().endOf('day')],
                    'Последние 7 дней': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
                    'За текущий месяц': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
                   /* 'За прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],*/
                    'За последний год': [moment().subtract(365, 'days'), moment()],
                    'За последние 2 года': [moment().subtract(365 * 2, 'days'), moment()]/*,
                    'За последние 3 года': [moment().subtract(365 * 3, 'days'), moment()]*/
                },
                locale: {
                    format: "YYYY-MM-DD HH:mm:ss",
                    applyLabel: 'Применить',
                    cancelLabel: 'Отмена'
                }
            },
            callBack)
        let start = moment().subtract(365 * 2, 'days');
        let end = moment();
        dateRangePicker.setStartDate(start);
        dateRangePicker.setEndDate(end);
        callBack(start, end);

        scope.#widgetBodyController.setDefaultDateRange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

        window.addEventListener('apply.daterangepicker', function (ev) {
            scope.#widgetBodyController.applyDateRange(ev.detail.startDate.format('YYYY-MM-DD'), ev.detail.endDate.format('YYYY-MM-DD'));
        });
    }
}
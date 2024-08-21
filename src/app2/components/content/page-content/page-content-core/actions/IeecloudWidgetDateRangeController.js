import moment from "moment/moment.js";
import "../../../../../main/common/external/vanilla-datetimerange-picker.css";
import {DateRangePicker} from "../../../../../main/common/external/vanilla-datetimerange-picker.js";
import EventDispatcher from "../../../../../main/events/EventDispatcher.js";
import {isNull} from "lodash-es";

export default class IeecloudWidgetDateRangeController extends EventDispatcher {
    #widgetBodyController;

    #startDate;
    #endDate;
    #dateRangePicker;
    #inputId;

    constructor(widgetBodyController) {
        super();
        this.#widgetBodyController = widgetBodyController;
    }

    init(inputId, prevUserSettings) {
        const scope = this;

        scope.#inputId = inputId;
        const callBack = function (start, end) {
            let spanElement = document.querySelector('#' + inputId + ' span');
            if (spanElement) {
                spanElement.innerHTML = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
            }
        }

        scope.#dateRangePicker = new DateRangePicker(inputId,
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
                    'Последние 7 дней': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
                    'За текущий месяц': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
                    'За 6 месяцев': [moment().subtract(6, 'months'), moment()],
                    'За последний год': [moment().subtract(365, 'days'), moment()],
                    'За последние 2 года': [moment().subtract(365 * 2, 'days'), moment()],
                    'Все данные': [moment('2020-01-01 00:00:00', 'YYYY-MM-DD'), moment()]
                },
                locale: {
                    format: "YYYY-MM-DD HH:mm:ss",
                    applyLabel: 'Применить',
                    cancelLabel: 'Отмена'
                }
            },
            callBack)

        if (prevUserSettings) {
            if (prevUserSettings.chosenLabel) {
                const range = scope.getRangeByLabel(prevUserSettings.chosenLabel);
                scope.#startDate = range.startDate;
                scope.#endDate = range.endDate;
            } else {
                scope.#startDate = prevUserSettings.startDate;
                scope.#endDate = prevUserSettings.endDate;
            }
        } else {
            scope.#startDate = moment('2020-01-01 00:00:00', 'YYYY-MM-DD');
            scope.#endDate = moment();
        }

        let start = scope.#startDate;
        let end = scope.#endDate;

        scope.#dateRangePicker.setStartDate(start);
        scope.#dateRangePicker.setEndDate(end);
        scope.#dateRangePicker.calculateChosenLabel();
        callBack(start, end);

        scope.#widgetBodyController.setDefaultDateRange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

        window.addEventListener('apply.daterangepicker', function (ev) {
            scope.#startDate = ev.detail.startDate;
            scope.#endDate = ev.detail.endDate;
            scope.#widgetBodyController?.applyDateRange(ev.detail.startDate.format('YYYY-MM-DD'), ev.detail.endDate.format('YYYY-MM-DD'));
        });
    }

    isRangeChosen(){
        return !isNull(this.#dateRangePicker.chosenLabel);
    }

    getChosenLabel(){
        return this.#dateRangePicker.chosenLabel;
    }

    getRangeByLabel(label) {
        const chosenRange = this.#dateRangePicker.ranges[label];
        if (chosenRange) {
            return {
                startDate: chosenRange[0],
                endDate: chosenRange[1],
                chosenLabel: this.#dateRangePicker.chosenLabel
            }
        }

        let start =  moment('2020-01-01 00:00:00', 'YYYY-MM-DD');
        let end = moment();

        return {
            startDate: start,
            endDate: end
        }
    }

    get startDate(){
        return this.#startDate;
    }

    get endDate(){
        return this.#endDate;
    }

    destroy() {
        this.#dateRangePicker = null;
        this.#widgetBodyController = null;

        let spanElement = document.querySelector(' .daterangepicker ');
        if (spanElement) {
            spanElement.remove();
        }
    }
}
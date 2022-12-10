import moment from "moment";

export default class IeecloudChartMapper {

    // indicators = [{code: 'tilt_x', name: 'Наклон по X'}, {code: 'tilt_y', name: 'Наклон по Y'}];


    mapColor = {
        ['tilt_x' + 'left']: "#003f5c",
        ['tilt_x' + 'right']: "#665191",
        ['tilt_y' + 'left']: "#d45087",
        ['tilt_y' + 'right']: "#e67f83",
    }

    mapColumns(dataSchema, nodeProps) {
        let result = {};
        result.schema = dataSchema;
        result.filterUrlParams = this.#buildFilter(nodeProps, dataSchema);
        return result;

    }


    #buildFilter(nodeProps, tableScheme) {
        let filterUrlParams = '';
        let filtersString = [];
        if (nodeProps.hasOwnProperty("filter") && nodeProps.hasOwnProperty("filterValues")) {
            filterUrlParams = '&filter=';
            const filterNames = nodeProps.filter.split(';');
            const filterValues = nodeProps.filterValues.split(';');
            if (filterNames.length > 0 && filterValues.length > 0) {
                filterNames.forEach(function (filterProp, index) {
                    let columnCode = tableScheme.properties.find(value => value.code === filterProp);
                    if (columnCode) { // check filter field exist in scheme
                        filtersString.push(columnCode.code + ':' + filterValues[index]);
                    }
                });
            }
        }

        return filterUrlParams.concat(filtersString.join(filterUrlParams))
    }

    mapData(response, dataSchema, indicator) {
        const scope = this;

        let result = {
            dataSets: [],
            xAxis: [],
            title: ""
        };

        if (response.data && response.data.length > 0) {

            const drawColumn =indicator;

            let dataSet = {
                name: drawColumn.name,
                data: [],

            }
            for (let i = 0; i < response.data.length; i++) {

                let row = response.data[i];
                let objData = scope.buildObjBySchemaAndData(dataSchema, row);

                let dataColumn = objData[drawColumn.code];
                result.title = objData.replacement;
                let time = this.formatLabel(this.convertUnixTimeToHumanDateWitFormat(objData.time, "ru-RU", 'DD.MM.YYYY HH:mm'), 4);

                result.xAxis.push(time);
                dataSet.data.push({
                    x: time,
                    y: dataColumn
                });
            }

            result.dataSets.push(dataSet);
        }

        return this.chartJsAdapterAfter(result, indicator);
    }

    getColor(replacement, indicator) {
        let side = replacement.indexOf('Л') >= 0 ? 'left' : 'right';
        return this.mapColor[[indicator.code + side]];
    }

    chartJsAdapterAfter(processedData, indicator) {
        const scope = this;
        let setColor = scope.getColor("Опора 01-Л", indicator);

        let chartJsDataSet = [];
        for (let i = 0; i < processedData.dataSets.length; i++) {

            let generateColor = this.dynamicColors();
            if (setColor != null) {
                generateColor = setColor;
            }

            let dataSet = processedData.dataSets[i];
            chartJsDataSet.push({
                label: dataSet.name,
                backgroundColor: generateColor,
                borderColor: generateColor,
                data: dataSet.data
            });
        }

        return {
            labels: processedData.xAxis,
            datasets: chartJsDataSet,
            title: processedData.title
        };
    }

    buildObjBySchemaAndData(dataSchema, objData) {
        const scope = this;
        let result = {};
        for (let i = 0; i < dataSchema.properties.length; i++) {
            let prop = dataSchema.properties[i];
            result[prop.code] = objData[i];
        }
        return result;
    }

    convertUnixTimeToHumanDateWitFormat(unixTime, local, format) {
        const unixTimestamp = parseInt(unixTime)
        const milliseconds = unixTimestamp * 1000 // 1575909015000
        const dateObject = new Date(milliseconds)
        return moment(dateObject).format(format);
    }


    formatLabel(str, maxWidth) {
        let sections = [];
        let words = str.split(" ");
        let temp = "";

        words.forEach(function (item, index) {
            if (temp.length > 0) {
                let concat = temp + ' ' + item;

                if (concat.length > maxWidth) {
                    sections.push(temp);
                    temp = "";
                } else {
                    if (index === (words.length - 1)) {
                        sections.push(concat);
                        return;
                    } else {
                        temp = concat;
                        return;
                    }
                }
            }

            if (index === (words.length - 1)) {
                sections.push(item);
                return;
            }

            if (item.length < maxWidth) {
                temp = item;
            } else {
                sections.push(item);
            }

        });

        return sections;
    }

    dynamicColors() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
}
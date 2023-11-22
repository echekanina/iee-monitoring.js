import moment from "moment";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudChartMapper {


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

    mapData(response, dataSchema, indicatorsElement, color) {
        const scope = this;

        let lineColor = color ? color : IeecloudAppUtils.dynamicColors();

        let datasets = [{
            label: indicatorsElement.name,
            backgroundColor: lineColor,
            borderColor: lineColor,
            data: []
        }];

        let result = {
            datasets: datasets,
            title: ""
        };

        if (response.data && response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
                let row = response.data[i];
                let objRowData = scope.buildObjBySchemaAndData(dataSchema, row);

                const unixTimestamp = parseInt(objRowData.time)
                const xValue = unixTimestamp * 1000 // 1575
                let yValue = objRowData[indicatorsElement.code];
                result.datasets[0].data.push({ x: xValue, y: yValue });
                result.title = objRowData.pointId ? objRowData.pointId : "TITLE";
            }

        }

        return result;
    }

    buildObjBySchemaAndData(dataSchema, objData) {
        let result = {};
        for (let i = 0; i < dataSchema.properties.length; i++) {
            let prop = dataSchema.properties[i];
            result[prop.code] = objData[i];
        }
        return result;
    }
}
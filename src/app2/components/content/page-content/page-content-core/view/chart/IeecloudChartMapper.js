import moment from "moment";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";
import {v4 as uuidv4} from "uuid";

export default class IeecloudChartMapper {

    mapColumns(dataSchema, nodeProps) {
        let result = {};
        result.schema = dataSchema;
        result.filterUrlParams = this.#buildFilter(nodeProps, dataSchema);
        return result;

    }

    mapNewApiColumns(dataSchema, criteriaParams) {
        let result = {};
        result.schema = dataSchema;
        let   filterUrlParams = '&filter=';
        let filtersString = [];
        // result.filterUrlParams = this.#buildFilter(nodeProps, dataSchema);

        for(let key in criteriaParams){
            if (key === 'pointId' || key === 'indicator_code') {
                filtersString.push(key + ':' + criteriaParams[key]);
            }
            // if(key==='indicator_code'){
            //     filtersString.push('indicator_name' + ':' + criteriaParams[key]);
            // }
        }
        result.filterUrlParams = filterUrlParams.concat(filtersString.join(filterUrlParams));
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

    mapNewApiData(response, dataSchema, criteriaParams) {
        const scope = this;


        let labelString = [];
        for (let key in criteriaParams) {
            labelString.push(key + '=' + criteriaParams[key]);
        }

        let lineColor = IeecloudAppUtils.dynamicColors();

        let datasets = [{
            id:  uuidv4(),
            label: labelString.join(","),
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
                let yValue = objRowData.value;
                result.datasets[0].data.push({ x: xValue, y: yValue });
                result.title = objRowData.pointId ? objRowData.pointId : "TITLE";
            }

        }

        return result;
    }

    mapData(response, dataSchema, indicatorsElement, itemStore) {
        const scope = this;

        let lineColor = itemStore.color ? itemStore.color : IeecloudAppUtils.dynamicColors();

        let datasets = [{
            id: itemStore.id,
            label: itemStore.name,
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
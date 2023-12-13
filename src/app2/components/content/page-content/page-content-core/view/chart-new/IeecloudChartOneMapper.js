import {groupBy} from "lodash-es";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudChartOneMapper {

    mapColumns(dataSchema) {
        let result = {};
        result.schema = dataSchema;
        return result;

    }

    mapCriteriaItemColumns(response , dataSchema){
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            dataSchema.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
            });
            rowData.push(row)
        });

        return rowData;
    }

    mapCriteriaColumns(dataSchema){
        let result = [];
        dataSchema.properties.forEach(function(item){
            if(item.hasOwnProperty("repo_code")){
                result.push(item);
            }
        })
        return result;
    }


    mapCriteriaSchemeColumns(dataSchema){
        const result = {
            interestedColumns: []
        };

        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'code') {
                result.interestedColumns.push({
                    index: index,
                    field: "id"
                });
            } else if (property.code === 'name') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            }

        });
        return result;
    }

    mapData(response, dataSchema) {
        const scope = this;

        let eventsData = [];

        let columns = []
        const rowData = [];
        let columnDefs = dataSchema.properties;
        columnDefs.forEach(function (column) {
            columns.push(column.code)
        })

        response.data.forEach(function (rowArray) {
            let row = {};
            rowArray.forEach(function (item, index) {
                row[columns[index]] = item;
            })
            rowData.push(row)
        });


        const groupedRowData = groupBy(rowData, row => row.edate);


        for (let time in groupedRowData) {

            const serverEvents = groupedRowData[time];
            let uiEvents = [];
            serverEvents.forEach(function (initialEvent) {
                uiEvents.push({
                    id: initialEvent.id,
                    name: initialEvent.descr,
                    typeId : initialEvent.type_id,
                    typeName : initialEvent.type_name,
                    bgColor: initialEvent.bgColor ? initialEvent.bgColor : IeecloudAppUtils.dynamicColors(),
                    borderColor: initialEvent.borderColor ? initialEvent.borderColor : IeecloudAppUtils.dynamicColors()/*
                    imageUrl: 'https://i.stack.imgur.com/Q94Tt.png'*/
                })
            });

            const unixTimestamp = parseInt(time)
            const milliseconds = unixTimestamp * 1000 // 1575
            eventsData.push({
                time: milliseconds,
                events: uiEvents
            });

        }

        return eventsData;

    }
}
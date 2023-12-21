import IeecloudChartMapper from "./IeecloudChartMapper.js";
import IeecloudChartDao from "./IeecloudChartDao.js";

export default class IeecloudChartService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudChartMapper();
        this.#dao = new IeecloudChartDao(this.#dataSource);
    }


    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result, nodeProps);
            callBack(dataSchema);
        });
    }


    readNewApiScheme(repoId, criteriaParams, callBack) {
        const scope = this;
        let baseUrl = `?action=schema&repoId=` + repoId;
        for (let key in criteriaParams) {
            baseUrl = baseUrl + `&` + key + `=` + criteriaParams[key];
        }
        this.#dao.readScheme(baseUrl, function (result) {
            const dataSchema = scope.#mapper.mapNewApiColumns(result, criteriaParams);
            callBack(dataSchema);
        });
    }

    // readData(nodeProps, dataSchema, filter, indicatorsElement, callBack) {
    //     const scope = this;
    //
    //     this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000&sortField=time&sortDir=asc` + filter, function (response) {
    //         const rowData = scope.#mapper.mapData(response, dataSchema, indicatorsElement);
    //         callBack(rowData);
    //     });
    // }
    readSingleLineDataAsync(itemStore, nodeProps, dataSchema, filter, indicatorElement, callBack) {
        const scope = this;
        this.#dao.readDataAsync(`?action=data&repoId=` + itemStore.store + `&viewCode=` + itemStore.viewCode + `&groupId=` + nodeProps.groupId + `&limit=100000&sortField=time&sortDir=asc` + filter, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema, indicatorElement, itemStore);
            callBack(rowData);
        });
    }


    readSingleLineNewApiDataAsync(repoId, criteriaParams, dataSchema, filter, callBack) {
        const scope = this;
        let baseUrl = `?action=data&repoId=` + repoId;
        for(let key in criteriaParams){
            baseUrl = baseUrl + `&` + key + `=` + criteriaParams[key];
        }
        baseUrl = baseUrl  +  `&limit=100000&sortField=time&sortDir=asc` + filter;
        this.#dao.readDataAsync(baseUrl, function (response) {
            const rowData = scope.#mapper.mapNewApiData(response, dataSchema, criteriaParams);
            callBack(rowData);
        });
    }

    readSingleLineData(itemStore, nodeProps, dataSchema, filterUrlParams, filter, filterValues) {

        let url = `?action=data&repoId=` + itemStore.store + `&viewCode=` + itemStore.viewCode + `&groupId=` + nodeProps.groupId + `&limit=100000&sortDir=asc`

        if (itemStore.store.includes("journal.events")) {
            if (filter && filterValues) {
                url = url + "&filter=obj_code:" + filterValues;
            }
        } else {
            url = url + "&sortField=time" + filterUrlParams
        }

        return this.#dao.readData(url);

    }

    mapData(result, dataSchema, indicatorElement, itemStore){
        const scope = this;
        return scope.#mapper.mapData(result, dataSchema, indicatorElement, itemStore);
    }

}
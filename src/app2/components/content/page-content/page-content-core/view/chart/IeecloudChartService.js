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


    readScheme(nodeProps, startDateParam, endDateParam, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result, nodeProps, startDateParam, endDateParam);
            callBack(dataSchema);
        });
    }


    readNewApiScheme(repoId, criteriaParams, startDateParam, endDateParam, callBack) {
        const scope = this;
        let baseUrl = `?action=schema&repoId=` + repoId;
        for (let key in criteriaParams) {
            // TODO: remove hardcode
            if (key === 'colorChart') {
                continue;
            }
            baseUrl = baseUrl + `&` + key + `=` + criteriaParams[key].key;
        }
        this.#dao.readScheme(baseUrl, function (result) {
            const dataSchema = scope.#mapper.mapNewApiColumns(result, criteriaParams, startDateParam, endDateParam);
            callBack(dataSchema);
        });
    }

    // readData(nodeProps, dataSchema, filter, indicatorsElement, callBack) {
    //     const scope = this;
    //
    //     this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=10000000&sortField=time&sortDir=asc` + filter, function (response) {
    //         const rowData = scope.#mapper.mapData(response, dataSchema, indicatorsElement);
    //         callBack(rowData);
    //     });
    // }
    readSingleLineDataAsync(itemStore, nodeProps, dataSchema, filter, indicatorElement, callBack) {
        const scope = this;
        this.#dao.readDataAsync(`?action=data&repoId=` + itemStore.store + `&viewCode=` + itemStore.viewCode + `&groupId=` + nodeProps.groupId + `&limit=10000000&sortField=time&sortDir=asc` + filter, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema, indicatorElement, itemStore);
            callBack(rowData);
        });
    }


    readSingleLineNewApiDataAsync(repoId, criteriaParams, dataSchema, filter, callBack) {
        const scope = this;
        let baseUrl = `?action=data&repoId=` + repoId;
        for(let key in criteriaParams){
            // TODO: wtf data is broken with colorChart param , remove hardcode
            if (key === 'colorChart') {
                continue;
            }
            baseUrl = baseUrl + `&` + key + `=` + criteriaParams[key].key;
        }
        baseUrl = baseUrl  +  `&limit=10000000&sortField=time&sortDir=asc` + filter;
        this.#dao.readDataAsync(baseUrl, function (response) {
            const rowData = scope.#mapper.mapNewApiData(response, dataSchema, criteriaParams);
            callBack(rowData);
        });
    }

    readSingleLineData(itemStore, nodeProps, dataSchema, filterUrlParams, filter, filterValues) {

        let url = `?action=data&repoId=` + itemStore.store + `&viewCode=` + itemStore.viewCode + `&groupId=` + nodeProps.groupId + `&limit=10000000&sortDir=asc`

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

    abortRequest() {
        this.#dao.abortRequest();
    }

    rebuildAbortController() {
        this.#dao.rebuildAbortController();
    }

}
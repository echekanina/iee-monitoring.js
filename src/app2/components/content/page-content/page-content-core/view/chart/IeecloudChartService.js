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
        this.#dao.readDataAsync(`?action=data&repoId=` + itemStore.store + `&groupId=` + nodeProps.groupId + `&limit=100000&sortField=time&sortDir=asc` + filter, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema, indicatorElement, itemStore.color);
            callBack(rowData);
        });
    }

    readSingleLineData(itemStore, nodeProps, dataSchema, filter) {

        return this.#dao.readData(`?action=data&repoId=` + itemStore.store + `&groupId=` + nodeProps.groupId + `&limit=100000&sortField=time&sortDir=asc` + filter);

    }

    mapData(result, dataSchema, indicatorElement, color){
        const scope = this;
        return scope.#mapper.mapData(result, dataSchema, indicatorElement, color);
    }

}
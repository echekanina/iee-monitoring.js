import IeecloudChartOneMapper from "./IeecloudChartOneMapper.js";
import IeecloudChartOneDao from "./IeecloudChartOneDao.js";

export default class IeecloudChartOneService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudChartOneMapper();
        this.#dao = new IeecloudChartOneDao(this.#dataSource);
    }


    readScheme(nodeProps, storeEventType, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + storeEventType + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result, nodeProps);
            callBack(dataSchema);
        });
    }



    readCriteriaTableScheme(callBack){
        const scope = this;
        this.#dao.readCriteriaScheme(`?action=schema&repoId=`, function (result) {
            const dataSchema = scope.#mapper.mapTableColumns(result, scope);
            callBack(dataSchema);
        });
    }


    readCriteriaScheme(callBack){
        const scope = this;
        this.#dao.readCriteriaScheme(`?action=schema&repoId=`, function (result) {
            const dataSchema = scope.#mapper.mapCriteriaColumns(result);
            callBack(dataSchema);
        });
    }

    searchCriteria(searchParam, scheme, callBack) {
        const scope = this;
        let filterQuery = "";
        if (searchParam.filterFields) {
            filterQuery = "";
            for (let key in searchParam.filterFields) {
                filterQuery = filterQuery + "&filter=" + key + ":" + searchParam.filterFields[key];
            }
        }
        this.#dao.readData(`?action=data&repoCode=` + searchParam.repoCode + `&viewCode=` + searchParam.viewCode + filterQuery + `&limit=100000`, function (result) {
            const data = scope.#mapper.mapCriteriaItemColumns(result, scheme);
            callBack(data);
        });
    }

    readCriteriaItemScheme(searchParam, callBack){
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoCode=` + searchParam.repoCode + `&viewCode=` + searchParam.viewCode, function (result) {
            const dataSchema = scope.#mapper.mapCriteriaSchemeColumns(result);
            callBack(dataSchema);
        });
    }

    readData(nodeProps, dataSchema, storeEventType, callBack, filter, filterValues) {
        const scope = this;
        let filterQuery = "";
        if(filter && filterValues) {
            filterQuery = "&filter=obj_code:" + filterValues;
        }
        this.#dao.readData(`?action=data&repoId=` + storeEventType + `&groupId=` + nodeProps.groupId + filterQuery + `&limit=100000`, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema);
            callBack(rowData);
        });
    }

    readSettingsFile(dataSource, file, callBack){
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.#dao.readContentFile(dataSource, file, function (result) {
                callBack(result);
            });
        } else {
            this.#dao.readContentFileGET(dataSource, file, function (result) {
                callBack(result);
            });
        }
    }

    getCriteriaAutoCompleteValues(searchParam) {
        const scope = this;
        return new Promise((resolve) => {
            scope.readCriteriaItemScheme(searchParam, function (scheme) {
                scope.searchCriteria(searchParam, scheme, function (data) {
                    resolve(data);
                });
            })
        });
    }

}
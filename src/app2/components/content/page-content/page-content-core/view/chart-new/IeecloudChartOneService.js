import IeecloudChartOneMapper from "./IeecloudChartOneMapper.js";
import IeecloudChartOneDao from "./IeecloudChartOneDao.js";
import {values} from "lodash-es";

export default class IeecloudChartOneService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;
    #systemController; //TODO :remove it
    #chartService; //TODO :remove it

    constructor(chartService) {
        this.#mapper = new IeecloudChartOneMapper();
        this.#dao = new IeecloudChartOneDao(this.#dataSource);
        this.#chartService = chartService;
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

    searchCriteria(searchParam, scheme,  callBack){
        const scope = this;
        this.#dao.readData(`?action=data&repoCode=` + searchParam.repoCode  + `&limit=100000`, function (result) {
            const data = scope.#mapper.mapCriteriaItemColumns(result, scheme);
            callBack(data);
        });
    }

    readCriteriaItemScheme(searchParam, callBack){
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoCode=` + searchParam.repoCode, function (result) {
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

    setSystemController(systemController){
        this.#systemController = systemController;
    }

    getValueFromServer(searchParam) {
        const scope = this;
        return new Promise((resolve) => {
            scope.readCriteriaItemScheme(searchParam, function(scheme){
                scope.searchCriteria(searchParam, scheme, function(data){

                    let resultList = data;
                    // TODO use BE filtration
                    const node = scope.#systemController?.getActiveNode();
                    if(node){

                        if (node.properties.hasOwnProperty("type") && node.properties.type.trim().length !== 0) {

                            if (searchParam.model === "mom_type") {
                                resultList = data.filter(a => values(a).some(b => b.includes(node.properties.type)));
                                resolve(resultList);
                            } else if (searchParam.model === "indicator_code") {
                                let indicators = [];

                                scope.#chartService.readScheme(node.properties, function (result) {
                                    result.schema.properties.forEach(function (property) {
                                        if (!property.code.includes('_')) {

                                            if (property.type === 'real') {
                                                indicators.push(property.name);
                                            }
                                        }


                                    });
                                    resultList = data.filter(a => {
                                        if (indicators.includes(a.name)) {
                                            return true;
                                        }
                                    });
                                    resolve(resultList);
                                });



                            } else if (searchParam.model === "indicator_type_code") {
                                resolve(resultList);
                            }


                        }

                    }else{
                        resolve(resultList);
                    }


                });
            })
        });
    }

}
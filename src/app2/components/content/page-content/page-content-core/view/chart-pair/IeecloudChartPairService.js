import IeecloudChartPairMapper from "./IeecloudChartPairMapper.js";
import IeecloudChartPairDao from "./IeecloudChartPairDao.js";

export default class IeecloudChartPairService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudChartPairMapper();
        this.#dao = new IeecloudChartPairDao(this.#dataSource);
    }


    readScheme(nodeProps, storeEventType, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + storeEventType + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result, nodeProps);
            callBack(dataSchema);
        });
    }

    readSchemePromise(nodeProps, storeEventType) {
        return this.#dao.readSchemePromise(`?action=schema&repoId=` + storeEventType + `&groupId=` + nodeProps.groupId);
    }

    readData(nodeProps, dataSchema, storeEventType, callBack, filter, filterValues) {
        const scope = this;
        let filterQuery = "";
        if(filter && filterValues) {
            filterQuery = "&filter=obj_code:" + filterValues;
        }
        this.#dao.readData(`?action=data&repoId=` + storeEventType + `&groupId=` + nodeProps.groupId + filterQuery + `&limit=10000000`, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema);
            callBack(rowData);
        });
    }

    mapEventData(response, dataSchema){
        return this.#mapper.mapData(response, dataSchema);
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

}
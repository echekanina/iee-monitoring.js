import IeecloudEditTreeMapper from "./IeecloudEditTreeMapper.js";
import IeecloudEditTreeDao from "./IeecloudEditTreeDao.js";

export default class IeecloudEditTreeService {
    #mapper;
    #dao;
    #dataSource;

    constructor(dataSource) {
        this.#mapper = new IeecloudEditTreeMapper();
        this.#dataSource = dataSource;
        this.#dao = new IeecloudEditTreeDao(this.#dataSource);
    }

    getTreeScheme(contentSchemeFile, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.#dao.readTreeFile(contentSchemeFile, function (result) {
                const schemeModel = scope.#mapper.map(contentSchemeFile, result);
                callBack(schemeModel);
            });
        } else {
            this.#dao.readTreeFileGET(contentSchemeFile, function (result) {
                const schemeModel = scope.#mapper.map(contentSchemeFile, result);
                callBack(schemeModel);
            });
        }

    }


    getTreeData(contentDataFile, schemeModel, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.#dao.readTreeFile(contentDataFile, function (result) {
                const dataModel = scope.#mapper.mapData(contentDataFile, result);
                callBack(dataModel);
            });
        } else {
            this.#dao.readTreeFileGET(contentDataFile, function (result) {
                const dataModel = scope.#mapper.mapData(contentDataFile, result);
                callBack(dataModel);
            });
        }

    }

    saveTree(treeModel, fileName) {
        const scope = this;
        const data = scope.#mapper.mapDataToSave(treeModel);
        const bodyData = {fileName : fileName, data : data};
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            console.log(bodyData)
            this.#dao.saveTreeToFile(bodyData, function (result) {
                // const dataModel = scope.#mapper.mapData(contentDataFile, result);
                // callBack(dataModel);
            });
        } else {
            // TODO save to server
        }

    }


}
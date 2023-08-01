import IeecloudContentDao from "./IeecloudContentDao.js";
import IeecloudContentMapper from "./IeecloudContentMapper.js";

export default class IeecloudContentService {
    dao;
    mapper;

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.dao = new IeecloudContentDao(dataSource);
        this.mapper = new IeecloudContentMapper();

    }


    getContentScheme(contentSchemeFile, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.dao.readContentFile(contentSchemeFile, function (result) {
                const schemeModel = scope.mapper.map(contentSchemeFile, result);

                callBack(schemeModel);
            });
        } else {
            this.dao.readContentFileGET(contentSchemeFile, function (result) {
                const schemeModel = scope.mapper.map(contentSchemeFile, result);
                callBack(schemeModel);
            });
        }

    }

    getContentLayout(contentLayoutFile, callBack) {
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.dao.readContentFile(contentLayoutFile, function (result) {
                callBack(result);
            });
        } else {
            this.dao.readContentFileGET(contentLayoutFile, function (result) {
                callBack(result);
            });
        }

    }

    getContentData(contentDataFile, schemeModel, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.dao.readContentFile(contentDataFile, function (result) {
                const dataModel = scope.mapper.mapData(contentDataFile, result, schemeModel);
                callBack(dataModel);
            });
        } else {
            this.dao.readContentFileGET(contentDataFile, function (result) {
                const dataModel = scope.mapper.mapData(contentDataFile, result);
                callBack(dataModel);
            });
        }

    }


}
import IeecloudContentDao from "./IeecloudContentDao.js";
import IeecloudContentMapper from "./IeecloudContentMapper.js";

export default class IeecloudContentService {
    dao;
    mapper;
    #appServerUrl;

    constructor(appServerUrl, appServerRootUrl) {
        this.dao = new IeecloudContentDao(appServerUrl, appServerRootUrl);
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

    getContentData(contentMetaData, schemeModel, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;

        const useApi = contentMetaData.useApi;
        const contentDataFile = contentMetaData.contentModelFileName;

        if (mode.includes("mock")) {
            if (useApi) {
                this.#doGetDataFromServerApi(contentMetaData, schemeModel, callBack);
            } else {
                this.dao.readContentFile(contentDataFile, function (result) {
                    const dataModel = scope.mapper.mapData(contentDataFile, result, schemeModel);
                    callBack(dataModel);
                });
            }

        } else {
            if (useApi) {
                this.#doGetDataFromServerApi(contentMetaData, schemeModel, callBack);
            } else {
                this.dao.readContentFileGET(contentDataFile, function (result) {
                    const dataModel = scope.mapper.mapData(contentDataFile, result);
                    callBack(dataModel);
                });
            }


        }

    }

    #doGetDataFromServerApi(contentMetaData, schemeModel, callBack) {
        const scope = this;
        const repoId = contentMetaData.repoId;
        const formatData = contentMetaData.formatData;
        this.dao.readData(`/data/getOne?repoCode=` + repoId + `&formatData=` + formatData, function (result) {
            const dataModel = scope.mapper.mapData('no-file', result, schemeModel);
            callBack(dataModel);
        });
    }
}
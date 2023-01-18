import IeecloudAppDao from "./mainDao.js";
import IeecloudAppMapper from "./mainMapper.js";

export default class IeecloudAppService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudAppMapper();
        this.dao = new IeecloudAppDao(dataSource);
    }

    getAppScheme(appSchemeFile, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode === 'mock') {
            this.dao.readAppFile(appSchemeFile, function (result) {
                const schemeModel = scope.mapper.map(appSchemeFile, result);
                callBack(schemeModel);
            });
        } else {
            this.dao.readAppFileGet(appSchemeFile, function (result) {
                const schemeModel = scope.mapper.map(appSchemeFile, result);
                callBack(schemeModel);
            });
        }

    }

    getAppData(appDataFile, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode === 'mock') {
            this.dao.readAppFile(appDataFile, function (result) {
                const dataModel = scope.mapper.mapData(appDataFile, result);
                callBack(dataModel);
            });
        } else {
            this.dao.readAppFileGet(appDataFile, function (result) {
                const dataModel = scope.mapper.mapData(appDataFile, result);
                callBack(dataModel);
            });
        }


    }
}
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
        this.dao.readContentFileGET(contentSchemeFile, function(result){
            const schemeModel = scope.mapper.map(contentSchemeFile, result);
            callBack(schemeModel);
        });
    }

    getContentData(contentDataFile, callBack) {
        const scope = this;
        this.dao.readContentFileGET(contentDataFile, function(result){
            const dataModel = scope.mapper.mapData(contentDataFile, result);
            callBack(dataModel);
        });
    }
}
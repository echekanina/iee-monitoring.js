import {IeecloudPageDao} from "./IeecloudPageDao.js";

export default class IeecloudPageService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.dao = new IeecloudPageDao(dataSource);
    }

    getBreadcrumb(data, callBack) {
        this.dao.readBreadcrumb(`?action=data&repoId=` + data.repoId + `&groupId=` + data.groupId, function(result){
            callBack(result.breadcrumb);
        });
    }
}
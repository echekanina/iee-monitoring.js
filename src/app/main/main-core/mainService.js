import IeecloudAppDao from "./mainDao.js";
import IeecloudAppMapper from "./mainMapper.js";

export default class IeecloudAppService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudAppMapper();
        this.dao = new IeecloudAppDao(dataSource);
    }

    getAppConfiguration(appSchemeFile, callBack){
        const scope = this;
        this.dao.readAppScheme(appSchemeFile, function(result){
            const viewModel = scope.mapper.map(result);
            callBack(viewModel);
        });
    }
}
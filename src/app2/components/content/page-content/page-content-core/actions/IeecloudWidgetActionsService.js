import IeecloudWidgetActionsMapper from "./IeecloudWidgetActionsMapper.js";
import IeecloudWidgetActionsDao from "./IeecloudWidgetActionsDao.js";

export default class IeecloudWidgetActionsService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudWidgetActionsMapper();
        this.#dao = new IeecloudWidgetActionsDao(this.#dataSource);
    }


    readScheme(repoId, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + repoId, function(result){
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }

    readData(repoId, dataSchema, field, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=` + repoId, function(response){
            const rowData = scope.#mapper.mapData(response, dataSchema, field);
            callBack(rowData);
        });
    }

}
import IeecloudMapMapper from "./IeecloudMapMapper.js";
import IeecloudMapDao from "./IeecloudMapDao.js";

export default class IeecloudMapService {
    #dataSource = import.meta.env.VITE_APP_SERVER_ROOT_URL;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudMapMapper();
        this.#dao = new IeecloudMapDao(this.#dataSource);
    }


    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(result){
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }

    readData(nodeProps, dataSchema, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100`, function(response){
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

}
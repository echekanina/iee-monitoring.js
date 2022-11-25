import IeecloudMapMapper from "./IeecloudMapMapper.js";
import IeecloudMapDao from "./IeecloudMapDao.js";

export default class IeecloudMapService {
    #dataSource;
    #mapper;
    #dao;

    constructor(dataSource) {
        this.#dataSource = dataSource;
        this.#mapper = new IeecloudMapMapper();
        this.#dao = new IeecloudMapDao(dataSource);
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

}
import IeecloudViewer3dMapper from "./IeecloudViewer3dMapper.js";
import IeecloudViewer3dDao from "./IeecloudViewer3dDao.js";

export default class IeecloudViewer3dService {
    #dao;
    #mapper;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.#mapper = new IeecloudViewer3dMapper();
        this.#dao = new IeecloudViewer3dDao(dataSource);

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
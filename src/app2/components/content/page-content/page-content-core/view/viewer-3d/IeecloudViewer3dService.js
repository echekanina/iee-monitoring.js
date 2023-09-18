import IeecloudViewer3dMapper from "./IeecloudViewer3dMapper.js";
import IeecloudViewer3dDao from "./IeecloudViewer3dDao.js";

export default class IeecloudViewer3dService {
    #dao;
    #mapper;
    #dataSource = window.VITE_APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    constructor() {
        this.#mapper = new IeecloudViewer3dMapper();
        this.#dao = new IeecloudViewer3dDao(this.#dataSource);

    }

    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(result){
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }

    readVertex(dataSource, coordsFile, callBack) {
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.#dao.readContentFile(dataSource, coordsFile, function (result) {
                callBack(result);
            });
        } else {
            this.#dao.readContentFileGET(dataSource, coordsFile, function (result) {
                callBack(result);
            });
        }

    }

    readData(nodeProps, dataSchema, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100`, function(response){
            scope.readVertex(window.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_3D_VERTEX_FILE_NAME, function (vertexMap) {
                const rowData = scope.#mapper.mapData(response, dataSchema, vertexMap);
                callBack(rowData);
            });

        });
    }

}
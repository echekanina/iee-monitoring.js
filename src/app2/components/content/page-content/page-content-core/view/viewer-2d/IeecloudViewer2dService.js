import IeecloudViewer2dMapper from "./IeecloudViewer2dMapper.js";
import IeecloudViewer2dDao from "./IeecloudViewer2dDao.js";

export default class IeecloudViewer2dService {
    #dao;
    #mapper;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.#mapper = new IeecloudViewer2dMapper();
        this.#dao = new IeecloudViewer2dDao(dataSource);

    }

    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(result){
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }

    readCoords(dataSource, coordsFile, callBack) {
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
            scope.readCoords(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_2D_COORDS_FILE_NAME, function (coords) {
                const rowData = scope.#mapper.mapData(response, dataSchema, coords);
                callBack(rowData);
            });

        });
    }

}
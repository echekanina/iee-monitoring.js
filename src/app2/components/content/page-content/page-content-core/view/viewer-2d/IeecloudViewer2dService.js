import IeecloudViewer2dMapper from "./IeecloudViewer2dMapper.js";
import IeecloudViewer2dDao from "./IeecloudViewer2dDao.js";

export default class IeecloudViewer2dService {
    #dao;
    #mapper;

    #dataSource = import.meta.env.VITE_APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;

    #USER_COORDS_STORAGE_KEY = "coordsStorage";
    #storedUserKeyAddition;

    constructor(modelId) {
        this.#mapper = new IeecloudViewer2dMapper();
        this.#dao = new IeecloudViewer2dDao(this.#dataSource);
        this.#storedUserKeyAddition = '_' + import.meta.env.VITE_USER_NODE_ENV + '_' + __KEY_OPTIONS__ + '_' + modelId;
    }

    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function (result) {
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

    save2DCoordinateToStorage(selectedNode, stored2dCoordinate) {
        const scope = this;
        const coordsJsonString = scope.#get2DSensorCoords();
        if (coordsJsonString) {
            const coordsJson = JSON.parse(coordsJsonString);
            let item = coordsJson[selectedNode.id];
            if (item) {
                item.coords.x = stored2dCoordinate.x;
                item.coords.y = stored2dCoordinate.y;
            } else {
                coordsJson[selectedNode.id] = {
                    "coords": {
                        "x": stored2dCoordinate.x,
                        "y": stored2dCoordinate.y
                    }
                }
            }
            scope.#store2DSensorCoords(coordsJson);
        }
        console.log(JSON.parse(scope.#get2DSensorCoords()))

    }

    #store2DSensorCoords(coordsJson) {
        const scope = this;
        localStorage.setItem(scope.#USER_COORDS_STORAGE_KEY + this.#storedUserKeyAddition, JSON.stringify(coordsJson));
    }

    #get2DSensorCoords() {
        const scope = this;
        return localStorage.getItem(scope.#USER_COORDS_STORAGE_KEY + this.#storedUserKeyAddition);
    }

    #clear2DSensorCoords() {
        const scope = this;
        localStorage.removeItem(scope.#USER_COORDS_STORAGE_KEY + this.#storedUserKeyAddition);
    }

    readData(nodeProps, dataSchema, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100`, function (response) {

            const coordsJsonString = scope.#get2DSensorCoords();
            if (!coordsJsonString) {
                scope.readCoords(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_2D_COORDS_FILE_NAME, function (coords) {
                    scope.#store2DSensorCoords(coords);
                    const rowData = scope.#mapper.mapData(response, dataSchema, coords);
                    callBack(rowData);

                });
            } else {
                const coordsJson = JSON.parse(coordsJsonString);
                const rowData = scope.#mapper.mapData(response, dataSchema, coordsJson);
                callBack(rowData);
            }
        });
    }

}
import IeecloudViewer2dMapper from "./IeecloudViewer2dMapper.js";
import IeecloudViewer2dDao from "./IeecloudViewer2dDao.js";

export default class IeecloudViewer2dService {
    #dao;
    #mapper;

    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;

    #USER_COORDS_STORAGE_KEY = "coordsStorage";
    #storedUserKeyAddition;

    constructor(modelId) {
        this.#mapper = new IeecloudViewer2dMapper();
        this.#dao = new IeecloudViewer2dDao(this.#dataSource);
        this.#storedUserKeyAddition = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__ + '_' + modelId;
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

    

    readIndicatorsScheme(objCode, indicator, indicatorType, funcAgg,  callBack) {
        const scope = this;
        const dataSource = import.meta.env.APP_SERVER_ROOT_URL + "/data/getAggData";
        this.#dao.readSchemeWithCustomDataSource(dataSource, `?action=schema&obj_code=` + objCode + `&ind_code=` + indicator + `&ind_type=` + indicatorType + `&aggr=` + funcAgg, function (result) {
            callBack(result);
        });
    }

    readIndicatorsData(objCode, indicator, indicatorType, funcAgg,  dataSchema, callBack) {
        const scope = this;
        const dataSource = import.meta.env.APP_SERVER_ROOT_URL + "/data/getAggData"
        this.#dao.readDataWithCustomDataSource(dataSource, `?action=data&obj_code=` + objCode + `&ind_code=` + indicator + `&ind_type=` + indicatorType + `&aggr=` + funcAgg, function (result) {
            const data = result.data;
            const groupData = {}
            data.forEach(smallArray => {
                if(smallArray && smallArray.length === 2){
                    groupData[smallArray[0]] = smallArray[1];
                }
            });
            callBack({data : groupData});
        });
    }

    getIndicatorData(nodeCode, indicatorCode, callBack){
        const commonData = {
            "v_min" : {
                "kvartal_11" : "14.34",
                "kvartal_12" : "424.34",
                "kvartal_13" : "624.343",
            },
            "v_max" : {
                "kvartal_11" : "15.54",
                "kvartal_12" : "524.54",
                "kvartal_13" : "888.343",
            },
            "w_min" : {
                "kvartal_11" : "199999.34",
                "kvartal_12" : "898989898.34",
                "kvartal_13" : "89898.343",
            },
            "w_max" : {
                "kvartal_11" : "111111.34",
                "kvartal_12" : "81111111.34",
                "kvartal_13" : "8111111.343",
            },
        }

        const result = {indicatorCode : indicatorCode, data : commonData[indicatorCode]}
        callBack(result);
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

        this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000`, function (response) {

            const coordsJsonString = scope.#get2DSensorCoords();
            // TODO: temporary always load coords from the server
            if (!coordsJsonString || true) {
                scope.readCoords(import.meta.env.APP_SERVER_URL, import.meta.env.VITE_CONTENT_2D_COORDS_FILE_NAME, function (coords) {
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
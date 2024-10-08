export default class IeecloudChartOneDao {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    readScheme(url, callback) {
        fetch(this.dataSource + url, {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readSchemePromise(url) {
        return fetch(this.dataSource + url, {
            method: 'GET'
        });
    }

    readCriteriaScheme(url, callback) {
        callback({
            "$id": "https://example.com/person.schema.json",
            "$schema": "",
            "name": "Журнал Репозиториев",
            "type": "object",
            "sortField": "time",
            "sortDir": "desc",
            "isCleanData": true,
            "properties": [
                {
                    "code": "pointId",
                    "name": "Точка Измерения",
                    "type": "str",
                    "unit": "",
                    "repo_code": "reginfo.obj.indicators",
                    "view_code": "default"
                },
                {
                    "code": "mom_code",
                    "name": "Метод Измерения",
                    "type": "str",
                    "unit": "",
                    "repo_code": "reginfo.obj.indicators",
                    "view_code": "default_with_mom",
                    "filter_fields" : ["pointId"]
                },
                {
                    "code": "indicator_code",
                    "name": "Показатель",
                    "type": "str",
                    "unit": "",
                    "repo_code": "reginfo.obj.indicators",
                    "view_code": "default_with_indicator",
                    "filter_fields" : ["pointId",  "mom_code"]
                },
                {
                    "code": "indicator_type_code",
                    "name": "Тип Показателя",
                    "type": "str",
                    "unit": "",
                    "repo_code": "reginfo.obj.indicators",
                    "view_code": "default_with_indicator_type",
                    "filter_fields" : ["pointId",  "mom_code", "indicator_code"]
                },
                {
                    "code": "colorChart",
                    "name": "Цвет",
                    "type": "str",
                    "unit": "",
                    "repo_code": "color",
                    "view_code": "default"
                },
                {
                    "code": "actions",
                    "name": "Действия",
                    "type": "str",
                    "unit": "",
                    "repo_code": "actions"
                },
                {
                    "code": "time",
                    "name": "time",
                    "type": "date",
                    "unit": ""
                },
                {
                    "code": "value",
                    "name": "value",
                    "type": "real",
                    "unit": ""
                }
            ],
            "functions": [
            ],
            "stats": {
                "dims": [
                    {
                        "fieldName": "id"
                    }
                ],
                "dateFormat": "ymd",
                "fact": {
                    "func": "count",
                    "fieldName": ""
                }
            }
        });
    }

    readData(url, callback) {
        fetch(this.dataSource + url, {
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readContentFile(dataSource, file, callback) {
        const appCode = import.meta.env.APP_CODE;
        const appType = import.meta.env.APP_TYPE;
        const orgCode = import.meta.env.ORG_CODE;
        const env = import.meta.env.ENV;
        const data = {fileName: file, appCode: appCode, orgCode: orgCode, appType: appType, env: env};

        fetch(dataSource + '/read-file' + "?ms=" + Date.now(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readContentFileGET(dataSource, file, callback) {

        fetch(dataSource + file + "?ms=" + Date.now(), {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }


}
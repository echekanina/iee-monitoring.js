export default class IeecloudWidgetBodyEditDao {

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

    saveData(url, dataToSave, callback) {

        fetch(this.dataSource + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
            },
            body: JSON.stringify(dataToSave),
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }
}
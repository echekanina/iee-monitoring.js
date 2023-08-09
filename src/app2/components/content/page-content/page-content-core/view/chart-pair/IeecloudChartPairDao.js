export default class IeecloudChartPairDao {
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

    readContentFile(dataSource, file, callback) {
        const data = {fileName: file};

        fetch(dataSource + '/read-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
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

        fetch(dataSource + file, {
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
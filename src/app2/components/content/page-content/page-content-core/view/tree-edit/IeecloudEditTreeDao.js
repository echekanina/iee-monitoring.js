export default class IeecloudEditTreeDao {
    constructor(dataSource) {
        this.dataSource = dataSource;

    }

    readTreeFile(file, callback) {
        const data = {fileName: file};

        fetch(this.dataSource + '/read-file', {
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

    readTreeFileGET(file, callback) {

        fetch(this.dataSource + file, {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }


    saveTreeToFile(data) {
        fetch(this.dataSource + '/save-tree', {
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
            });
    }

    getSchemas(callback) {
        fetch(this.dataSource + '/schemas', {
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
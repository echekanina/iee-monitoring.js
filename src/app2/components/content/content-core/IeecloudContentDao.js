export default class IeecloudContentDao {
    constructor(dataSource) {
        this.dataSource = dataSource;

    }

    readContentFile(file, callback) {
        const data = {fileName: file};

        fetch(this.dataSource + '/read-file'  + "?ms=" + Date.now(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'cache-control': 'no-cache'
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

    readContentFileGET(file, callback) {

        fetch(this.dataSource + file + "?ms=" + Date.now(), {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache'
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }
}
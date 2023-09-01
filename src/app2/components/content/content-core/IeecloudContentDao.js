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

    readContentFileGET(file, callback) {

        fetch(this.dataSource + file + "?ms=" + Date.now(), {
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
export default class IeecloudAppDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    readAppFile(file, callback) {
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


    readAppFileGet(file, callback) {
        const data = {fileName: file};

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
}
export default class IeecloudContentDao {
    constructor(dataSource) {
        this.dataSource = dataSource;

    }

    readContentFile(file, callback) {
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
}
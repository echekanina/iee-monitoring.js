export default class IeecloudTableDao {

    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }


    readScheme(tableSchemeFile, callback) {
        const data = {fileName: tableSchemeFile};

        fetch(this.dataSource + '/read-scheme', {
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

    readData(dataFile, callback) {
        const data = {fileName: dataFile};
        fetch(this.dataSource + '/read-data', {
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
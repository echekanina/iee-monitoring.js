export default class IeecloudAppDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    readAppScheme(appSchemeFile, callback) {
        const data = {fileName: appSchemeFile};

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
}
export default class IeecloudChartDao {

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

    readData(url) {
        return fetch(this.dataSource + url, {
            method: 'GET',
        });
            // .then((res) => {
            //     return res.json();
            // })
            // .then((result) => {
            //     callback(result);
            // })*/;
    }
}
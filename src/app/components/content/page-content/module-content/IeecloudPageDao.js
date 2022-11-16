export class IeecloudPageDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    readBreadcrumb(url, callback) {
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
}
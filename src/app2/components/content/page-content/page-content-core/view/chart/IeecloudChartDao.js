export default class IeecloudChartDao {

    dataSource;
    #abortController;
    #signal;

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.#abortController = new AbortController();
        this.#signal = this.#abortController.signal;
    }


    readScheme(url, callback) {
        const scope = this;
        fetch(this.dataSource + url, {
            method: 'GET',
            signal: scope.#signal
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            }).catch(err => console.warn(err)); // TODO add error handle
    }

    readData(url) {
        const scope = this;
        return fetch(this.dataSource + url, {
            method: 'GET',
            signal: scope.#signal
        });
    }

    readDataAsync(url, callback) {
        const scope = this;
        fetch(this.dataSource + url, {
            method: 'GET',
            signal: scope.#signal
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            }).catch(err => console.warn(err)); // TODO add error handle
    }


    abortRequest() {
        this.#abortController.abort();
    }


    rebuildAbortController(){
        this.#abortController = new AbortController();
        this.#signal = this.#abortController.signal;
    }

}
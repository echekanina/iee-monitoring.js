export default class IeecloudTableDao {

    dataSource;
    #abortController;
    #signal;

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.#abortController = new AbortController()
        this.#signal = this.#abortController.signal

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

    readData(url, callback) {
        const scope = this;
        fetch(this.dataSource + url, {
            method: 'GET',
            signal: scope.#signal,
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            })/*.catch(err => console.warn(err))*/; // TODO add error handle
    }

    abortRequest() {
        this.#abortController.abort();
    }
}
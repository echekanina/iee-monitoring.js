import EventEmitter2 from "eventemitter2";

export default class IeecloudObserveObject extends EventEmitter2 {
    #moduleItemModel;

    constructor(moduleItemModel) {
        super();
        this.#moduleItemModel = moduleItemModel;
    }

    get moduleItemModel() {
        return this.#moduleItemModel;
    }
}
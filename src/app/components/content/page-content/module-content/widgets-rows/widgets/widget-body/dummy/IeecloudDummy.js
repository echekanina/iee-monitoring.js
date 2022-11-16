export default class IeecloudDummy {
    model;
    #template
    constructor(model) {
        this.model = model;
    }

    generateTemplate(){
        this.#template = `<div>Dummy</div>`;
        return this.#template;
    }

    insertTemplates() {

    }

}
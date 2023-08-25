export default class IeecloudDummyRenderer {
    #node;
    constructor(node) {
        this.#node = node;
    }

    generateTemplate(){
       return `<div>Dummy ${(this.#node.text)} </div>`;
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());
    }

}
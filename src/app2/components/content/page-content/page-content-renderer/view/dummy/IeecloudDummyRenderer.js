export default class IeecloudDummyRenderer {
    #node;
    #container;
    constructor(node) {
        this.#node = node;
    }

    generateTemplate(){
       return `<div>Dummy ${(this.#node.text)} </div>`;
    }

    render(container) {
        const scope = this;
        scope.#container = container;
        scope.#container.innerHTML = '';
        scope.#container.insertAdjacentHTML('beforeend', scope.generateTemplate());
    }

    destroy() {
        const scope = this;
        if (scope.#container) {
            scope.#container.innerHTML = '';
        }
    }

}
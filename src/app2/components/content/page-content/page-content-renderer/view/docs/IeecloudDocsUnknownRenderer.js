import unknownFile from './image/unknown-file.jpg'
export default class IeecloudDocsUnknownRenderer {
    #node;
    #container;

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        return `<div id="wrapper-unknown-${this.#node.id}">
<img  style="width:100%"  src="${unknownFile}"
                                            alt="...">
</div>`;
    }

    destroy()
    {
        const scope = this;
        if (scope.#container) {
            scope.#container.innerHTML = '';
        }
    }

    render(container) {
        const scope = this;
        scope.#container = container;
        scope.#container.innerHTML = '';
        scope.#container.insertAdjacentHTML('beforeend', scope.generateTemplate());

    }
}
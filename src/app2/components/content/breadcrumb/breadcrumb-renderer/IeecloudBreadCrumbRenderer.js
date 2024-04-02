import EventDispatcher from "../../../../main/events/EventDispatcher.js";

export default class IeecloudBreadCrumbRenderer extends EventDispatcher {
    #viewModel;
    #container;

    constructor() {
        super();
    }

    generateTemplate() {
        let template = ``;
        const nodePath = this.#viewModel;
        const size = nodePath.length;
        nodePath.forEach(function (item, index) {
            if (index === size - 1) {
                template = template + `<li class="breadcrumb-item active" id="breadcrumb-` + item.id + `" aria-current="page">` + item.name + `</li>`
                return;
            }
            template = template + `<li class="breadcrumb-item"><a href="javascript:void(0)"   id="breadcrumb-` + item.id + `">` + item.name + `</a></li>`
        })


        return template;
    }

    destroy(){
        if (this.#container) {
            this.#container.innerHTML = '';
        }
    }

    render(systemModel, containerId) {
        this.#removeDomEventListeners();
        this.#viewModel = systemModel;

        this.#container = document.querySelector("#" + containerId);
        const template = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', template);
        this.#addDomEventListeners();
    }

    #removeDomEventListeners() {
        const scope = this;
        const nodePath = this.#viewModel;
        nodePath?.forEach(function (item, index) {
            const breadcrumbItem = document.querySelector("#breadcrumb-" + item.id);
            breadcrumbItem?.removeEventListener('click', scope.#breadcrumbItemListener(item.id));
        });
    }

    #addDomEventListeners() {
        const scope = this;
        const nodePath = this.#viewModel;
        nodePath.forEach(function (item, index) {
            const breadcrumbItem = document.querySelector("#breadcrumb-" + item.id);
            breadcrumbItem?.addEventListener('click', scope.#breadcrumbItemListener(item.id));
        });
    }

    #breadcrumbItemListener(nodeId) {
        const scope = this;
        return function (event) {
            scope.dispatchEvent({type: 'IeecloudBreadCrumbRenderer.itemClicked', value: nodeId});
        };
    }
}
import {eventBus} from "../../../../main/index.js";

export default class IeecloudBreadCrumbRenderer {
    #viewModel;
    #container;
    #controller;

    constructor(controller, containerId) {
        const scope = this;
        this.#container = document.querySelector("#" + containerId);
        this.#controller = controller;
        eventBus.on('IeecloudTableRenderer.rowClick', function (data) {
            scope.#controller.goToNewState(data);
        });

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
            template = template + `<li class="breadcrumb-item"><a href="#"  id="breadcrumb-` + item.id + `">` + item.name + `</a></li>`
        })


        return template;
    }

    render(systemModel) {
        this.#viewModel = systemModel;
        this.#container.innerHTML = '';
        const template = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', template);
        this.#addDomEventListeners();
    }

    #addDomEventListeners() {
        const scope = this;
        const nodePath = this.#viewModel;
        nodePath.forEach(function (item, index) {
            const breadcrumbItem = document.querySelector("#breadcrumb-" + item.id);
            breadcrumbItem?.addEventListener('click', function (event) {
                scope.#controller.goToNewStateById(item.id);
            });
        });
    }
}
import IeecloudSideBarModelMapper from "./IeecloudSideBarModelMapper.js";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudSideBarRenderer extends EventDispatcher {

    #viewModel;
    #itemsTemplate = ``;
    #itemsElements = [];
    #container;
    #mapper;
    #activeNode;


    constructor(containerId) {
        super();
        this.#mapper = new IeecloudSideBarModelMapper()
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        let template = ` <div class="sidebar-content">
       <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        </ul></div>`

        this.generateChild();

        return template;
    }

    generateChild() {
        this.#itemsTemplate = '';
        this.#viewModel.nodes.forEach(node => {
            this.#itemsTemplate = this.#itemsTemplate + `<hr class="sidebar-divider"><!-- Heading -->
          <div class="sidebar-heading">
            ` + node.text + `
          </div>`;
            this.#generateChildTemplate(node);
        });
    }

    render(activeNode, systemModel) {
        this.#container.innerHTML = ''

        this.#viewModel = this.#mapper.map(systemModel);
        this.#activeNode = activeNode;
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);

        const containerElement = document.querySelector("#accordionSidebar");
        containerElement.innerHTML = ''

        containerElement.insertAdjacentHTML('afterbegin', this.#itemsTemplate);
        this.#addDomEventListeners();
    }

    redraw(activeNode) {
        this.#removeDomEventListeners();
        this.#itemsElements = [];
        const containerElement = document.querySelector("#accordionSidebar");
        containerElement.innerHTML = ''
        this.#activeNode = activeNode;
        this.generateChild();

        containerElement.insertAdjacentHTML('afterbegin', this.#itemsTemplate);
        this.#addDomEventListeners();
    }

    #generateChildTemplate(node) {

        if (node.children && node.children.length > 0) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                const clazz = child.id === this.#activeNode?.id ? "active" : "";
                this.#itemsTemplate = this.#itemsTemplate + `<!-- Nav Item - Pages Collapse Menu -->

          <li class="nav-item ` + clazz + `">
            <a class="nav-link" href="javascript:void(0)" id="sidemenu-item-` + child.id + `">
              <i class="` + child.icon + `"></i>
              <span> ` + child.text + `</span>
            </a>
          </li>`;
                this.#generateChildTemplate(child);

                this.#itemsElements.push(child);

            }
        }

    }

    #addDomEventListeners() {
        const scope = this;
        this.#itemsElements.forEach(function (node) {
            const menuItem = document.querySelector("#sidemenu-item-" + node.id);
            menuItem?.addEventListener('click', scope.sideBarMenuListener(node));
        });
    }

    #removeDomEventListeners() {
        const scope = this;
        this.#itemsElements.forEach(function (node) {
            const menuItem = document.querySelector("#sidemenu-item-" + node.id);
            menuItem?.removeEventListener('click', scope.sideBarMenuListener(node));
        });
    }

    sideBarMenuListener(node) {
        const scope = this;
        return function (event) {
            scope.dispatchEvent({type: 'IeecloudSideBarRenderer.itemClicked', value: node});
        };
    }
}
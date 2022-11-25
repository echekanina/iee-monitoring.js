import IeecloudSideBarModelMapper from "./IeecloudSideBarModelMapper.js";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudSideBarRenderer extends EventDispatcher {

    #viewModel;
    #itemsTemplate = ``;
    #itemsElements = [];
    #container;
    #mapper;


    constructor(containerId) {
        super();
        this.#mapper = new IeecloudSideBarModelMapper()
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        let template = ` <div class="sidebar-content">
       <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        </ul></div>`

        this.#viewModel.nodes.forEach(node => {
            this.#itemsTemplate = this.#itemsTemplate + `<hr class="sidebar-divider"><!-- Heading -->
          <div class="sidebar-heading">
            ` + node.text + `
          </div>`;
            this.#generateChildTemplate(node);
        });

        return template;
    }

    render(systemModel) {
        this.#viewModel = this.#mapper.map(systemModel);
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);
        const containerElement = document.querySelector("#accordionSidebar");
        containerElement.insertAdjacentHTML('afterbegin', this.#itemsTemplate);
        this.#addDomEventListeners();
    }

    #generateChildTemplate(node) {

        if (node.children && node.children.length > 0) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                this.#itemsTemplate = this.#itemsTemplate + `<!-- Nav Item - Pages Collapse Menu -->
          <li class="nav-item">
            <a class="nav-link" href="#" id="sidemenu-item-` + child.id + `">
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
            menuItem?.addEventListener('click', function (event) {
                // scope.#buildPageContent(node);
                scope.dispatchEvent({type: 'IeecloudSideBarRenderer.itemClicked', value: node});
            });
        });
    }

    // #buildPageContent(node) {
    //     const scope = this;
    //     eventBus.removeAllListeners();
    //     const contentWrapperElement = document.querySelector("#content-tree-wrapper");
    //     this.#contentRenderer = new IeecloudContentRenderer();
    //     const containerService = new IeecloudContentService('http://127.0.0.1:3000');
    //     containerService.getContentScheme('content-scheme.json', function (schemeModel) {
    //
    //         scope.#contentRenderer.rootElements = schemeModel.rootElements;
    //
    //
    //         containerService.getContentData('tree-model-2022-11-22_17_33_03_152.json', function (treeData) {
    //
    //             const treeImplInstance = new IeecloudTreeInspireImpl();
    //             scope.#contentRenderer.treeController = treeImplInstance;
    //             treeImplInstance.createTree(treeData);
    //
    //             treeImplInstance.on('tree.redrawTree', function (contentTreeModel) {
    //
    //                 scope.#contentRenderer.ieecloudTreeModel = contentTreeModel;
    //
    //                 scope.#contentRenderer.render(contentWrapperElement)
    //             });
    //         });
    //     });
    //     //     contentWrapperElement.innerHTML = '';
    //
    // }
}
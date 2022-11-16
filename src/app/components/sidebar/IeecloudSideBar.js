import IeecloudContent from "../content/IeecloudContent.js";
import IeecloudObserveObject from "../content/IeecloudObserveObject.js";
import { cloneDeep } from 'lodash-es';

export default class IeecloudSideBar {
    model;
    #itemsTemplate = ``;
    #nameTemplate = ``;
    #layout;

    constructor(model, layout) {
        this.model = model;
        this.#layout = layout;
    }

    generateTemplate() {
        let template = ` <div class="sidebar-content">
       <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        </ul></div>`


        this.#nameTemplate = ``

        this.model.children.forEach((node) => {
            this.#itemsTemplate = this.#itemsTemplate + `<hr class="sidebar-divider"><!-- Heading -->
          <div class="sidebar-heading">
            ` + node.name + `
          </div>`;

            this.#generateChildTemplate(node);
        });

        return template;

    }

    #generateChildTemplate(node) {

        if (node.children && node.children.length > 0) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                this.#itemsTemplate = this.#itemsTemplate + `<!-- Nav Item - Pages Collapse Menu -->
          <li class="nav-item">
            <a class="nav-link" href="#" id="sidemenu-item-` + child.id + `">
              <i class="` + child.icon + `"></i>
              <span> ` + child.name + `</span>
            </a>
          </li>`;
                this.#generateChildTemplate(child);

            }
        }

    }

    insertTemplates() {
        const containerElement = document.querySelector("#accordionSidebar");
        containerElement.insertAdjacentHTML('afterbegin', this.#itemsTemplate);
        containerElement.insertAdjacentHTML('afterbegin', this.#nameTemplate);
        this.addEventListeners();


    }

    addEventListeners() {
        const scope = this;
        this.model.children.forEach(function (mainItem) {
            mainItem.children.forEach(function (item) {
                const menuItem = document.querySelector("#sidemenu-item-" + item.id);
                menuItem?.addEventListener('click', function (event) {
                    const contentLayout = scope.#layout[item.id];
                    const contentWrapperElement = document.querySelector("#content-sub-wrapper");
                    scope.destroyPageContent(contentWrapperElement);
                    if (contentLayout) {
                        scope.#buildPageContent(item, contentWrapperElement);
                    }
                });
            });
        })
    }

    destroyPageContent(contentWrapperElement) {
        const childNodes = contentWrapperElement.childNodes;
        let i = childNodes.length;
        while (i--) {
            contentWrapperElement.removeChild(childNodes[i]);
        }
    }

    #buildPageContent(item, contentWrapperElement) {
        const scope = this;
        let observableObject = new IeecloudObserveObject(item);
        const content = new IeecloudContent(scope.#layout[item.id], observableObject);
        const contentTemplate = content.generateTemplate();
        contentWrapperElement?.insertAdjacentHTML('afterbegin', contentTemplate);
        content.insertTemplates();
        observableObject.on('IeecloudTable.rowClick', function (groupId) {
            const contentWrapperElement = document.querySelector("#content-sub-wrapper");
            scope.destroyPageContent(contentWrapperElement);
            observableObject.removeAllListeners();
            // TODO : think about it!!!!!
            let moduleItemModel = cloneDeep(item);
            // TODO: remove hardcode
            moduleItemModel.id='prop';
            moduleItemModel.data.groupId = groupId;
            scope.#buildPageContent(moduleItemModel, contentWrapperElement);

        });

        observableObject.on('IeecloudBreadCrumb.click', function (groupId) {
            const contentWrapperElement = document.querySelector("#content-sub-wrapper");
            scope.destroyPageContent(contentWrapperElement);
            observableObject.removeAllListeners();
            // TODO : think about it!!!!!
            let moduleItemModel = cloneDeep(item);
            // TODO: remove hardcode
            moduleItemModel.id='mo1';
            moduleItemModel.data.groupId = groupId;
            scope.#buildPageContent(moduleItemModel, contentWrapperElement);

        });
    }
}
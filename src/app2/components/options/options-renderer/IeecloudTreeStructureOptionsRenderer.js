import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudTreeStructureOptionsRenderer extends EventDispatcher {
    #container;
    #treeSettingsViewModel;
    #schemeModel;

    constructor(containerId, schemeModel) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#schemeModel = schemeModel;
    }

    generateTemplate(treeSettingsViewModel) {
        const scope = this;
        let template = `<div class="accordion accordion-flush" id="accordion-tree-settings">`;

        let index = 0;
        for (let setting in treeSettingsViewModel) {
            const settingAccordionItem = treeSettingsViewModel[setting];
            let headerClazz = index === 0 ? "" : "collapsed";
            let bodyClazz = index === 0 ? "show" : "";
                template = template + `<div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne-${setting}-${settingAccordionItem.id}">
      <button class="accordion-button ${headerClazz}" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne-${setting}-${settingAccordionItem.id}" aria-expanded="false" aria-controls="flush-collapseOne-${setting}-${settingAccordionItem.id}">
       ${treeSettingsViewModel[setting].label}
      </button>
    </h2>
    <div id="flush-collapseOne-${setting}-${settingAccordionItem.id}" class="accordion-collapse collapse  ${bodyClazz}" aria-labelledby="flush-headingOne-${setting}-${settingAccordionItem.id}" data-bs-parent="#accordion-tree-settings">
      <div class="accordion-body"> ${scope.#buildListGroup(treeSettingsViewModel[setting].listGroup)}</div>
    </div>
  </div>`
            index = index + 1;
        }

        template = template + `</div>`;
        return template;

    }

    render(treeSettingsViewModel) {
        const scope = this;
        this.#container.innerHTML = '';

        this.#treeSettingsViewModel = treeSettingsViewModel;

        const template = this.generateTemplate(scope.#treeSettingsViewModel);
        this.#container?.insertAdjacentHTML('afterbegin', template);
        this.#addDomListeners();
    }

    destroy() {
        this.#removeDomListeners();
        if (this.#container) {
            this.#container.innerHTML = '';
        }
    }

    #addDomListeners() {
        const scope = this;
        for (let setting in scope.#treeSettingsViewModel) {
            if (scope.#treeSettingsViewModel[setting].listGroup) {
                scope.#goThroughInputGroupItems(scope.#treeSettingsViewModel[setting].listGroup, function (listGroupItem) {
                    if (listGroupItem.selectGroup) {
                        listGroupItem.selectGroup.renderer.addDomListeners();
                    } else if (listGroupItem.searchGroup) {
                        listGroupItem.searchGroup.renderer.addDomListeners();
                    }
                });
            }
        }
    }

    #buildListGroup(listGroup) {
        let template = ``
        if (listGroup) {
            template = template + `<div class="list-group">`
            listGroup.forEach(function (listGroupItem) {

                if (listGroupItem.selectGroup) {
                    template = template + `  <div href="javascript:void(0)" class="list-group-item d-flex justify-content-between align-items-center">
                     <span>${listGroupItem.label}</span>` + listGroupItem.selectGroup.renderer.generateTemplate() + `</div>`;

                } else if (listGroupItem.searchGroup) {
                    template = template + `  <div href="javascript:void(0)" class="list-group-item d-flex justify-content-between align-items-center">
                     <span>${listGroupItem.label}</span>` + listGroupItem.searchGroup.renderer.generateTemplate() + `</div>`;
                }

            });
            template = template + `</div>`;
        }
        return template;
    }

    #goThroughInputGroupItems(listGroup, callBack) {
        listGroup.forEach(function (listGroupItem) {
            callBack(listGroupItem);

        });
    }

    #removeDomListeners() {
        const scope = this;
        for (let setting in scope.#treeSettingsViewModel) {
            if (scope.#treeSettingsViewModel[setting].listGroup) {
                scope.#goThroughInputGroupItems(scope.#treeSettingsViewModel[setting].listGroup, function (listGroupItem) {
                    if (listGroupItem.selectGroup) {
                        listGroupItem.selectGroup.renderer.removeDomListeners();
                    }
                });
            }
        }
    }
}
import EventDispatcher from "../../../main/events/EventDispatcher.js";
import {isEmpty} from "lodash-es";

export default class IeecloudPageContentOptionsRenderer extends EventDispatcher {
    #container;
    #layoutContent;
    #detailSettingsViewModel;
    #schemeModel;

    constructor(containerId, schemeModel) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#schemeModel = schemeModel;

    }


    generateTemplate(detailSettingsViewModel) {
        const scope = this;
        let template = `<div class="accordion accordion-flush" id="accordion-details-settings">`;
        let index = 0;
        for (let setting in detailSettingsViewModel) {
            const settingAccordionItem = detailSettingsViewModel[setting];
            let headerClazz = index === 0 ? "" : "collapsed";
            let bodyClazz = index === 0 ? "show" : "";
            template = template + `<div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne-${setting}-${settingAccordionItem.id}">
      <button class="accordion-button ${headerClazz}" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne-${setting}-${settingAccordionItem.id}" aria-expanded="true" aria-controls="flush-collapseOne-${setting}-${settingAccordionItem.id}">
      ${settingAccordionItem.label}
      </button>
    </h2>
    <div id="flush-collapseOne-${setting}-${settingAccordionItem.id}" class="accordion-collapse  collapse ${bodyClazz}" aria-labelledby="flush-headingOne-${setting}-${settingAccordionItem.id}" data-bs-parent="#accordion-details-settings">
      <div class="accordion-body">${scope.#buildAccordionItemBody(settingAccordionItem)} </div>
    </div>
  </div>`
            index = index + 1;

        }
        template = template + `</div>`;
        return template;
    }

    #buildAccordionItemBody(settingAccordionItem) {
        const scope = this;
        let template = ``;
        if (settingAccordionItem.listGroup.length > 0) {
            template = template + scope.#buildListGroup(settingAccordionItem.listGroup)
        }
        if (!isEmpty(settingAccordionItem.accordionMap)) {
            const accordionMap = settingAccordionItem.accordionMap;
            const accordionKeys = Object.keys(accordionMap);
            if (accordionKeys.length > 1) {
                template = template + `<div class="accordion accordion-flush" id="accordion-details-settings-nested-` + settingAccordionItem.id + `">`;
                let index = 0;
                for (let key in accordionMap) {
                    const childSettingAccordionItem = accordionMap[key];
                    let headerClazz = index === 0 ? "" : "collapsed";
                    let bodyClazz = index === 0 ? "show" : "";
                    template = template + `<div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne1-${key}-${childSettingAccordionItem.id}">
      <button class="accordion-button ${headerClazz}" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne1-${key}-${childSettingAccordionItem.id}" aria-expanded="false" aria-controls="flush-collapseOne1-${key}-${childSettingAccordionItem.id}">
      ${childSettingAccordionItem.label}
      </button>
    </h2>
    <div id="flush-collapseOne1-${key}-${childSettingAccordionItem.id}" class="accordion-collapse  collapse ${bodyClazz}" aria-labelledby="flush-headingOne1-${key}-${childSettingAccordionItem.id}" data-bs-parent="#accordion-details-settings-nested-${settingAccordionItem.id}">
      <div class="accordion-body">${scope.#buildListGroup(childSettingAccordionItem.listGroup)} </div>
    </div>
  </div>`
                    index = index + 1;
                }


            } else {
                template = template + scope.#buildListGroup(accordionMap[accordionKeys[0]].listGroup);
            }
        }
        return template
    }

    #buildListGroup(listGroup) {
        let template = ``
        if (listGroup) {
            template = template + `<div class="list-group">`
            listGroup.forEach(function (listGroupItem) {

                if (listGroupItem.selectGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex justify-content-between align-items-center">
                     <span>${listGroupItem.label}  </span>` + listGroupItem.selectGroup.renderer.generateTemplate() + `</div>`;

                }

            });
            template = template + `</div>`;
        }
        return template;
    }


    render(detailSettingsViewModel) {
        const scope = this;
        this.#container.innerHTML = '';

        this.#detailSettingsViewModel = detailSettingsViewModel;

        const template = this.generateTemplate(detailSettingsViewModel);
        this.#container?.insertAdjacentHTML('afterbegin', template);
        this.#addDomListeners();
    }

    destroy() {
        this.#removeDomListeners();
        if (this.#container) {
            this.#container.innerHTML = '';
        }

    }


    #removeDomListeners() {
        const scope = this;
        for (let setting in scope.#detailSettingsViewModel) {
            scope.#goThroughInputGroupItems(scope.#detailSettingsViewModel[setting], function (listGroupItem) {
                if (listGroupItem.selectGroup) {
                    listGroupItem.selectGroup.renderer.removeDomListeners();
                }
            });
        }
    }

    #goThroughInputGroupItems(accordionBodyItem, callBack) {
        const scope = this;
        accordionBodyItem.listGroup?.forEach(function (listGroupItem) {
            callBack(listGroupItem)

        });
        const nestedAccordion = accordionBodyItem.accordionMap;
        if (nestedAccordion) {
            for (let setting in nestedAccordion) {
                scope.#goThroughInputGroupItems(nestedAccordion[setting], callBack);
            }
        }
    }

    #addDomListeners() {
        const scope = this;
        for (let setting in scope.#detailSettingsViewModel) {
            scope.#goThroughInputGroupItems(scope.#detailSettingsViewModel[setting], function (listGroupItem) {
                if (listGroupItem.selectGroup) {
                    listGroupItem.selectGroup.renderer.addDomListeners();
                }
            });
        }
    }
}
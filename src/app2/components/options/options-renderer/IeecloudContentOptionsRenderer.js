import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudContentOptionsRenderer extends EventDispatcher {
    #container;
    #layoutContent;

    constructor(containerId) {
        super();
        this.#container = document.querySelector("#" + containerId);
        const resetBtn = document.querySelector("#reset-options");
        const scope = this;

        resetBtn?.addEventListener('click', function () {
            scope.dispatchEvent({type: 'IeecloudContentOptionsRenderer.resetOptions'});
        });
    }

    #buildListGroup(listGroup) {
        let template = ``
        const scope = this;
        if (listGroup) {
            template = template + `<div class="list-group">`
            listGroup.forEach(function (listGroupItem) {

                if (listGroupItem.selectGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex justify-content-between align-items-center">
<span>${listGroupItem.label}  </span>  <select class="form-select form-select-sm" id="select_${listGroupItem.id}"  aria-label=".form-select-sm example">
                       `
                    listGroupItem.selectGroup.options.forEach(function (optionModel) {
                        let selectedAttr = optionModel.selected ? 'selected' : ''
                        template = template + ` <option value="${optionModel.key}" ${selectedAttr}>${optionModel.value}</option>`
                    });
                    template = template + ` </select></div>`;

                } else {
                    if (listGroupItem.listGroup && listGroupItem.listGroup.length > 0) {
                        template = template + ` <a href="#" class="list-group-item">${listGroupItem.label}</a>`
                        template = template + scope.#buildListGroup(listGroupItem.listGroup);
                    }
                }

            });
            template = template + `</div>`;
        }
        return template;
    }


    generateTemplate(layoutContent) {
        const scope = this;
        let template = `<div class="list-group">`;
        for (let schemeId in layoutContent) {


            template = template + ` <a href="#" class="list-group-item main-item">${layoutContent[schemeId].label}</a>`

            if (layoutContent[schemeId].listGroup) {
                template = template + `<div class="list-group">`
                layoutContent[schemeId].listGroup.forEach(function (listGroupItem) {

                    if (listGroupItem.id === schemeId + '_' + 'empty' + '_dialog' && schemeId !== "e751df2a-object-element-sensor") {
                        return;
                    }

                    if (listGroupItem.selectGroup) {
                        template = template + `  <div href="#" class="list-group-item d-flex justify-content-between align-items-center">
<span>${listGroupItem.label}  </span>  <select class="form-select form-select-sm"  id="select_${listGroupItem.id}" aria-label=".form-select-sm example">
                       `
                        listGroupItem.selectGroup.options.forEach(function (optionModel) {
                            let selectedAttr = optionModel.selected ? 'selected' : ''
                            template = template + ` <option value="${optionModel.key}" ${selectedAttr}>${optionModel.value}</option>`
                        });
                        template = template + ` </select></div>`;

                    } else {

                        if (listGroupItem.listGroup && listGroupItem.listGroup.length > 0) {
                            if (listGroupItem.listGroup.length > 1) {
                                template = template + ` <a href="#" class="list-group-item">${listGroupItem.label}</a>`
                            }

                            template = template + scope.#buildListGroup(listGroupItem.listGroup);
                        }
                    }

                });
                template = template + `</div>`;
            }

        }

        template = template + `</div>`;
        return template;


    }


    render(layoutContent) {
        const scope = this;
        this.#container.innerHTML = '';

        this.#layoutContent = layoutContent;

        const template = this.generateTemplate(scope.#layoutContent);
        this.#container?.insertAdjacentHTML('afterbegin', template);
        this.#addDomListeners(scope.#layoutContent);
    }

    #addDomListeners(layoutContent) {
        const scope = this;

        for (let schemeId in layoutContent) {
            if (layoutContent[schemeId].listGroup) {
                scope.#goThroughInputGroupItems(schemeId, layoutContent[schemeId].listGroup,
                    function (listGroupItem) {
                        const select = document.querySelector("#select_" + listGroupItem.id);
                        if (select) {
                            // select.addEventListener('change', scope.#selectOptionListener);
                            select.addEventListener('change', scope.#selectOptionListener);
                        }
                    });
            }
        }
    }

    #selectOptionListener = (event) => {
        let selectData = event.target.id.split('_');
        const scope = this;
        let data = {
            value: event.target.value,
            schemeId: selectData[1],
            model: selectData[3],
            widgetId: selectData[2]
        }
        scope.dispatchEvent({type: 'IeecloudContentOptionsRenderer.selectChanged', value: data});
    }

    #removeDomListeners(layoutContent) {
        const scope = this;

        for (let schemeId in layoutContent) {
            if (layoutContent[schemeId].listGroup) {
                scope.#goThroughInputGroupItems(schemeId, layoutContent[schemeId].listGroup,
                    function (listGroupItem) {
                        const select = document.querySelector("#select_" + listGroupItem.id);
                        if (select) {
                            select.removeEventListener('change', scope.#selectOptionListener);
                        }
                    });
            }
        }
    }

    #goThroughInputGroupItems(schemeId, listGroup, callBack) {
        const scope = this;
        listGroup.forEach(function (listGroupItem) {
            if (listGroupItem.selectGroup) {
                const select = document.querySelector("#select_" + listGroupItem.id);
                if (select) {
                    callBack(listGroupItem);
                }
            }

            if (listGroupItem.listGroup && listGroupItem.listGroup.length > 0) {
                scope.#goThroughInputGroupItems(schemeId, listGroupItem.listGroup, callBack);
            }
        });
    }

    destroy() {
        this.#removeDomListeners(this.#layoutContent);
        if (this.#container) {
            this.#container.innerHTML = '';
        }

    }
}
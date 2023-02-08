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
                     <span>${listGroupItem.label}  </span>  <div class="dropdown" id="select_${listGroupItem.id}">
<form class="form-inline me-auto  settings-select " autocomplete="off"   data-bs-toggle="dropdown"  >
    <div class="input-group input-group-joined input-group-solid ">
        <input class="form-control pe-0 " type="text"  value="${listGroupItem.selectGroup.inputValue}" readonly="readonly" id="input_${listGroupItem.id}" autocomplete="off" style="cursor: pointer">
        <div class="input-group-text dropdown-toggle" style="cursor: pointer">
        </div>
    </div>
</form>
  <ul class="dropdown-menu">
                       `
                    listGroupItem.selectGroup.options.forEach(function (optionModel) {
                        let clazz = optionModel.selected ? "active" : "";
                        template = template + ` <li><a class="dropdown-item ${clazz}" href="#" value="${optionModel.key}">${optionModel.value}</a></li>`
                    });
                    template = template + ` </ul></div></div>`;

                } else {
                    if (listGroupItem.listGroup && listGroupItem.listGroup.length > 0) {
                        if (!listGroupItem.id?.includes('-widgets') || listGroupItem.listGroup.length > 1) {
                            template = template + ` <a href="#" class="list-group-item">${listGroupItem.label}</a>`
                        }
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
                + scope.#buildListGroup(layoutContent[schemeId].listGroup);
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
                        const dropdown = document.getElementById("select_" + listGroupItem.id);
                        if (dropdown) {
                            dropdown?.addEventListener('hidden.bs.dropdown',  scope.#selectOptionListener)
                        }
                    });
            }
        }
    }

    #selectOptionListener = (event) => {
        if (event && event.clickEvent && event.clickEvent.target) {
            const dropDownItem = event.clickEvent.target
            if(dropDownItem.classList.contains('dropdown-item')){
                const selectedValue = dropDownItem.getAttribute('value');
                const selectedText = dropDownItem.text;

                let children = dropDownItem.parentNode?.parentNode?.querySelectorAll('.dropdown-item');
                if(children && children.length > 0){
                    children.forEach(function(child){
                        child.classList.remove( 'active' )
                    });
                }
                dropDownItem.classList.add( 'active' )
                if(event.target?.parentNode && event.target?.parentNode.classList.contains('dropdown') ) {
                    const dropdown = event.target?.parentNode;
                    let selectData = dropdown.id.split('_');
                    const scope = this;
                    let data = {
                        text: selectedText,
                        value: selectedValue,
                        schemeId: selectData[1],
                        model: selectData[3],
                        widgetId: selectData[2]
                    }
                    scope.dispatchEvent({type: 'IeecloudContentOptionsRenderer.selectChanged', value: data});
                }
            }
        }
    }

    setDropDownInputValue(data){
        const inputElement = document.getElementById("input_" + data.schemeId + '_' + data.widgetId + '_' + data.model);
        if(inputElement){
            inputElement.value = data.text;
        }
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
import {v4 as uuidv4} from "uuid";
import EventDispatcher from "../../../main/events/EventDispatcher.js";
import Dropdown from "bootstrap/js/src/dropdown.js";

export class IeecloudAutoCompleteRenderer extends EventDispatcher {
    #container;
    #uuid;
    #matchedNodes;
    #searchModel;

    constructor(containerId, searchModel) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#searchModel = searchModel;
    }

    get searchModel(){
        return this.#searchModel;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `
                    <form class="form-inline me-auto w-100 navbar-search" autocomplete="off"  id="autocomplete-form-` + this.#uuid + `" >
    <div class="input-group input-group-joined input-group-solid">
        <input class="form-control pe-0" readonly="readonly" value="${this.#searchModel?.inputValue ? this.#searchModel?.inputValue : ''}"  placeholder="Выбор" aria-label="Выбор" id="autocomplete-result-node-input-node-` + this.#uuid + `" autocomplete="off">
      <div class="input-group-text dropdown-toggle" style="cursor: pointer">
        </div>   
    </div>
</form>
<ul class="dropdown-menu" id="search-results-dropdown-` + this.#uuid + `">
<div>
  <div class="input-group input-group-joined input-group-solid" style="width: inherit;
    margin-left: 0.5rem;
    margin-right: 0.5rem;">
<input class="form-control pe-0"   placeholder="Поиск" aria-label="Поиск" id="autocomplete-search-node-input-node-` + this.#uuid + `" autocomplete="off">
 </div>
 </div>
<div id="autocomplete-results-dropdown-` + this.#uuid + `"></div>
  </ul>
`;
    }

    render() {
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);
        this.addDomListeners();
    }

    addDomListeners() {
        const scope = this;

        const searchNodeInput = document.querySelector("#autocomplete-search-node-input-node-" + this.#uuid);
        searchNodeInput?.addEventListener("input", function (event) {
            const inputValue = event.target.value;
            scope.dispatchEvent({type: 'IeecloudAutoCompleteRenderer.autoComplete', value: inputValue});
        });
        const searchNodeInputResult = document.querySelector("#autocomplete-result-node-input-node-" + this.#uuid);
        searchNodeInputResult?.addEventListener("focus", function (event) {
            scope.dispatchEvent({type: 'IeecloudAutoCompleteRenderer.fullList'});
        });

        document.addEventListener('click', scope.#documentClickListener);
    }

    destroy() {
        const scope = this;
        document.removeEventListener('click', scope.#documentClickListener);
    }

    #documentClickListener = (event) => {
        const scope = this;
        if (event.target.id !== "autocomplete-search-node-input-node-" + this.#uuid &&
            event.target.id !== "autocomplete-result-node-input-node-" + this.#uuid) {
            const autoComplete = document.querySelector("#autocomplete-form-" + scope.#uuid);
            if (autoComplete) {
                const searchNodeInput = document.querySelector("#autocomplete-search-node-input-node-" + this.#uuid);
                if(searchNodeInput){
                    searchNodeInput.value = '';
                }
                let dropdown = new Dropdown(autoComplete);
                dropdown.hide();
            }
        }
    }

    drawAutoComplete(nodes) {
        const scope = this;

        if (scope.#matchedNodes && scope.#matchedNodes.length > 0) {
            scope.#matchedNodes.forEach(function (item) {
                const nodeItem = document.querySelector("#node-result-" + scope.#uuid + "-" + item.id);
                nodeItem?.removeEventListener('click', scope.#dispatchActiveItem(scope, item));
            });
        }

        scope.#matchedNodes = [];
        scope.#matchedNodes = nodes;

        const searchResultContainer = document.querySelector("#autocomplete-results-dropdown-" + scope.#uuid);

        const autoComplete = document.querySelector("#autocomplete-form-" + scope.#uuid);
        let dropdown = new Dropdown(autoComplete);

        let template = ``
        if (nodes.length === 0) {
            template = template + `<li><a class="dropdown-item" id="node-result-` + this.#uuid + `" href="#">Нет данных</a></li>`
        }


        nodes.forEach(function (item) {
            template = template + `<li><a class="dropdown-item" id="node-result-` + scope.#uuid + `-` + item.id + `" href="#">` + item.name + `</a></li>`
        });

        searchResultContainer.innerHTML = '';

        searchResultContainer?.insertAdjacentHTML('afterbegin', template);

        nodes.forEach(function (item) {
            const nodeItem = document.getElementById("node-result-" + scope.#uuid + "-" + item.id);
            nodeItem?.addEventListener('click', scope.#dispatchActiveItem(item));
        });

        dropdown.show();

        const searchNodeInput = document.querySelector("#autocomplete-search-node-input-node-" + this.#uuid);
        searchNodeInput?.focus();
    }

    #dispatchActiveItem(item) {
        const scope = this;
        return function (event) {
            scope.#buildActiveItemDataAndDispatch(scope, item);
        };
    }

    #buildActiveItemDataAndDispatch(scope, item) {
        if (scope.#searchModel?.updateInputAfterSelectItem) {
            scope.#setInputSearchValue(item.name);
        }

        let data = {
            value: item.id,
            valueName: item.name,
            selectGroupData: scope.#searchModel?.selectGroupData,
            model: scope.#searchModel?.model
        }
        scope.dispatchEvent({type: 'IeecloudAutoCompleteRenderer.setActiveNode', value: data});
    }

    doActiveItem(item){
        const scope = this;
        scope.#buildActiveItemDataAndDispatch(scope, item);
    }

    #setInputSearchValue(inputValue) {
        const scope = this;
        const searchResultNodeInput = document.querySelector("#autocomplete-result-node-input-node-" + scope.#uuid);
        const searchNodeInput = document.querySelector("#autocomplete-search-node-input-node-" + this.#uuid);
        if (searchResultNodeInput) {
            searchResultNodeInput.value = inputValue;
        }

        if (searchNodeInput) {
            searchNodeInput.value = '';
        }
    }

    clearValue() {
        const scope = this;
        const searchResultNodeInput = document.querySelector("#autocomplete-result-node-input-node-" + scope.#uuid);
        if (searchResultNodeInput) {
            searchResultNodeInput.value =  '';
        }
    }
}
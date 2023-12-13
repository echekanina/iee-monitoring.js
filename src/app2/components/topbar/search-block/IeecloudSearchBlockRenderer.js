import {v4 as uuidv4} from "uuid";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

export class IeecloudSearchBlockRenderer extends EventDispatcher {
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
                    <form class="form-inline me-auto w-100 navbar-search" autocomplete="off"  id="search-form-` + this.#uuid + `" data-bs-toggle="dropdown">
    <div class="input-group input-group-joined input-group-solid">
        <input class="form-control pe-0" type="text"  value="${this.#searchModel?.inputValue ? this.#searchModel?.inputValue : ''}"  placeholder="Поиск" aria-label="Поиск" id="search-node-input-node-` + this.#uuid + `" autocomplete="off">
        <div class="input-group-text " id="search-node-button-` + this.#uuid + `" style="cursor: pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-search">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
    </div>
</form>
<ul class="dropdown-menu" id="search-results-dropdown-` + this.#uuid + `">
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
        const searchNodeBtn = document.querySelector("#search-node-button-" + this.#uuid);
        searchNodeBtn?.addEventListener('click', function (event) {
            const searchNodeInput = document.querySelector("#search-node-input-node-" + scope.#uuid);
            scope.dispatchEvent({type: 'IeecloudSearchBlockRenderer.searchNode', value: searchNodeInput?.value});
        });

        const searchNodeInput = document.querySelector("#search-node-input-node-" + this.#uuid);
        searchNodeInput?.addEventListener("input", function (event) {
            const inputValue = event.target.value;
            scope.dispatchEvent({type: 'IeecloudSearchBlockRenderer.searchNode', value: inputValue});
        });

        searchNodeInput?.addEventListener("focus", function (event) {
            const inputValue = event.target.value;
            scope.dispatchEvent({type: 'IeecloudSearchBlockRenderer.searchNode', value: inputValue});
        });
    }

    drawAutoComplete(nodes) {
        const scope = this;

        if (scope.#matchedNodes && scope.#matchedNodes.length > 0) {
            scope.#matchedNodes.forEach(function (item) {
                const nodeItem = document.querySelector("#node-result-" + scope.#uuid + "-" + item.id);
                nodeItem?.removeEventListener('click', scope.#dispatchActiveNode(scope, item));
            });
        }

        scope.#matchedNodes = [];
        scope.#matchedNodes = nodes;

        const searchResultContainer = document.querySelector("#search-results-dropdown-" + scope.#uuid);

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
            const nodeItem = document.querySelector("#node-result-" + scope.#uuid + "-" + item.id);
            nodeItem?.addEventListener('click', scope.#dispatchActiveNode(item));
        });
    }

    #dispatchActiveNode(item) {
        const scope = this;
        return function (event) {
            if (scope.#searchModel?.updateInputAfterSelectItem) {
                scope.#setInputSearchValue(item.name);
            }
            let data = {
                value: item.id,
                selectGroupData: scope.#searchModel?.selectGroupData,
                model: scope.#searchModel?.model
            }
            scope.dispatchEvent({type: 'IeecloudSearchBlockRenderer.setActiveNode', value: data});
        };
    }

    #setInputSearchValue(inputValue) {
        const scope = this;
        const searchNodeInput = document.querySelector("#search-node-input-node-" + scope.#uuid);
        if (searchNodeInput) {
            searchNodeInput.value = inputValue;
        }
    }
}
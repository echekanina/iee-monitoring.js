import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

import './styles/assets/model-tree.css';
import {v4 as uuidv4} from "uuid";

// TODO: make old tree extends light version

export default class IeecloudTreeLightRenderer extends EventDispatcher {
    #container;
    #viewTreeInstance2View;
    #scrollAutoToActive;

    #treeName;
    #uuid;


    constructor(treeName, containerId, scrollAutoToActive) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#scrollAutoToActive = scrollAutoToActive;
        this.#treeName = treeName;
    }


    generateTemplate() {
        this.#uuid = uuidv4();
        return ` <div class="tree-content-` + this.#uuid + `">

    <div  class="tree-control d-flex flex-row justify-content-between">
     <div class="d-flex flex-row" style="overflow: hidden; text-overflow: ellipsis;">
     <span class="mt-2 d-none" style="white-space: nowrap">` + this.#treeName + `</span>
    
</div>

    </div>
       <div class="tree-structure" id="treeFinalContainer` + this.#uuid + `">
           <div id="inspire-tree-2-view` + this.#uuid + `"></div>
        </div>
        </div>`;
    }


    render() {
        const scope = this;
        this.#container.innerHTML = '';

        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);


        scope.#viewTreeInstance2View = new IeecloudMyTreeInspireView('inspire-tree-2-view' +   this.#uuid,
            null, {readOnly: true, scrollAutoToActive: false, scrollOptions: {behavior: "smooth"}});

        scope.#viewTreeInstance2View.on('treeView.setActiveNode', function (node) {
            scope.dispatchEvent({type: 'IeecloudTreeLightRenderer.setActiveNode', value: node});
        });

        this.#addDomListeners();
    }

    redrawTree(tree) {
        const scope = this;
        scope.#viewTreeInstance2View.redrawTreeView(tree);
    }


    showSpinner() {
        // TODO:add common solution for all views
        const spinner = `<div style="position: absolute;left:50%;top:50%;z-index:1000;width: fit-content;" id="tree-spinner">
            <div class="spinner-border" style="width: 2rem; height: 2rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        this.#container?.insertAdjacentHTML('beforeend', spinner);
    }

    removeSpinner() {
        let spinnerContainer = document.querySelector("#tree-spinner");
        spinnerContainer?.remove();
    }

    #addDomListeners() {
        const scope = this;

        const expandTree = document.querySelector("#expand-tree" + this.#uuid);
        expandTree?.addEventListener('click', function (event) {
            scope.#viewTreeInstance2View.changeViewTree(false);

        });

        const collapseTree = document.querySelector("#collapse-tree" + this.#uuid);
        collapseTree?.addEventListener('click', function (event) {
            scope.#viewTreeInstance2View.changeViewTree(true);

        });

        const scrollToActiveNodeBtn = document.querySelector("#tree-aim-active" + this.#uuid);
        scrollToActiveNodeBtn?.addEventListener('click', function (event) {
            event.preventDefault();
            scope.#viewTreeInstance2View.scrollIntoActive();
        });
    }
}
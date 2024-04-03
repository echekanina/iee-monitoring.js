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
        return ` <div class="d-flex" style="height: 100%;flex-direction: column;">
 <div class=" d-flex flex-row" style="padding: 0.75rem;"><input class="form-control"  type="search" placeholder="Поиск точки измерения" aria-label="Поиск ноды" id="search-tree-input-node-` + this.#uuid + `" autocomplete="off"
 style="display: block;
    width: 100%;
    padding: 0.675rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1;
    color: rgb(105, 112, 122);
    background-color: rgb(255, 255, 255);
    background-clip: padding-box;
    border: 1px solid rgb(197, 204, 214);
    appearance: none;
    border-radius: 0.35rem;
    transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;"></div>
 
 
 <div class="tree-point-content" style="overflow: auto;height: 100%;">

    <div  class="tree-control d-flex flex-row justify-content-between">
     <div class="d-flex flex-row" style="overflow: hidden; text-overflow: ellipsis;">
     <span class="mt-2 d-none" style="white-space: nowrap">` + this.#treeName + `</span>
    
</div>

    </div>
       <div class="tree-structure" id="treeFinalContainer` + this.#uuid + `">
           <div id="inspire-tree-2-view` + this.#uuid + `"></div>
        </div>
        </div></div>`;
    }


    render() {
        const scope = this;

        if (this.#container) {
            this.#container.innerHTML = '';
        }

        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);


        scope.#viewTreeInstance2View = new IeecloudMyTreeInspireView('inspire-tree-2-view' +   this.#uuid,
            null, {readOnly: true, scrollAutoToActive: false, scrollOptions: {behavior: "smooth"}});

        scope.#viewTreeInstance2View.on('treeView.setActiveNode', function (node) {
            scope.dispatchEvent({type: 'IeecloudTreeLightRenderer.setActiveNode', value: node});
        });

        this.#addDomListeners();
    }

    destroy() {
        this.#removeDomListeners();
    }

    redrawTree(tree) {
        const scope = this;
        scope.#viewTreeInstance2View.redrawTreeView(tree);
    }

    expandTreeByNodeScheme(nodeScheme){
        const scope = this;
        scope.#viewTreeInstance2View.defaultExpandViewTreeByScheme(nodeScheme);
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
        expandTree?.addEventListener('click', scope.#expandTreeListener);

        const collapseTree = document.querySelector("#collapse-tree" + this.#uuid);
        collapseTree?.addEventListener('click',  scope.#collapseTreeListener);

        const scrollToActiveNodeBtn = document.querySelector("#tree-aim-active" + this.#uuid);
        scrollToActiveNodeBtn?.addEventListener('click', scope.#scrollToActiveNodeBtn);

        const searchNodeInput = document.querySelector("#search-tree-input-node-" + this.#uuid);

        searchNodeInput?.addEventListener("focus", scope.#searchNodeInputFocusListener);

        searchNodeInput?.addEventListener("input", scope.#searchNodeInputTypeListener);
    }

    #expandTreeListener = (event) => {
        const scope = this;
        scope.#viewTreeInstance2View.changeViewTree(false);
    }

    #collapseTreeListener = (event) => {
        const scope = this;
        scope.#viewTreeInstance2View.changeViewTree(true);
    }

    #scrollToActiveNodeBtn = (event) => {
        const scope = this;
        event.preventDefault();
        scope.#viewTreeInstance2View.scrollIntoActive();
    }

    #searchNodeInputFocusListener = (event) => {
        const scope = this;
        const inputValue = event.target.value;
        scope.dispatchEvent({type: 'IeecloudTreeLightRenderer.searchNode', value: inputValue});
    }
    #searchNodeInputTypeListener = (event) => {
        const scope = this;
        const inputValue = event.target.value;
        scope.dispatchEvent({type: 'IeecloudTreeLightRenderer.searchNode', value: inputValue});
    }

    #removeDomListeners() {
        const scope = this;

        const expandTree = document.querySelector("#expand-tree" + this.#uuid);
        expandTree?.removeEventListener('click', scope.#expandTreeListener);

        const collapseTree = document.querySelector("#collapse-tree" + this.#uuid);
        collapseTree?.removeEventListener('click',  scope.#collapseTreeListener);

        const scrollToActiveNodeBtn = document.querySelector("#tree-aim-active" + this.#uuid);
        scrollToActiveNodeBtn?.removeEventListener('click', scope.#scrollToActiveNodeBtn);

        const searchNodeInput = document.querySelector("#search-tree-input-node-" + this.#uuid);

        searchNodeInput?.removeEventListener("focus", scope.#searchNodeInputFocusListener);

        searchNodeInput?.removeEventListener("input", scope.#searchNodeInputTypeListener);
    }

    searchInTree() {
        const scope = this;
        const searchNodeInput = document.querySelector("#search-tree-input-node-" + this.#uuid);
        if (searchNodeInput.value && searchNodeInput.value.trim().length > 0) {
            scope.dispatchEvent({type: 'IeecloudTreeLightRenderer.searchNode', value: searchNodeInput.value});
        }
    }

}
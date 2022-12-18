import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

import './styles/assets/model-tree.css';

export default class IeecloudTreeRenderer extends EventDispatcher {
    #container;
    #viewTreeInstance2View;


    constructor(containerId) {
        super();
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return ` <div class="tree-content">

 <button class="tree-toggler" id="tree-model-show-btn" style="display:none;">
 <i class="fa-solid fa-folder-tree"></i>
    </button>
    <div  class="tree-control d-flex flex-row justify-content-between">
     <span class="mt-2">Структура Объекта</span>
            
     <div class="d-flex flex-row justify-content-between"> 
     <a  href="#" role="button" class="btn btn-icon rounded-circle" id="tree-hide-btn">
<!--                                            <i class="fas fa-square-minus fa-sm fa-fw text-gray-400"></i>-->
                                            <i class="fa-solid fa-angle-left"></i>
                                             </a>
<!--                                                <button id="tree-hide-btn" class="btn btn-icon d-md-none rounded-circle mr-3">-->
<!--                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>-->
<!--                    </button>-->
                                             </div>                                     

    </div>
       <div class="tree" id="treeFinalContainer">
           <div id="inspire-tree-2-view"></div>
        </div></div>`;
    }


    render() {
        const scope = this;
        this.#container.innerHTML = ''

        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);


        scope.#viewTreeInstance2View = new IeecloudMyTreeInspireView('inspire-tree-2-view',
            null, {readOnly: true});

        scope.#viewTreeInstance2View.on('treeView.setActiveNode', function (node) {
            scope.dispatchEvent({type: 'IeecloudTreeRenderer.setActiveNode', value: node});
        });

        this.#addDomListeners();
    }

    redrawTree(tree) {
        const scope = this;
        scope.#viewTreeInstance2View.redrawTreeView(tree);
    }

    #addDomListeners() {
        const treeModelHide = document.querySelector("#tree-hide-btn");
        treeModelHide?.addEventListener('click', function (event) {

            const wrapper = document.querySelector("#wrapper");
            wrapper?.classList.add("tree-toggled");
            treeModelShow.style.display = 'flex';
        });

        const treeModelShow = document.querySelector("#tree-model-show-btn");
        treeModelShow?.addEventListener('click', function (event) {

            const wrapper = document.querySelector("#wrapper");
            wrapper?.classList.remove("tree-toggled");
            treeModelShow.style.display = 'none';
        });
    }
}
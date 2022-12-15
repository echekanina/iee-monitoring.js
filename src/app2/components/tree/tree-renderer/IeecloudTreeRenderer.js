import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudTreeRenderer extends EventDispatcher{
    #container;
    #viewTreeInstance2View;


    constructor(containerId) {
        super();
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return ` <div class="tree-content pt-3  pb-3">
 <button class="tree-toggler" id="tree-model-show-btn" style="display:none;">
 <i class="fa-solid fa-folder-tree"></i>
    </button>
    <div  class="tree-control d-flex flex-row justify-content-between">
     <span>Модель Модуля</span>
            
     <div class="d-flex flex-row justify-content-between"> 
     <a  href="#" role="button" class="me-2" id="tree-hide-btn">
                                            <i class="fas fa-square-minus fa-sm fa-fw text-gray-400"></i>
                                             </a>
                                             </div>                                     

    </div>
       <div class="tree" id="treeFinalContainer">
           <div id="inspire-tree-2-view"></div>
        </div></div>`;
    }



    render(){
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
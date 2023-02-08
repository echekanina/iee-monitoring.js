import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

import './styles/assets/model-tree.css';
import Dropdown from "bootstrap/js/src/dropdown.js";
import IeecloudMapService from "../../content/page-content/page-content-renderer/map/IeecloudMapService.js";

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
                  
      <div class="dropdown no-arrow">
     
        
        <a class="dropdown-toggle btn btn-icon rounded-circle" href="#" role="button" id="expand-collapse-tree"
                                            data-bs-toggle="dropdown" >
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" >
         <li><a class="dropdown-item" href="#" id="collapse-tree">свернуть</a></li>
    <li><a class="dropdown-item" href="#" id="expand-tree">развернуть</a></li>
           
        </ul>
    </div>
     <div class="d-flex flex-row justify-content-between"> 
      <a  href="#" role="button" class="btn btn-icon rounded-circle" id="tree-aim-active" title="активный узел в поле зрения">
                                           <i class="fa-solid fa-crosshairs"></i>
                                             </a>
     <a  href="#" role="button" class="btn btn-icon rounded-circle" id="tree-hide-btn">
                                            <i class="fa-solid fa-angle-left"></i>
                                             </a>
                                             
                                        
                                             
                                            
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
        const scope = this;
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

        const expandTree = document.querySelector("#expand-tree");
        expandTree?.addEventListener('click', function (event) {
            scope.#viewTreeInstance2View.changeViewTree(false);

        });

        const collapseTree = document.querySelector("#collapse-tree");
        collapseTree?.addEventListener('click', function (event) {
            scope.#viewTreeInstance2View.changeViewTree(true);

        });

        const scrollToActiveNodeBtn = document.querySelector("#tree-aim-active");
        scrollToActiveNodeBtn?.addEventListener('click', function (event) {
            scope.#viewTreeInstance2View.scrollIntoActive();
        });
    }
}
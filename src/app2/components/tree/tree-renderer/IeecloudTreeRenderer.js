import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

import './styles/assets/model-tree.css';


export default class IeecloudTreeRenderer extends EventDispatcher {
    #container;
    #viewTreeInstance2View;
    #scrollAutoToActive;


    constructor(containerId, scrollAutoToActive) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#scrollAutoToActive = scrollAutoToActive;
    }


    generateTemplate() {
        return ` <div class="tree-content">

<!-- <button class="tree-toggler" id="tree-model-show-btn" style="display:none;">-->
<!-- <i class="fa-solid fa-folder-tree"></i>-->
<!--    </button>-->
    <div  class="tree-control d-flex flex-row justify-content-between">
     <div class="d-flex flex-row" style="overflow: hidden; text-overflow: ellipsis;">
     <span class="mt-2" style="white-space: nowrap">Структура Объекта </span>
          <div class="dropdown no-arrow" style="padding-left: 0.5rem; position: static;">
     
        
        <a class="dropdown-toggle btn btn-icon rounded-circle" href="#" role="button" id="expand-collapse-tree"
                                            data-bs-toggle="dropdown" >
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" >
         <li><a class="dropdown-item" href="#" id="collapse-tree">свернуть</a></li>
    <li><a class="dropdown-item" href="#" id="expand-tree">развернуть</a></li>
           
        </ul>
    </div>
       <a  href="#" role="button" class="btn btn-icon rounded-circle" id="tree-aim-active" style="padding-left: 0.5rem;" title="активный узел в поле зрения">
                                           <i class="fa-solid fa-crosshairs"></i>
                                             </a>
</div>
      
     <div class="d-flex flex-row justify-content-between"> 

     <a  href="#" role="button" class="btn btn-icon rounded-circle" id="tree-hide-btn">
                                            <i class="fa-solid fa-angle-left"></i>
                                             </a>
                                             
                                        
                                             
                                            
                                             </div>                                     

    </div>
       <div class="tree-structure" id="treeFinalContainer">
           <div id="inspire-tree-2-view"></div>
        </div></div>`;
    }


    render() {
        const scope = this;
        this.#container.innerHTML = ''


        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);


        scope.#viewTreeInstance2View = new IeecloudMyTreeInspireView('inspire-tree-2-view',
            null, {readOnly: true, scrollAutoToActive: scope.#scrollAutoToActive, scrollOptions: {behavior: "smooth"}});

        scope.#viewTreeInstance2View.on('treeView.setActiveNode', function (node) {
            scope.dispatchEvent({type: 'IeecloudTreeRenderer.setActiveNode', value: node});
        });

        this.#addDomListeners();
    }

    redrawTree(tree) {
        const scope = this;
        scope.#viewTreeInstance2View.redrawTreeView(tree);
    }

    hideBadges() {
        const scope = this;
        scope.#viewTreeInstance2View.turnOffStatuses();
    }

    setScrollAutoToActive(value) {
        const scope = this;
        scope.#viewTreeInstance2View.setScrollAutoToActive(value);
    }

    showSpinner() {
        // TODO:add common solution for all views
        const spinner = `<div style="position: absolute;left:50%;top:50%;z-index:1000" id="tree-spinner">
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
    showTreeListener = (event) => {
        const treeModelShow = document.querySelector("#tree-model-show-btn");
        let treeWrapper = document.getElementById("tree-wrapper");
        let treeWidthValueString = window.getComputedStyle(treeWrapper)['width'];
        treeWrapper.style.transform = 'translateX(0)';
        setTimeout(function(){
            let contentSubWrapper = document.getElementById("content-sub-wrapper");
            const treeWidthValue = parseInt(treeWidthValueString, 10);
            const width = Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            )
            if (width > 992){
                contentSubWrapper.style.paddingLeft = treeWidthValue + 'px';
            }

            treeModelShow.style.display = 'none';
        });
    }

    hideTreeListener = () => {
        const treeModelShow = document.querySelector("#tree-model-show-btn");
        let treeWrapper = document.getElementById("tree-wrapper");
        let treeWidthComputed = window.getComputedStyle(treeWrapper)['width'];
        treeWrapper.style.transform = 'translateX(-' + treeWidthComputed + ' )';

        setTimeout(function(){
            let contentSubWrapper = document.getElementById("content-sub-wrapper");
            const treeWidthValueString =  window.getComputedStyle(treeWrapper)['width'];
            const treeWidthValue = parseInt(treeWidthValueString, 10);
            const computedPLContentValueString = window.getComputedStyle(contentSubWrapper)['padding-left'];
            const computedPLContentValue = parseInt(computedPLContentValueString, 10);
            const width = Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            )
            if (width > 992){
                contentSubWrapper.style.paddingLeft = (computedPLContentValue - treeWidthValue) + 'px';
            }


            treeModelShow.style.display = 'flex';
        });
    }


    #addDomListeners() {
        const scope = this;
        const treeModelShow = document.querySelector("#tree-model-show-btn");
        treeModelShow?.addEventListener('click', scope.showTreeListener);


        const treeModelHide = document.querySelector("#tree-hide-btn");
        treeModelHide?.addEventListener('click', scope.hideTreeListener);

        const toggleTreeXsBtn = document.querySelector("#toggleTreeXsBtn");
        toggleTreeXsBtn?.addEventListener('click', function (event) {
            if (treeModelShow.style.display === 'none') { // tree is shown
                scope.hideTreeListener();
            } else {
                scope.showTreeListener();
            }
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
            event.preventDefault();
            scope.#viewTreeInstance2View.scrollIntoActive();
        });
    }
}
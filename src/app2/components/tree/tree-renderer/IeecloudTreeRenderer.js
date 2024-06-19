import {IeecloudMyTreeInspireView} from "ieecloud-tree";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

import './styles/assets/model-tree.css';
import IeecloudAppUtils from "../../../main/utils/IeecloudAppUtils.js";
import {Popover} from "bootstrap";


export default class IeecloudTreeRenderer extends EventDispatcher {
    #container;
    #viewTreeInstance2View;
    #scrollAutoToActive;

    #treeName;

    #activePopoverData = {statusElementId : null, popoverEntity : null};


    constructor(treeName, containerId, scrollAutoToActive) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#scrollAutoToActive = scrollAutoToActive;
        this.#treeName = treeName;
    }


    generateTemplate() {
        return `


<div class="tree-content">

    <div  class="tree-control d-flex flex-row justify-content-between">
     <div class="d-flex flex-row" style="overflow: hidden; text-overflow: ellipsis;">
     <span class="mt-2" style="white-space: nowrap">` + this.#treeName + `</span>
          <div class="dropdown no-arrow" style="padding-left: 0.5rem; position: static;">
     
        
        <a class="dropdown-toggle btn btn-icon rounded-circle" href="javascript:void(0)"  role="button" id="expand-collapse-tree"
                                            data-bs-toggle="dropdown" >
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" >
         <li><a class="dropdown-item" href="javascript:void(0)"  id="collapse-tree">свернуть</a></li>
    <li><a class="dropdown-item" href="javascript:void(0)"  id="expand-tree">развернуть</a></li>
           
        </ul>
    </div>
       <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle" id="tree-aim-active" style="padding-left: 0.5rem;" title="активный узел в поле зрения">
                                           <i class="fa-solid fa-crosshairs"></i>
                                             </a>
</div>
      
     <div class="d-flex flex-row justify-content-between"> 

     <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle" id="tree-hide-btn">
                                            <i class="fa-solid fa-angle-left"></i>
                                             </a>
                                             
                                        
                                             
                                            
                                             </div>                                     

    </div>
     <div class=" d-flex flex-row d-none" id="tree-search-block" style="padding-right: 1.5rem;
    padding-left: 0.5rem;
    padding-bottom: 0.5rem;"><input class="form-control"  type="search" placeholder="Поиск по дереву" aria-label="Поиск по дереву" id="search-tree-input-node" autocomplete="off"
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
       <div class="tree-structure" id="treeFinalContainer">
           <div id="inspire-tree-2-view"></div>
        </div></div>`;
    }


    render() {
        const scope = this;
        this.#container.innerHTML = '';

        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);


        scope.#viewTreeInstance2View = new IeecloudMyTreeInspireView('inspire-tree-2-view',
            null, {readOnly: true, scrollAutoToActive: scope.#scrollAutoToActive, scrollOptions: {behavior: "smooth"}});

        scope.#viewTreeInstance2View.on('treeView.setActiveNode', function (node) {
            scope.dispatchEvent({type: 'IeecloudTreeRenderer.setActiveNode', value: node});
        });

        scope.#viewTreeInstance2View.on('treeView.statusOnmouseover', function (data) {

            let exampleEl = document.getElementById(data.statusElementId);
            if (exampleEl) {
                scope.#activePopoverData.statusElementId = data.statusElementId;
                scope.dispatchEvent({type: 'IeecloudTreeRenderer.showIncidents', value: data});
            }

        });

        scope.#viewTreeInstance2View.on('treeView.statusOnmouseout', function (data) {
            if (scope.#activePopoverData?.statusElementId === data.statusElementId) {
                // scope.#activePopoverData?.popoverEntity?.hide();
            }
        });

        this.#addDomListeners();
    }



    showIncidentPopover(popoverMetaData, tableWrapper){
        const scope = this;
        let exampleEl = document.getElementById(popoverMetaData.statusElementId);
        scope.#activePopoverData.popoverEntity = new Popover(exampleEl, {html: true, content : tableWrapper, trigger: 'hover'});

        exampleEl.addEventListener('shown.bs.popover', function(evt) {
            const elem_evt_src = evt.target;
            const elem_popover = document.getElementById(elem_evt_src.getAttribute('aria-describedby')); // NOTE: 'aria-describedby' is a dynamic property added when popover gets shown
            elem_popover?.addEventListener('mouseenter', function (){
                const popover_instance = Popover.getInstance(exampleEl);
                const hide_func = popover_instance.hide;
                popover_instance.hide = function(){

                };
                this.addEventListener('mouseleave', (ev) => {
                    popover_instance.hide = hide_func;
                    popover_instance.hide();
                }, { once: true });
            }, { once: true });
        });
        exampleEl.addEventListener('hide.bs.popover', function(evt) {
            const elem_evt_src = evt.target;
            const elem_popover = document.getElementById(elem_evt_src.getAttribute('aria-describedby'));
            elem_popover?.removeEventListener('mouseenter', function(){
                const popover_instance = Popover.getInstance(exampleEl);
                const hide_func = popover_instance.hide;
                popover_instance.hide = function(){

                };
                this.addEventListener('mouseleave', (ev) => {
                    popover_instance.hide = hide_func;
                    popover_instance.hide();
                }, { once: true });
            });

            scope.dispatchEvent({type: 'IeecloudTreeRenderer.incidentsDispose'});
        });

        // exampleEl.addEventListener('hidden.bs.popover', function(evt) {
        //     scope.dispatchEvent({type: 'IeecloudTreeRenderer.incidentsDispose'});
        // });




        scope.#activePopoverData.popoverEntity.show();

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

    viewTreePanel(value) {
        let treeWrapper = document.getElementById("tree-wrapper");
        if (treeWrapper) {
            if (value) {
                treeWrapper.style.transform = 'translateX(0rem)';
            } else {
                treeWrapper.style.transform = 'translateX(-17rem)';
            }
        }
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
            if (!IeecloudAppUtils.isMobileDevice()) {
                treeModelShow.style.display = 'none';
            }

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

            if (!IeecloudAppUtils.isMobileDevice()) {
                treeModelShow.style.display = 'flex';
            }
        });
    }


    #addDomListeners() {
        const scope = this;
        const treeModelShow = document.querySelector("#tree-model-show-btn");
        treeModelShow?.addEventListener('click', function () {
            if (IeecloudAppUtils.isMobileDevice()) { // if mobile => toggle tree
                let treeWrapper = document.getElementById("tree-wrapper");
                const style = window.getComputedStyle(treeWrapper)
                const matrix = new DOMMatrixReadOnly(style.transform)
                let treeTranslateX = matrix.m41
                if (treeTranslateX === 0) { // tree is shown
                    scope.hideTreeListener();
                } else {
                    scope.showTreeListener();
                }
            } else {
                scope.showTreeListener();
            }
        });


        const treeModelHide = document.querySelector("#tree-hide-btn");
        treeModelHide?.addEventListener('click', scope.hideTreeListener);

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

        const searchNodeInput = document.querySelector("#search-tree-input-node");

        searchNodeInput?.addEventListener("focus", function (event) {
            const inputValue = event.target.value;
            scope.dispatchEvent({type: 'IeecloudTreeRenderer.searchNode', value: inputValue});
        });

        searchNodeInput?.addEventListener("input", function (event) {
            const inputValue = event.target.value;
            scope.dispatchEvent({type: 'IeecloudTreeRenderer.searchNode', value: inputValue});
        });
    }
}
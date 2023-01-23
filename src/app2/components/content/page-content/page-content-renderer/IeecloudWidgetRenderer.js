import Dropdown from "bootstrap/js/src/dropdown.js";

export default class IeecloudWidgetRenderer {
    #layoutModel;
    #node;
    #container;
    #cardBodyContainer;
    #viewActionsContainer;
    #modelDataActionsContainer;

    constructor(containerId, layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `<div class="` + this.#layoutModel.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-2 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 text-primary">` + this.#layoutModel.name + `</h6>
                                    
                                    
        <div>   
         <div class="btn-group d-none" id="full-screen" >
             <a  href="#" role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Развернуть на весь экран">
                                            <i class="fa-solid fa-up-down-left-right"></i>
                                             </a>         
                                                       
    </div>
    <div class="btn-group">

     <a  href="#" role="button" class="btn btn-icon rounded-circle action dropdown-toggle ${(this.#layoutModel.modelDataActions ? "" : "d-none")}" id="dropdownMenuLink2-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Модель данных" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-chart-column"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer2-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>
    
<div class="btn-group">
    <a  href="#" role="button" style="padding-left: 0.45rem;" class="btn btn-icon rounded-circle action dropdown-toggle ${(this.#layoutModel.viewActions ? "" : "d-none")}" id="dropdownMenuLink-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Вид Отображения" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-table-list"></i>
                                             </a>   
  
  
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer-` + this.#node.id  + `-` + this.#layoutModel.id + `">
  </ul>
</div>
                                    
                                    
  </div>                                   
                                    
                             
 
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.#layoutModel.id + `">
                                </div>
                            </div>
                        </div>`;
    }

    render() {
        let widgetTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', widgetTemplate);
        this.#cardBodyContainer = "card-body-container-" + this.#layoutModel.id;
        this.#viewActionsContainer = "dropDownContainer-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#modelDataActionsContainer = "dropDownContainer2-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#addDomListeners();
    }

    get cardBodyContainer() {
        return this.#cardBodyContainer;
    }


    get viewActionsContainer() {
        return this.#viewActionsContainer;
    }

    get modelDataActionsContainer() {
        return this.#modelDataActionsContainer;
    }

    #addDomListeners() {
        // TODO : refactor
        const scope = this;
        const dropdownMenuLink2 = document.querySelector("#dropdownMenuLink2-" + this.#node.id + "-" + this.#layoutModel.id);
        let dropdownMenuLink2DropDown = new Dropdown(dropdownMenuLink2);


        dropdownMenuLink2?.addEventListener('click', function (event) {
            dropdownMenuLink2DropDown.toggle();
        });


        const dropdownMenuLink = document.querySelector("#dropdownMenuLink-" + this.#node.id+ "-" + this.#layoutModel.id);
        let dropdownMenuLinkDropDown = new Dropdown(dropdownMenuLink);


        dropdownMenuLink?.addEventListener('click', function (event) {
            dropdownMenuLinkDropDown.toggle();
        });

        const fullScreen = document.querySelector("#full-screen");
        fullScreen?.addEventListener('click', function(event){
            const bodyContainerElement = document.querySelector("iframe");
            if (bodyContainerElement.requestFullscreen) {
                bodyContainerElement.requestFullscreen();
            } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
                bodyContainerElement.webkitRequestFullscreen();
            } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
                bodyContainerElement.msRequestFullscreen();
            }
        });

    }
}
import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import IeecloudWidgetActionsRenderer from "./IeecloudWidgetActionsRenderer.js";
import Dropdown from "bootstrap/js/src/dropdown.js";
import EventHandler from "bootstrap/js/src/dom/event-handler.js";

export default class IeecloudWidgetRenderer {
    #layoutModel;
    #node;

    constructor(layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
        EventHandler.on(document, 'click.bs.dropdown.data-api', Dropdown.clearMenus);
    }


    generateTemplate() {
        return `<div class="` + this.#layoutModel.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-2 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 text-primary">` + this.#layoutModel.name + `</h6>
                                    
                                    
        <div>                          
    
    <div class="btn-group">
  <button type="button" class="btn btn-sm  btn-light dropdown-toggle"   id="dropdownMenuLink2-` + this.#node.id + `" data-bs-toggle="dropdown">
    Модель Данных
  </button>
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer2-` + this.#layoutModel.id + `">
           
        </ul>
</div>
    
    <!-- Example single danger button -->
<div class="btn-group">
  <button type="button" class="btn btn-sm  btn-light dropdown-toggle" id="dropdownMenuLink-` + this.#node.id + `" data-bs-toggle="dropdown">
    Вид Отображения
  </button>
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer-` + this.#layoutModel.id + `">
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

    render(container) {
        let widgetTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', widgetTemplate);
        let widgetBody;
        if (this.#layoutModel.widgetContent) {
            const bodyContainerElement = document.querySelector("#card-body-container-" + this.#layoutModel.id);
            widgetBody = new IeecloudWidgetBodyRenderer(this.#layoutModel.widgetContent, this.#node, bodyContainerElement);
            widgetBody.render();
        }

        if (this.#layoutModel.dropDownActions) {
            const dropDownContainerElement = document.querySelector("#dropDownContainer-" + this.#layoutModel.id);
            const widgetHeaderActions = new IeecloudWidgetActionsRenderer(widgetBody, this.#layoutModel.dropDownActions);
            widgetHeaderActions.render(dropDownContainerElement);
        }

        if (this.#layoutModel.dropDownActions2) {
            const dropDownContainerElement = document.querySelector("#dropDownContainer2-" + this.#layoutModel.id);
            const widgetHeaderActions = new IeecloudWidgetActionsRenderer(widgetBody, this.#layoutModel.dropDownActions2);
            widgetHeaderActions.render(dropDownContainerElement);
        }
        this.#addDomListeners();
    }

    #addDomListeners() {
        // TODO : refactor
        const dropdownMenuLink2 = document.querySelector("#dropdownMenuLink2-" + this.#node.id);
        let dropdownMenuLink2DropDown = new Dropdown(dropdownMenuLink2);


        dropdownMenuLink2?.addEventListener('click', function (event) {
            dropdownMenuLink2DropDown.toggle();
        });


        const dropdownMenuLink = document.querySelector("#dropdownMenuLink-" + this.#node.id);
        let dropdownMenuLinkDropDown = new Dropdown(dropdownMenuLink);


        dropdownMenuLink?.addEventListener('click', function (event) {
            dropdownMenuLinkDropDown.toggle();
        });


    }
}
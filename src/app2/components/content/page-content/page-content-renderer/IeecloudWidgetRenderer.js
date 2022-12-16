import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import IeecloudWidgetActionsRenderer from "./IeecloudWidgetActionsRenderer.js";

export default class IeecloudWidgetRenderer {
    #layoutModel;
    #node;

    constructor(layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
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
  <button type="button" class="btn btn-sm  btn-light dropdown-toggle"   id="dropdownMenuLink2" data-bs-toggle="dropdown" aria-expanded="false">
    Модель Данных
  </button>
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" aria-labelledby="dropdownMenuLink2"
         id="dropDownContainer2-` + this.#layoutModel.id + `">
           
        </ul>
</div>
    
    <!-- Example single danger button -->
<div class="btn-group">
  <button type="button" class="btn btn-sm  btn-light dropdown-toggle" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
    Вид Отображения
  </button>
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" aria-labelledby="dropdownMenuLink"
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

    render(container){
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
        }else{
            // const dropDown = document.querySelector("#dropdownMenuLink2");
            // dropDown.classList.add("d-none")
        }
    }
}
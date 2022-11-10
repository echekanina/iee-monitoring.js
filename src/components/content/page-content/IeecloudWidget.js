import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import IeecloudWidgetBody from "./IeecloudWidgetBody.js";

export default class IeecloudWidget {
    model;
    #template = ``;

    constructor(model) {
        this.model = model;
    }


    generateTemplate() {
        this.#template = `<div class="` + this.model.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 fw-bold text-primary">` + this.model.name + `</h6>
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Dropdown Header:</div>
                                            <a class="dropdown-item" href="#">Action</a>
                                            <a class="dropdown-item" href="#">Another action</a>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.model.id + `">
                                </div>
                            </div>
                        </div>`;
        return this.#template;
    }

    insertTemplates() {
        if(this.model.widgetContent){
            const widgetBody = new IeecloudWidgetBody(this.model.widgetContent);
            const widgetBodyTemplate = widgetBody.generateTemplate();
            const bodyContainerElement = document.querySelector("#card-body-container-"+ this.model.id);
            bodyContainerElement.insertAdjacentHTML('beforeend', widgetBodyTemplate);
            widgetBody.insertTemplates();
        }

    }
}
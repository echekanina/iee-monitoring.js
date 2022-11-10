import IeecloudTable from "./widget-body/table/IeecloudTable.js";
import IeecloudViewer from "./widget-body/viewer/IeecloudViewer.js";
import IeecloudDummy from "./widget-body/dummy/IeecloudDummy.js";

export default class IeecloudWidgetBody {
    model;
    #template = ``;

    constructor(model) {
        this.model = model;
    }

    generateTemplate() {
        this.#template = ` <div class="widget-body-content" id="widget-body-` + this.model.id + `">
                                    </div>`;
        return this.#template;
    }

    insertTemplates() {

        let view;

        switch (this.model.type) {
            case "table":
                view = new IeecloudTable(this.model);
                break
            case "viewer":
                view = new IeecloudViewer(this.model);
                break

            default:
                view = new IeecloudDummy(this.model);
        }
        const viewTemplate = view.generateTemplate();
        const bodyContainerElement = document.querySelector("#widget-body-"+ this.model.id);
        bodyContainerElement.insertAdjacentHTML('beforeend', viewTemplate);
        view.insertTemplates();
    }
}
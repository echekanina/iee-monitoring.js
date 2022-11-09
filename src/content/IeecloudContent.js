import IeecloudTopBar from "./toolbar/IeecloudTopBar.js";
import IeecloudPageContent from "./page-content/IeecloudPageContent.js";

export default class IeecloudContent {
    model;
    #template = ``;

    constructor(model) {
        this.model = model;
    }

    generateTemplate() {
        this.#template = ` <div id="content">  </div>`;
        return this.#template;
    }


    insertTemplates() {
        this.pageContent = new IeecloudPageContent();
        const topBarTemplate = this.pageContent.generateTemplate();
        const containerElement = document.querySelector("#content");
        containerElement.insertAdjacentHTML('afterbegin', topBarTemplate);
        if (this.model.topBar) {
            this.topBar = new IeecloudTopBar(this.model.topBar);
            const topBarTemplate = this.topBar.generateTemplate();
            const containerElement = document.querySelector("#content");
            containerElement.insertAdjacentHTML('afterbegin', topBarTemplate);

        }


    }
}
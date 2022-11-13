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
        this.pageContent = new IeecloudPageContent(this.model.pageContent);
        const pageContentTemplate = this.pageContent.generateTemplate();
        const containerElement = document.querySelector("#content");
        containerElement.insertAdjacentHTML('afterbegin', pageContentTemplate);

        this.pageContent.insertTemplates();
    }
}
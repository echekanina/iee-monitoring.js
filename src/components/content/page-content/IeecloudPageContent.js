import IeecloudSummaryCard from "./IeecloudSummaryCard.js";
import IeecloudWidgetRow from "./IeecloudWidgetRow.js";

export default class IeecloudPageContent {
    model;
    #template = ``;
    #reportingTemplate = ``;

    constructor(model) {
        this.model = model;
    }

    generateTemplate() {
        this.#template = `<div class="container-fluid" id="container-fluid-wrapper">

                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4" id="page-heading">
                        <h1 class="h3 mb-0 text-gray-800"> ` + this.model.heading.name + `</h1>
                    </div>

                    <!-- Content Row -->
                    <div class="row" id="summary-card-wrapper">

                    </div>

                </div>`;

        this.#reportingTemplate = `<a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                class="fas fa-download fa-sm text-white-50"></i>Создать отчет</a>`;
        return this.#template;
    }

    insertTemplates() {
        if (this.model.heading.report) {
            const pageHeadingElement = document.querySelector("#page-heading");
            pageHeadingElement.insertAdjacentHTML('beforeend', this.#reportingTemplate);
        }
        const summaryCardContainerElement = document.querySelector("#summary-card-wrapper");
        const containerElement = document.querySelector("#container-fluid-wrapper");

        if (this.model.summaryCards && this.model.summaryCards.length > 0) {
            this.model.summaryCards.forEach(function (cardItem) {
                let summaryCard = new IeecloudSummaryCard(cardItem);
                let cardTemplate = summaryCard.generateTemplate();
                summaryCardContainerElement.insertAdjacentHTML('beforeend', cardTemplate);
            });
        }

        if (this.model.widgetRows && this.model.widgetRows.length > 0) {
            this.model.widgetRows.forEach(function (rowModel) {
                let widgetRow = new IeecloudWidgetRow(rowModel);
                let widgetRowTemplate = widgetRow.generateTemplate();
                containerElement.insertAdjacentHTML('beforeend', widgetRowTemplate);
                widgetRow.insertTemplates();
            });
        }

    }
}
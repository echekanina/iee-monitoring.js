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
                    <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                            <div class="page-header-content pt-3  pb-3">
                                  <nav class="rounded" aria-label="breadcrumb">
                                    <ol class="breadcrumb  px-3 py-2 rounded mb-0">
                                        <li class="breadcrumb-item"><a href="dashboard-1.html">Б.Ижора</a></li>
                                        <li class="breadcrumb-item active">Состояние Объекта</li>
                                    </ol>
                                </nav>
                            </div>
                    </header>
                    

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
            pageHeadingElement?.insertAdjacentHTML('beforeend', this.#reportingTemplate);
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
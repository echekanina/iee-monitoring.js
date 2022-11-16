import IeecloudSummaryCard from "./module-summary/IeecloudSummaryCard.js";
import IeecloudWidgetRow from "./widgets-rows/IeecloudWidgetRow.js";
import IeecloudPageService from "./IeecloudPageService.js";
import IeecloudBreadCrumb from "./breadcrumb/IeecloudBreadCrumb.js";

export default class IeecloudPageContent {
    layoutModel;
    observableObject;
    #template = ``;
    #reportingTemplate = ``;

    constructor(layoutModel, observableObject) {
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
    }

    generateTemplate() {
        this.#template = `<div class="container-fluid" id="container-fluid-wrapper">



                    <!-- Page Heading -->
                    <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                            <div class="page-header-content pt-3  pb-3">
                                  <nav class="rounded" aria-label="breadcrumb">
                                    <ol class="breadcrumb  px-3 py-2 rounded mb-0" id="breadcrumb-container">
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
        const scope = this;
        if (this.layoutModel?.heading.report) {
            const pageHeadingElement = document.querySelector("#page-heading");
            pageHeadingElement?.insertAdjacentHTML('beforeend', this.#reportingTemplate);
        }
        const summaryCardContainerElement = document.querySelector("#summary-card-wrapper");
        const containerElement = document.querySelector("#container-fluid-wrapper");

        if (this.layoutModel?.summaryCards && this.layoutModel.summaryCards.length > 0) {
            this.layoutModel.summaryCards.forEach(function (cardItem) {
                let summaryCard = new IeecloudSummaryCard(cardItem);
                let cardTemplate = summaryCard.generateTemplate();
                summaryCardContainerElement.insertAdjacentHTML('beforeend', cardTemplate);
            });
        }

        if (this.layoutModel?.widgetRows && this.layoutModel.widgetRows.length > 0) {
            this.layoutModel.widgetRows.forEach(function (rowModel) {
                let widgetRow = new IeecloudWidgetRow(rowModel, scope.observableObject);
                let widgetRowTemplate = widgetRow.generateTemplate();
                containerElement.insertAdjacentHTML('beforeend', widgetRowTemplate);
                widgetRow.insertTemplates();
            });
        }

        const pageService = new IeecloudPageService(scope.observableObject.moduleItemModel.data.dataService);
        const breadcrumbContainerElement = document.querySelector("#breadcrumb-container");
        pageService.getBreadcrumb(scope.observableObject.moduleItemModel.data , function(result){
            let breadcrumb = new IeecloudBreadCrumb(result, scope.observableObject);
            let breadcrumbRowTemplate = breadcrumb.generateTemplate();
            breadcrumbContainerElement.insertAdjacentHTML('beforeend', breadcrumbRowTemplate);
            breadcrumb.insertTemplates();

        });

    }
}
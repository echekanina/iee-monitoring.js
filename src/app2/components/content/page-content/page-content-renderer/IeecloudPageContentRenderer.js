import IeecloudSummaryCardRenderer from "./IeecloudSummaryCardRenderer.js";
import IeecloudWidgetRowRenderer from "./IeecloudWidgetRowRenderer.js";
import layout from './content-layout.json'

export default class IeecloudPageContentRenderer {
    #layoutModel;
    #container;

    constructor(containerId) {
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate() {
        return `
                    

                    <!-- Content Row -->
                    <div id="content-node">
                    <div class="row" id="summary-card-wrapper">

                    </div>
                    <div id="content-widget">

                    </div>
                      </div>

               `;
    }

    render(node) {
        const scope = this;

        scope.#layoutModel = layout[node.schemeId];

        const template = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', template);
        const summaryCardContainerElement = document.querySelector("#summary-card-wrapper");
        const widgetContainer = document.querySelector("#content-widget");
        summaryCardContainerElement.innerHTML = '';
        widgetContainer.innerHTML = '';
        if (this.#layoutModel?.summaryCards && this.#layoutModel.summaryCards.length > 0) {
            this.#layoutModel.summaryCards.forEach(function (cardItem) {
                let summaryCard = new IeecloudSummaryCardRenderer(cardItem);
                summaryCard.render(summaryCardContainerElement);

            });
        }

        if (this.#layoutModel?.widgetRows && this.#layoutModel.widgetRows.length > 0) {
            this.#layoutModel.widgetRows.forEach(function (rowModel) {
                let widgetRow = new IeecloudWidgetRowRenderer(rowModel, node);
                widgetRow.render(widgetContainer);
            });
        }
    }
}
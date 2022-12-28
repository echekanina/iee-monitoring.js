export default class IeecloudPageContentRenderer {
    #container;
    #widgetContainerId;

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
        const template = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', template);
        const summaryCardContainerElement = document.querySelector("#summary-card-wrapper");
        const widgetContainer = document.querySelector("#content-widget");
        summaryCardContainerElement.innerHTML = '';
        widgetContainer.innerHTML = '';
        // if (this.#layoutModel?.summaryCards && this.#layoutModel.summaryCards.length > 0) {
        //     this.#layoutModel.summaryCards.forEach(function (cardItem) {
        //         let summaryCard = new IeecloudSummaryCardRenderer(cardItem);
        //         summaryCard.render(summaryCardContainerElement);
        //
        //     });
        // }

        this.#widgetContainerId = "content-widget";
    }

    get widgetContainerId() {
        return this.#widgetContainerId;
    }
}
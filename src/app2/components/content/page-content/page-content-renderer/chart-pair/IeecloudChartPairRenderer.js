import IeecloudChartRenderer from "../chart/IeecloudChartRenderer.js";

export class IeecloudChartPairRenderer {

    indicators = [{code: 'tilt_x', name: 'Наклон по X'}, {code: 'tilt_y', name: 'Наклон по Y'}];
    #node;

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        return `<div class="chart-area-` + this.#node.id + `">

   <div class="row" id="chart-pair-container-` + this.#node.id + `">

</div>
                                        
                                    </div>`;
    }


    render(container) {
        const scope = this;
        container.innerHTML = '';
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);
        let pairContainer = document.querySelector("#chart-pair-container-" + this.#node.id);
        this.indicators.forEach(function (indicator) {
            let chartRenderer = new IeecloudChartRenderer(scope.#node, indicator);
            chartRenderer.render(pairContainer);
        })
    }

}
import IeecloudChartRenderer from "../chart/IeecloudChartRenderer.js";
import IeecloudChartService from "../chart/IeecloudChartService.js";

import indicators from './chart-layout.json'

export class IeecloudChartPairRenderer {

    #node;
    #chartRenderers = [];

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        return `<div id="chart-area-` + this.#node.id + `" style="background-color: white;">

   <div class="row" id="chart-pair-container-` + this.#node.id + `">

</div>
                                        
                                    </div>`;
    }

    destroy() {
        const scope = this;
        if (scope.#chartRenderers && scope.#chartRenderers.length > 0) {
            scope.#chartRenderers.forEach(renderer => renderer.destroy())
        }
        scope.#chartRenderers = [];
    }

    loadEventStore(eventsData){
        const scope = this;
        if (scope.#chartRenderers && scope.#chartRenderers.length > 0) {
            scope.#chartRenderers.forEach(renderer => renderer.loadEventStore(eventsData))
        }
    }


    render(container) {
        const scope = this;
        container.innerHTML = '';
        const viewTemplate = this.generateTemplate();

        container.insertAdjacentHTML('beforeend', viewTemplate);

        const nodeProps = this.#node.properties;
        const chartService = new IeecloudChartService(nodeProps.dataService);


        let chartIndicators = [];

        chartService.readScheme(nodeProps, function (result) {
            result.schema.properties.forEach(function (property) {
                let indicatorsTemplate = indicators[nodeProps.type];
                if (indicatorsTemplate) {
                    let indicatorsTml = indicatorsTemplate.indicatorsTml;
                    let yTitle = indicatorsTemplate.title;
                    let zoomLimit = indicatorsTemplate.zoomLimit;
                    if (indicatorsTml instanceof Array) {

                        if (property.type === 'real' && !property.code.includes('_')) {
                            let chartIndicator = [];
                            indicatorsTml.forEach(function (elemTmpl) {

                                let obj = {};
                                for (let key in elemTmpl) {
                                    if (key === "color") {
                                        obj[key] = elemTmpl[key];
                                        continue;
                                    }
                                    if (property[elemTmpl[key]]) {
                                        obj[key] = property[elemTmpl[key]]
                                    } else {
                                        const words = elemTmpl[key].split('_');
                                        let foundProp = result.schema.properties.find(function (prop) {

                                            return prop[words[0]] === property[words[0]] + '_' + words[1];
                                        });
                                        if (foundProp) {
                                            obj["prop"] = foundProp;
                                        }
                                        if (foundProp && foundProp.hasOwnProperty(key)) {
                                            obj[key] = foundProp[key];
                                        } else {
                                            obj[words[0]] = obj["prop"][words[0]];
                                        }
                                    }

                                }
                                delete obj["prop"];
                                obj.title = yTitle;
                                obj.zoomLimit = zoomLimit;
                                chartIndicator.push(obj);


                            })

                            chartIndicators.push(chartIndicator);
                        }

                    } else if (indicatorsTml instanceof Object) {

                        if (property.type === 'real') {
                            let chartIndicator = [];
                            let obj = {};
                            for (let key in indicatorsTml) {
                                if (property[indicatorsTml[key]]) {
                                    obj[key] = property[indicatorsTml[key]]
                                }
                            }
                            obj.title = yTitle;
                            obj.zoomLimit = zoomLimit;
                            chartIndicator.push(obj);

                            chartIndicators.push(chartIndicator);
                        }
                    }
                }

            })

            let pairContainer = document.querySelector("#chart-pair-container-" + scope.#node.id);
            chartIndicators.forEach(function (indicatorsElement) {
                let chartRenderer = new IeecloudChartRenderer(scope.#node, indicatorsElement);
                chartRenderer.render(pairContainer);
                scope.#chartRenderers.push(chartRenderer);
            });
        });
    }

    fullScreen(){
        const bodyContainerElement = document.getElementById("chart-area-" + this.#node.id);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }

}
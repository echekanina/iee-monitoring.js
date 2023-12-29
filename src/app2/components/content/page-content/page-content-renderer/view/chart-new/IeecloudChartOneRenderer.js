export class IeecloudChartOneRenderer {

    #node;
    #oneContainer;

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        return `<div id="chart-area-` + this.#node.id + `" style="background-color: white;">

   <div class="row" id="chart-one-container-` + this.#node.id + `">

</div>
                    
<div class="modal fade" id="analyticChartModal" tabindex="-1" aria-labelledby="analyticModalLabel" aria-hidden="true">
        <div class="modal-dialog  modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                   <h5 class="modal-title">Выбор критериев</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id ="analytic-criteria-container" class="criteria-container row">
 <div class="col-md-3" ><div id="points-tree" style="height: 500px;
    overflow: auto;"></div></div>

 <div class="col-md-9">
  <button type="button" id="analyticRemoveSelectedBtn" class="btn btn-outline-primary d-none" style="margin-bottom: 0.5rem">Удалить</button>
 <div id="analytic-criteria-table" style="height: 100%;"></div>
</div>
                    
</div>
                </div>
                <div class="modal-footer">
                     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Закрыть</button>
                      <button type="button " id="analyticCleanBodyBtn" class="btn btn-outline-secondary d-none">Очистить</button>
                       <button type="button" id="analyticAddBodyBtn" class="btn btn-outline-primary">Добавить</button>
                </div>
            </div>
        </div>
    </div> 
                                    </div>`;
    }

    destroy() {
        const scope = this;
        scope.#oneContainer.innerHTML = '';
    }

    buildListGroup(listGroup) {
        let template = ``
        if (listGroup) {
            template = template + `<div class="list-group">`
            listGroup.forEach(function (listGroupItem) {

                if (listGroupItem.selectGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex  align-items-center">
                     <span style="width:20%">${listGroupItem.label}</span>` + listGroupItem.selectGroup.renderer.generateTemplate() + `</div>`;

                } else if (listGroupItem.searchGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex align-items-center">
                     <span style="width:20%">${listGroupItem.label}</span>` + listGroupItem.searchGroup.renderer.generateTemplate() + `</div>`;
                }

            });
            template = template + `</div>`;
        }
        return template;
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        const viewTemplate = this.generateTemplate();

        container.insertAdjacentHTML('beforeend', viewTemplate);

        scope.#oneContainer = document.querySelector("#chart-one-container-" + scope.#node.id);
    }

    fullScreen() {
        const bodyContainerElement = document.getElementById("chart-area-" + this.#node.id);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }

    get oneContainer() {
        return this.#oneContainer;
    }

}
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
                    <div id ="analytic-criteria-container" style="display: flex" class="criteria-container">
 <div class="points-tree-wrapper" style="flex-basis: 20rem;
    flex-shrink: 0;position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: calc(100vh - 4.525rem);;
    z-index: 1038;
    padding-top: 4.375rem;
    width: 20rem;" ><div id="points-tree" style="height: 100%"></div></div>

 <div class="analytic-criteria-table-wrapper" style="padding-left: 19rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    flex-grow: 1;
    min-height: 100vh;">
 <div id="analytic-criteria-table" style="height: 100%;"></div>
</div>
                    
</div>
                </div>
                <div class="modal-footer">
                     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Закрыть</button>
                      <button type="button " id="analyticCleanBodyBtn" class="btn btn-outline-secondary">Удалить все критерии</button>
                       <button type="button" id="analyticAddBodyBtn" class="btn btn-outline-primary">Ок</button>
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
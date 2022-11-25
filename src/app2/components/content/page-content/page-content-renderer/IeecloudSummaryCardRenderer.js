export default class IeecloudSummaryCardRenderer {
    #layoutModel;
    constructor(layoutModel) {
        this.#layoutModel = layoutModel;


    }

    generateTemplate(){
        return `<div class="col-xl-3 col-md-6 mb-4">
                            <div class="card ` + this.#layoutModel.cardClazz + ` shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="` + this.#layoutModel.cardTextClazz + ` small">
                                                ` + this.#layoutModel.name + `</div>
                                            <div class="h5 mb-0 fw-bold text-white-800"> ` + this.#layoutModel.value + `</div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-calendar fa-2x text-white-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    }

    render(container) {
        let cardTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', cardTemplate);
    }
}
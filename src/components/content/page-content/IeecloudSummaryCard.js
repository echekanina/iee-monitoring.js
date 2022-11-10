export default class IeecloudSummaryCard {
    model;
    #template = ``;
    constructor(model) {
        this.model = model;


    }

    generateTemplate(){
        this.#template = `<div class="col-xl-3 col-md-6 mb-4">
                            <div class="card ` + this.model.cardClazz + ` shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs fw-bold text-primary text-uppercase mb-1">
                                                ` + this.model.name + `</div>
                                            <div class="h5 mb-0 fw-bold text-gray-800"> ` + this.model.value + `</div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        return this.#template;
    }
}
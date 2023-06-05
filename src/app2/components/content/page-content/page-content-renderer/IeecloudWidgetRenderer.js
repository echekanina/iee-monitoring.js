
export default class IeecloudWidgetRenderer {
    #layoutModel;
    #node;
    #container;
    #cardBodyContainer;
    #viewActionsContainer;
    #modelDataActionsContainer;
    #viewMapActionsContainer;
    #viewType;
    #viewMapActionsBtnId;
    #viewModelActionsBtnId;
    #fullScreenBtn;
    #viewEventsChartsBtnId;
    #viewEventsStoresContainer;

    #repoEventsList;

    constructor(containerId, layoutModel, node, eventsRepoList) {
        this.#layoutModel = layoutModel;
        this.#viewType = this.#layoutModel.widgetContent.view;
        this.#node = node;
        this.#repoEventsList = eventsRepoList;
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `<div class="` + this.#layoutModel.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-2 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 text-primary">` + this.#layoutModel.name + `</h6>
                                    
                                    
        <div>  
        
        <div class="btn-group" style="padding-top: 1rem;padding-bottom: 1rem;"></div>
       
         <div class="btn-group ${(this.#layoutModel.fullScreenEnabled ? "" : "d-none")}"   id ="fullScreenBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="#" role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Развернуть на весь экран">
                                            <i class="fa-solid fa-maximize"></i>
                                             </a>         
                                                       
    </div>
    <div class="btn-group ${(this.#layoutModel.modelDataActions &&  (this.#viewType === 'viewer-3d' || this.#viewType === 'viewer-2d') ? "" : "d-none")}" id ="dropDownContainer2ModelBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="#" role="button" class="btn btn-icon rounded-circle action dropdown-toggle " id="dropdownMenuLink2-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Модель данных" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-chart-column"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer2-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>

    <div class="btn-group  ${(this.#layoutModel.mapViewActions && this.#viewType ==='map' ? "" : "d-none")}" id ="dropDownContainer3MapBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="#" role="button" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink3-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Тип карты" data-bs-toggle="dropdown">
                                           <i class="fa-solid fa-map"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer3-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>


   <div class="btn-group  ${(this.#repoEventsList ? "" : "d-none")}" id ="dropDownContainer4EventBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="#" role="button" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink4-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Журналы событий" data-bs-toggle="dropdown">
                                           <i class="fa-solid fa-calendar-check"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer4-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>

    
<div class="btn-group ${(this.#layoutModel.viewActions ? "" : "d-none")}">
    <a  href="#" role="button" style="padding-left: 0.45rem;" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Вид Отображения" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-table-list"></i>
                                             </a>   
  
  
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer-` + this.#node.id  + `-` + this.#layoutModel.id + `">
  </ul>
</div>



                                    
                                    
  </div>                                   
                                    
                             
 
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.#layoutModel.id + `">
                                </div>
                            </div>
                        </div>`;
    }

    render() {
        let widgetTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', widgetTemplate);
        this.#cardBodyContainer = "card-body-container-" + this.#layoutModel.id;
        this.#viewActionsContainer = "dropDownContainer-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#modelDataActionsContainer = "dropDownContainer2-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewMapActionsContainer = "dropDownContainer3-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewEventsStoresContainer = "dropDownContainer4-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewMapActionsBtnId = "dropDownContainer3MapBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewModelActionsBtnId = "dropDownContainer2ModelBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#fullScreenBtn = "fullScreenBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewEventsChartsBtnId = "dropDownContainer4EventBtn-" + this.#node.id + "-" + this.#layoutModel.id;
    }

    get cardBodyContainer() {
        return this.#cardBodyContainer;
    }


    get viewActionsContainer() {
        return this.#viewActionsContainer;
    }

    get modelDataActionsContainer() {
        return this.#modelDataActionsContainer;
    }

    get viewEventsChartsBtnId() {
        return this.#viewEventsChartsBtnId;
    }

    get viewEventsStoresContainer() {
        return this.#viewEventsStoresContainer;
    }

    get viewMapActionsContainer() {
        return this.#viewMapActionsContainer;
    }

    get viewMapActionsBtnId() {
        return this.#viewMapActionsBtnId;
    }
    get viewModelActionsBtnId() {
        return this.#viewModelActionsBtnId;
    }

    get fullScreenBtn() {
        return this.#fullScreenBtn;
    }

    toggleBtnGroup(elementId, isShow) {
        const elementHtml = document.querySelector("#" + elementId);
        if (elementHtml) {
            if (isShow) {
                elementHtml.classList.remove('d-none');
            } else {
                elementHtml.classList.add('d-none');
            }
        }
    }

    destroy(){
        if(this.#container) {
            this.#container.innerHTML = '';
        }

        // TODO : remove dom listeners
    }
}
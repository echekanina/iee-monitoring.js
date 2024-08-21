
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
    #viewDataChartsBtnId;
    #viewEventsStoresContainer;
    #editStoreBtn;
    #editStoreModal;
    #editStoreModalBody;
    #editStoreModalBodyBtn;
    #editSaveBtn;
    #add2BChildNodes;
    #edit2dNodesModal;
    #edit2dNodesModalBody;
    #edit2dNodesModalBtn;
    #turnOffChildNodes;
    #add2DMode = false;
    #addNewTreeBtn;
    #viewDataStoresContainer;
    #analyticBtn;
    #analyticCleanAllBtn;
    #dateRangeInput;
    #dateRangeWrapper;
    #analyticScreenBtn;
    #analyticPlusBtn;
    #downloadDocBtn;

    constructor(containerId, layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#viewType = this.#layoutModel.widgetContent.view;
        this.#node = node;
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
        
        

                                             
                                                 <div class="btn-group ${(this.#viewType === 'docs' ? "" : "d-none")}"   id ="downloadDocBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Загрузить файл">
                                          <i class="fa-solid fa-download"></i>
                                             </a>         
                                                       
    </div>
       
       
    

    
    <div class="btn-group ${(this.#layoutModel.modelDataActions &&  (this.#viewType === 'viewer-3d' || this.#viewType === 'viewer-2d') ? "" : "d-none")}" id ="dropDownContainer2ModelBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action dropdown-toggle " id="dropdownMenuLink2-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Модель данных" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-chart-column"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer2-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>

    <div class="btn-group  ${(this.#layoutModel.mapViewActions && this.#viewType ==='map' ? "" : "d-none")}" id ="dropDownContainer3MapBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink3-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Тип карты" data-bs-toggle="dropdown">
                                           <i class="fa-solid fa-map"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer3-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>


   <div class="btn-group  ${(this.#layoutModel.availableRepos  && this.#viewType === 'chart' || this.#viewType === 'analytics' ? "" : "d-none")}" id ="dropDownContainer4EventBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">

     <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink4-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Журналы событий" data-bs-toggle="dropdown" data-bs-auto-close="outside" >
                                           <i class="fa-solid fa-database"></i>
                                             </a>     
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in checkbox-menu allow-focus"
         id="dropDownContainer4-` + this.#node.id + `-` + this.#layoutModel.id + `">
           
        </ul>
</div>

                <div class="btn-group ${(this.#layoutModel.editEnabled && this.#node.properties.editMode ? "" : "d-none")}"   id ="editStoreBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Добавить данные">
                                         <i class="fa-solid fa-plus"></i>
                                             </a>      
                                             
   
                                                       
    </div>
      <div class="btn-group ${(this.#layoutModel.analyticsEnabled && this.#viewType === 'analytics' ? "" : "d-none")}"   id ="analyticPlusBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" title="Новый анализ">
                                          <i class="fa-solid fa-plus"></i>
                                             </a>      </div>    
    
                                                <div class="btn-group ${(this.#layoutModel.analyticsEnabled && this.#viewType === 'analytics' ? "" : "d-none")}"   id ="analyticBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" title="Редактировать">
                                         <i class="fa-solid fa-edit"></i>
                                             </a>      </div>     
                                             
                                                                             <div class="btn-group ${(this.#layoutModel.analyticsEnabled && this.#viewType === 'analytics' ? "" : "d-none")}"   id ="analyticCleanAllBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action"  title="Удалить все критерии">
                                        <i class="fa-solid fa-eraser"></i>
                                             </a>      </div> 
                                             
                                             
                                              <div class="btn-group ${(this.#layoutModel.analyticsEnabled && this.#viewType === 'analytics' ? "" : "d-none")}"   id ="analyticScreenBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action"  title="Скрин">
                                        <i class="fa-solid fa-camera"></i>
                                             </a>      </div> 




<!--TODO: add admin role-->
    <div class="btn-group ${(this.#layoutModel.add2DNodesEnabled && this.#viewType === 'viewer-2d' ? "" : "d-none")}"   id ="addChildNodes-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" style="padding-left: 0.55rem;" class="btn btn-icon rounded-circle action  ${(this.#add2DMode? "turn" : "")}" id="full-screen-btn" title=" ${(this.#add2DMode ? 
            this.#layoutModel.add2DNodesEnabledTurnOffTitle : this.#layoutModel.add2DNodesEnabledTurnTitle)}"">
                                        <i class="fa-solid fa-location-dot"></i>
                                             </a>         
                                                       
    </div>        
    


    <div class="btn-group ${(this.#layoutModel.editEnabled ? "" : "d-none")}"   id ="editSaveBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Сохранить Изменения">
                                           <i class="fa-regular fa-floppy-disk"></i>
                                             </a>         
                                                       
    </div>
    <div class="btn-group ${(this.#layoutModel.editEnabled  && this.#viewType === 'treeEdit' ? "" : "d-none")}"   id ="addNewTreeBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a  href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Добавить дерево">
                                         <i class="fa-solid fa-plus"></i>
                                             </a>         
                                                       
    </div>
    
    
       
    
<div class="btn-group ${(this.#layoutModel.viewActions ? "" : "d-none")}">
    <a  href="javascript:void(0)"  role="button" style="padding-left: 0.45rem;" class="btn btn-icon rounded-circle action dropdown-toggle" id="dropdownMenuLink-` + this.#node.id + `-` + this.#layoutModel.id + `"  title="Вид Отображения" data-bs-toggle="dropdown">
                                            <i class="fa-solid fa-table-list"></i>
                                             </a>   
  
  
  <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in"
         id="dropDownContainer-` + this.#node.id  + `-` + this.#layoutModel.id + `">
  </ul>
</div>

 <div class="btn-group ${(this.#layoutModel.fullScreenEnabled ? "" : "d-none")}"   id ="fullScreenBtn-` + this.#node.id + `-` + this.#layoutModel.id + `">
             <a href="javascript:void(0)"  role="button" class="btn btn-icon rounded-circle action" id="full-screen-btn" title="Развернуть на весь экран">
                                            <i class="fa-solid fa-maximize"></i>
                                             </a>         
                                                       
    </div>  
    <div class="btn-group ${(this.#layoutModel.dateTimeRangeEnabled && this.#viewType === 'chart' ||  this.#viewType === 'analytics' ? "" : "d-none")}"   id ="dateRangeInputWrapper-` + this.#node.id + `-` + this.#layoutModel.id + `">
       
                
                
                <div id="datetimerange-input-` + this.#node.id + `-` + this.#layoutModel.id + `" style="background: #fff; cursor: pointer; padding: 5px 10px; background-color: rgb(255, 255, 255);
    background-clip: padding-box;
    border: 1px solid rgb(197, 204, 214);
    appearance: none;
    border-radius: 0.35rem; transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s; width: 100%">
    <i class="fa fa-calendar"></i>&nbsp;
    <span style="font-size: smaller"></span> <i class="fa fa-caret-down"></i>
</div>
                                                       
    </div>    
                                            
                                    
  </div>                                   
                                    
                             
 
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.#layoutModel.id + `">
                                </div>
                            </div>
                        </div> 
                         <div class="modal fade" id="editStoreModal-` + this.#node.id  + `-` + this.#layoutModel.id + `" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div class="modal-dialog  modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Добавить данные</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id ="editStoreModalBody-` + this.#node.id  + `-` + this.#layoutModel.id + `"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    <button type="button" id="editStoreModalBodyBtn-` + this.#node.id  + `-` + this.#layoutModel.id + `" class="btn btn-secondary">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
 <div class="modal fade" id="edit2dNodesModal-` + this.#node.id  + `-` + this.#layoutModel.id + `" tabindex="-1" aria-labelledby="edit2dNodesModal" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Добавить 2D ноды</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id ="edit2dNodesModalBody-` + this.#node.id  + `-` + this.#layoutModel.id + `" style="display: flex;justify-content: center"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    <button type="button" id="edit2dNodesModalBtn-` + this.#node.id  + `-` + this.#layoutModel.id + `" class="btn btn-secondary">Сохранить</button>
                </div>
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
        this.#viewDataStoresContainer = "dropDownContainer5-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewMapActionsBtnId = "dropDownContainer3MapBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewModelActionsBtnId = "dropDownContainer2ModelBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#downloadDocBtn = "downloadDocBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#fullScreenBtn = "fullScreenBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#editStoreBtn = "editStoreBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#analyticBtn = "analyticBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#analyticPlusBtn = "analyticPlusBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#analyticCleanAllBtn = "analyticCleanAllBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#analyticScreenBtn = "analyticScreenBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#dateRangeWrapper = "dateRangeInputWrapper-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#dateRangeInput = "datetimerange-input-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewEventsChartsBtnId = "dropDownContainer4EventBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#viewDataChartsBtnId = "dropDownContainer5EventBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#editStoreModal = "editStoreModal-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#editStoreModalBody = "editStoreModalBody-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#editStoreModalBodyBtn = "editStoreModalBodyBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#editSaveBtn = "editSaveBtn-" + this.#node.id + "-" + this.#layoutModel.id;

        this.#add2BChildNodes = "addChildNodes-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#turnOffChildNodes = "turnOffChildNodes-" + this.#node.id + "-" + this.#layoutModel.id;


        this.#edit2dNodesModal = "edit2dNodesModal-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#edit2dNodesModalBody = "edit2dNodesModalBody-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#edit2dNodesModalBtn = "edit2dNodesModalBtn-" + this.#node.id + "-" + this.#layoutModel.id;
        this.#addNewTreeBtn = "addNewTreeBtn-" + this.#node.id + "-" + this.#layoutModel.id;
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

    get viewDataChartsBtnId() {
        return this.#viewDataChartsBtnId;
    }

    get viewEventsStoresContainer() {
        return this.#viewEventsStoresContainer;
    }

    get viewDataStoresContainer() {
        return this.#viewDataStoresContainer;
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

    get downloadDocBtn() {
        return this.#downloadDocBtn;
    }

    get editStoreBtn() {
        return this.#editStoreBtn;
    }

    get analyticBtn() {
        return this.#analyticBtn;
    }

    get analyticPlusBtn() {
        return this.#analyticPlusBtn;
    }

    get analyticCleanAllBtn() {
        return this.#analyticCleanAllBtn;
    }

    get analyticScreenBtn() {
        return this.#analyticScreenBtn;
    }

    get dateRangeInput() {
        return this.#dateRangeInput;
    }

    get dateRangeWrapper() {
        return this.#dateRangeWrapper;
    }

    get editStoreModal() {
        return this.#editStoreModal;
    }

    get edit2dNodesContainers() {
        let containers = {
            edit2dNodesModal: this.#edit2dNodesModal,
            edit2dNodesModalBody: this.#edit2dNodesModalBody,
            edit2dNodesModalBtn: this.#edit2dNodesModalBtn,
        }

        return containers;
    }

    get editStoreModalBody() {
        return this.#editStoreModalBody;
    }

    get editStoreModalBodyBtn() {
        return this.#editStoreModalBodyBtn;
    }

    get editSaveBtn() {
        return this.#editSaveBtn;
    }

    get addNewTreeBtn() {
        return this.#addNewTreeBtn;
    }

    get add2ВChildNodes() {
        return this.#add2BChildNodes;
    }

    get turnOffChildNodes() {
        return this.#turnOffChildNodes;
    }



    set add2DMode(value){
        this.#add2DMode = value;
    }

    get add2DMode(){
        return this.#add2DMode;
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
    toggleTurnBtnLink(elementId, title, isTurn) {
        const elementHtml = document.querySelector("#" + elementId + " > a");
        if (elementHtml) {
            elementHtml.title = title;
            if (isTurn) {
                elementHtml.classList.add('turn');
            } else {
                elementHtml.classList.remove('turn');
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
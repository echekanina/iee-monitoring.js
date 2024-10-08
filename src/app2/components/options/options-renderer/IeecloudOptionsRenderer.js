import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudOptionsRenderer extends EventDispatcher {
    #container;
    #detailsSettingContainer;
    #treeSettingContainer;

    constructor(containerId) {
        super();
        this.#container = document.querySelector("#" + containerId);
    }


    render() {
        this.#container.innerHTML = '';
        const template = this.#generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);
        this.#detailsSettingContainer = 'details-settings-container';
        this.#treeSettingContainer = 'tree-settings-container';
        this.#addDomListeners();
    }

    #generateTemplate() {

        return `<button type="button" class="btn btn-outline-secondary btn-sm" id="reset-user-ui-settings" style="margin-bottom: 1rem; margin-left: 1rem;">Восстановить настройки по умолчанию</button><nav class="settings-tabs">
  <div class="nav nav-borders" id="nav-tab" role="tablist">
    <a class="nav-link active" id="nav-tree-tab" data-bs-toggle="tab" data-bs-target="#tree-tab" type="button" role="tab" aria-controls="nav-tree" aria-selected="true">
    <span>Структура объекта</span>
                                                   
    </a>
    <div class="dropdown no-arrow">
     
        
        <a class="dropdown-toggle btn btn-icon rounded-circle action" href="javascript:void(0)"  role="button" id="nav-tree-tab-actions"
                                            data-bs-toggle="dropdown" >
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" >
         <li><a class="dropdown-item" href="javascript:void(0)"  id="reset-options-tree">Сбросить настройки</a></li>
        </ul>
    </div>
    <a class="nav-link " id="nav-details-tab" data-bs-toggle="tab" data-bs-target="#details-tab" type="button" role="tab" aria-controls="nav-details" aria-selected="false">
    Детали Объектов
    </a>
        <div class="dropdown no-arrow">
        
        <a class="dropdown-toggle btn btn-icon rounded-circle action" href="javascript:void(0)" role="button" id="nav-details-tab-actions"
                                            data-bs-toggle="dropdown" >
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" >
         <li><a class="dropdown-item" href="javascript:void(0)"  id="reset-options-details">Сбросить настройки</a></li>
        </ul>
    </div>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade" id="details-tab" role="tabpanel" aria-labelledby="nav-details-tab" tabindex="0">
   <div id="details-settings-container" style="padding-top: 1rem;" ></div>
</div>
  <div class="tab-pane fade  show active" id="tree-tab" role="tabpanel" aria-labelledby="nav-tree-tab" tabindex="0">
  <div id="tree-settings-container" style="padding-top: 1rem;" ></div>
</div>
</div>`;
    }

    #addDomListeners() {
        const scope = this;
        const resetTreeSettingsBtn = document.querySelector("#reset-options-tree");
        resetTreeSettingsBtn?.addEventListener('click', function () {
            scope.dispatchEvent({type: 'IeecloudOptionsRenderer.resetTreeOptions'});
        });
        const resetDetailsSettingsBtn = document.querySelector("#reset-options-details");
        resetDetailsSettingsBtn?.addEventListener('click', function () {
            scope.dispatchEvent({type: 'IeecloudOptionsRenderer.resetDetailsOptions'});
        });

        const resetAllUserUISettingsBtn = document.querySelector("#reset-user-ui-settings");
        resetAllUserUISettingsBtn?.addEventListener('click', function () {
            scope.dispatchEvent({type: 'IeecloudOptionsRenderer.resetAllUserUISettings'});
        });
    }

    get detailsSettingContainer() {
        return this.#detailsSettingContainer;
    }

    get treeSettingContainer() {
        return this.#treeSettingContainer;
    }
}
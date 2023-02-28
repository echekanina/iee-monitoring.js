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

        return `<nav>
  <div class="nav nav-borders" id="nav-tab" role="tablist">
    <a class="nav-link active" id="nav-tree-tab" data-bs-toggle="tab" data-bs-target="#tree-tab" type="button" role="tab" aria-controls="nav-tree" aria-selected="true">
    <span>Структура объекта</span>
    <a  href="#" role="button" class="btn btn-icon rounded-circle action " id="reset-options-tree"  title="Сбросить настройки">
                                            <i class="fas fa-undo"></i>
                                             </a>        
    </a>
    <a class="nav-link " id="nav-details-tab" data-bs-toggle="tab" data-bs-target="#details-tab" type="button" role="tab" aria-controls="nav-details" aria-selected="false">
    Детали Объектов
        <a  href="#" role="button" class="btn btn-icon rounded-circle action " id="reset-options-details"  title="Сбросить настройки">
                                            <i class="fas fa-undo"></i>
                                             </a>    
    </a>
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
    }

    get detailsSettingContainer() {
        return this.#detailsSettingContainer;
    }

    get treeSettingContainer() {
        return this.#treeSettingContainer;
    }
}
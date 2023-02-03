export default class IeecloudContentRenderer {
    #ieecloudTreeModel;
    #rootElements;
    #treeController;
    #container;
    #breadcrumbContainerId;
    #pageContentContainerId;
    #isDialog;
    #pageContentModalId;


    get breadcrumbContainerId() {
        return this.#breadcrumbContainerId;
    }

    get pageContentContainerId() {
        return this.#pageContentContainerId;
    }

    get pageContentModalId() {
        return this.#pageContentModalId;
    }


    set ieecloudTreeModel(model) {
        this.#ieecloudTreeModel = model;
    }

    set treeController(ctr) {
        this.#treeController = ctr;
    }

    set rootElements(ctr) {
        this.#rootElements = ctr;
    }

    set isDialog(isDialog) {
        this.#isDialog = isDialog;
    }

    constructor(containerId, isDialog) {
        this.#container = document.querySelector("#" + containerId);
        this.#isDialog = isDialog;
    }

    generateTemplate() {
        if (this.#isDialog) {
            return `  <div class="modal fade" id="pageContentModalContainer" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog   modal-xl">
    <div class="modal-content">
      <div class="modal-header">
 <nav class="rounded" aria-label="breadcrumb">
                                    <ol class="breadcrumb  px-3 py-2 rounded mb-0" id="breadcrumb-container-modal">
                                    </ol>
                                </nav>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
     <div class="modal-body">
  <div class="container-fluid"  id="container-fluid-wrapper-modal">

  </div>
</div>
<!--      <div class="modal-footer">-->
<!--        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--      </div>-->
    </div>
  </div>
</div>`;
        }
        return `<div class="container-fluid" id="container-fluid-wrapper">
                    <!-- Page Heading -->
                    <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                            <div class="page-header-content pt-3  pb-3">
                                  <nav class="rounded" aria-label="breadcrumb">
                                    <ol class="breadcrumb  px-3 py-2 rounded mb-0" id="breadcrumb-container">
                                    </ol>
                                </nav>
                            </div>
                    </header>
                </div>`;

    }

    destroy() {
        if (this.#container) {
            this.#container.innerHTML = '';
        }
    }

    render(systemModel) {
        const scope = this;
        // this.#container.innerHTML = '';
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);

        this.#breadcrumbContainerId = scope.#isDialog ? "breadcrumb-container-modal" : "breadcrumb-container";
        this.#pageContentContainerId = scope.#isDialog ? "container-fluid-wrapper-modal" : "container-fluid-wrapper";
        if (scope.#isDialog) {
            this.#pageContentModalId = "pageContentModalContainer";
        }

    }
}
export default class IeecloudContentRenderer {
    #ieecloudTreeModel;
    #rootElements;
    #treeController;
    #container;
    #breadcrumbContainerId;
    #pageContentContainerId;


    get breadcrumbContainerId() {
        return this.#breadcrumbContainerId;
    }

    get pageContentContainerId() {
        return this.#pageContentContainerId;
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

    constructor(containerId) {
        this.#container  = document.querySelector("#" + containerId);
    }

    generateTemplate() {
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

    render(systemModel) {
        const scope = this;
        this.#container.innerHTML = '';
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);

        this.#breadcrumbContainerId = "breadcrumb-container";
        this.#pageContentContainerId = "container-fluid-wrapper";




        // const breadcrumbContainer = document.querySelector("#breadcrumb-container");
        // const breadCrumbRender = new IeecloudBreadCrumbRenderer(scope.#ieecloudTreeModel, scope.#rootElements, scope.#treeController, breadcrumbContainer);
        //
        // breadCrumbRender.render();
        //
        // const containerElement = document.querySelector("#container-fluid-wrapper");
        // const pageContentRenderer = new IeecloudPageContentRenderer(breadCrumbRender.activeNode, containerElement);
        // pageContentRenderer.render();
    }
}
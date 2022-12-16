export default class IeecloudAppRenderer {
    #container;
    #sideBarContainerId;
    #topBarContainerId;
    #contentContainerId;
    #treeContainerId;

    constructor(containerId) {
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `
   <div id="wrapper">
   <div id="content-wrapper" >
  <div id="sidebar-wrapper" >
  
   </div>
    <div id="tree-wrapper" >
  
   </div>
   <div id="content-sub-wrapper" >
   <div id="content-tree-wrapper" >
   </div>
  <footer class="footer-admin mt-auto footer-light">
                    <div class="container-xl px-4">
                        <div class="row">
                            <div class="col-md-12 small">Copyright © ieecloud 2022</div>
<!--                            <div class="col-md-6 text-md-end small">-->
<!--                                <a href="#!">Privacy Policy</a>-->
<!--                                ·-->
<!--                                <a href="#!">Terms &amp; Conditions</a>-->
<!--                            </div>-->

                        </div>
                    </div>
                </footer>
   </div>
   </div>
    </div>
    <div  id="tree-model-switcher" class="sb-customizer sb-customizer-closed d-none">
    <button class="sb-customizer-toggler" id="tree-model-settings-btn">
            <svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" class="svg-inline--fa fa-folder-tree fa-w-16  settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v96V384c0 35.3 28.7 64 64 64H256V384H64V160H256V96H64V32zM288 192c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V192zm0 288c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V480z"/></svg>
    </button>
    <div  class="sb-customizer-heading shadow">Модель Модуля</div>
    <div  class="sb-customizer-content d-flex flex-column justify-content-between">

        <div>
            <div id="inspire-tree"></div>
        </div>
    </div>
</div>
     <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
      </a>`;
    }

    render(systemModel) {
        this.#container.innerHTML = '';
        const mainTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', mainTemplate);
        this.#sideBarContainerId = "sidebar-wrapper";
        this.#treeContainerId = "tree-wrapper";
        this.#topBarContainerId = "wrapper";
        this.#contentContainerId = "content-tree-wrapper";
    }

    get sideBarContainerId() {
        return this.#sideBarContainerId;
    }

    get treeContainerId() {
        return this.#treeContainerId;
    }

    get topBarContainerId() {
        return this.#topBarContainerId;
    }

    get contentContainerId() {
        return this.#contentContainerId;
    }
}
export default class IeecloudAppRenderer {
    #container;
    #sideBarContainerId;
    #topBarContainerId;
    #contentContainerId;

    constructor(containerId) {
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `
   <div id="wrapper">
   <div id="content-wrapper" >
  <div id="sidebar-wrapper" >
  
   </div>
   <div id="content-sub-wrapper" >
   <div id="content-tree-wrapper" >
   </div>
  <footer class="footer-admin mt-auto footer-light">
                    <div class="container-xl px-4">
                        <div class="row">
                            <div class="col-md-6 small">Copyright © ieecloud 2022</div>
                            <div class="col-md-6 text-md-end small">
                                <a href="#!">Privacy Policy</a>
                                ·
                                <a href="#!">Terms &amp; Conditions</a>
                            </div>

                        </div>
                    </div>
                </footer>
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
        this.#topBarContainerId = "wrapper";
        this.#contentContainerId = "content-tree-wrapper";
    }

    get sideBarContainerId() {
        return this.#sideBarContainerId;
    }

    get topBarContainerId() {
        return this.#topBarContainerId;
    }

    get contentContainerId() {
        return this.#contentContainerId;
    }
}
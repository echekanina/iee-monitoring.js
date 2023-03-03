export default class IeecloudAppRenderer {
    #container;
    #sideBarContainerId;
    #topBarContainerId;
    #contentContainerId;
    #treeContainerId;
    #contentOptionsContainerId;

    constructor(containerId) {
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `
   <div id="wrapper">
   <div id="content-wrapper" >
  <div id="sidebar-wrapper" >
  
   </div>
 <button class="tree-toggler" id="tree-model-show-btn" style="display:none;">
 <i class="fa-solid fa-folder-tree"></i>
    </button>
    <div id="tree-wrapper" style="min-width: 2.8rem;" >

   </div>
   <div id="content-sub-wrapper" >
   <div id="resizerX" style="width: 10px;height:100%;float: right;position: fixed;" class="d-none"></div>
   <div id="content-tree-wrapper" >
   </div>
  <footer class="footer-admin mt-auto footer-light">
                    <div class="container-xl px-4">
                        <div class="row">
                            <div class="col-md-12 small">Copyright © ieecloud 2022. Version: ${__APP_VERSION__} </div>
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
    <div  id="tree-model-switcher" class="sb-customizer sb-customizer-closed">
    <button class="sb-customizer-toggler" id="tree-model-settings-btn">
            <svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog"
                 class="svg-inline--fa fa-cog fa-w-16 settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor"
                      d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
            </svg>
    </button>
    <div  class="sb-customizer-heading shadow"> 
      <div class="d-flex justify-content-between align-items-center" style="padding: 0.7rem;">
      <div class="d-flex justify-content-between align-items-center">
        <span style="padding-left: 0.5rem;">Наcтройки Отображения</span>
</div>
                                             
                                               <a  href="#" role="button" class="btn btn-icon rounded-circle action close" id="close-options"  title="Закрыть настройки">
                                           <i class="fa-solid fa-xmark"></i>
                                             </a>    
</div>
    </div>
    <div  class="sb-customizer-content d-flex flex-column justify-content-between">

        <div id="content-options-container">
         
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
        this.#contentOptionsContainerId = "content-options-container";
        this.#addDomListeners();
    }

    #resizerX(resizerID, mousemoveCallBack) {
        this.#resizer(resizerID, mousemoveCallBack, "e-resize");
    }

    #resizer(resizerID, mousemove, cursor) {
        let resizer = document.getElementById(resizerID);
        resizer.style.cursor = cursor;
        resizer.mousemove = mousemove;

        resizer.onmousedown = function (e) {
            try {
                document.documentElement.addEventListener('mousemove', resizer.doDrag, false);
                document.documentElement.addEventListener('mouseup', resizer.stopDrag, false);
            } catch (e) {
                // ErrorMessage("resizer.onmousedown(...) failed! Your browser does not support this feature. " + e.message);
            }
        }

        resizer.doDrag = function (e) {
            if (e.which !== 1) {
                resizer.stopDrag(e);
                return;
            }
            resizer.mousemove(e);
        }

        resizer.stopDrag = function (e) {
            document.documentElement.removeEventListener('mousemove', resizer.doDrag, false);
            document.documentElement.removeEventListener('mouseup', resizer.stopDrag, false);
        }
    }

    #addDomListeners() {
        const treeModelToggle = document.querySelector("#tree-model-settings-btn");
        treeModelToggle?.addEventListener('click', function (event) {
            const treeModelSwitcher = document.querySelector("#tree-model-switcher");
            if (treeModelSwitcher?.classList.contains('sb-customizer-closed')) {
                treeModelSwitcher.classList.remove('sb-customizer-closed');
                treeModelSwitcher.classList.add('sb-customizer-open');
            } else if (treeModelSwitcher?.classList.contains('sb-customizer-open')) {
                treeModelSwitcher.classList.remove('sb-customizer-open');
                treeModelSwitcher.classList.add('sb-customizer-closed');
            }
        });

        const treeModelCloseBtn = document.querySelector("#close-options");

        treeModelCloseBtn?.addEventListener('click', function (event) {
            const treeModelSwitcher = document.querySelector("#tree-model-switcher");
            if (treeModelSwitcher?.classList.contains('sb-customizer-open')) {
                treeModelSwitcher.classList.remove('sb-customizer-open');
                treeModelSwitcher.classList.add('sb-customizer-closed');
            }
        });

        this.#resizerX("resizerX", function (e) {
            let treeWrapper = document.getElementById("tree-wrapper");
            const minWidthComputed = window.getComputedStyle(treeWrapper)['min-width'];
            const minWidthNumber = parseInt(minWidthComputed, 10);
            if (e.pageX <= minWidthNumber) {
                return;
            }
            let contentSubWrapper = document.getElementById("content-sub-wrapper");
            treeWrapper.style.width = e.pageX + 'px';

            contentSubWrapper.style.paddingLeft = treeWrapper.style.width;
        });

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

    get contentOptionsContainerId() {
        return this.#contentOptionsContainerId;
    }
}
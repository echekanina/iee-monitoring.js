import "@fontsource/montserrat"
import "@fontsource/montserrat/cyrillic-500.css"
import "@fontsource/montserrat/cyrillic-600.css"
import "@fontsource/montserrat/cyrillic-700.css"
import "@fontsource/montserrat/cyrillic-800.css"
// TODO: sass warning  bootstrap bug https://reviews.mahara.org/c/mahara/+/13431
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/scss/sb-admin-2.scss'
import model from './model.json'
import IeecloudSideBar from "./components/sidebar/IeecloudSideBar.js";
import IeecloudContent from "./components/content/IeecloudContent.js";
import IeecloudTopBar from "./components/content/toolbar/IeecloudTopBar.js";


function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    const containerElement = document.querySelector("#app");


    const mainTemplate = `
   <div id="wrapper">
   <div id="content-wrapper" >
  <div id="sidebar-wrapper" >
  
   </div>
   <div id="content-sub-wrapper" >
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
      </a>
`



    containerElement.insertAdjacentHTML('beforeend', mainTemplate);


    const wrapperElement = document.querySelector("#wrapper");

    if (model.topBar) {
        const topBar = new IeecloudTopBar(model.topBar);
        const topBarTemplate = topBar.generateTemplate();
        wrapperElement?.insertAdjacentHTML('afterbegin', topBarTemplate);

    }

    const contentSideWrapperElement = document.querySelector("#sidebar-wrapper");
    const sideBar = new IeecloudSideBar(model.sideBar);
    const sideBarTemplate = sideBar.generateTemplate();
    contentSideWrapperElement?.insertAdjacentHTML('afterbegin', sideBarTemplate);
    sideBar.insertTemplates();


    const content = new IeecloudContent(model.content);
    const contentTemplate = content.generateTemplate();

    const contentWrapperElement = document.querySelector("#content-sub-wrapper");
    contentWrapperElement?.insertAdjacentHTML('afterbegin', contentTemplate);
    content.insertTemplates();


});


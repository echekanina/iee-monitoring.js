// TODO: sass warning  bootstrap bug https://reviews.mahara.org/c/mahara/+/13431
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style/scss/sb-admin-2.scss'
import model from './model.json'
import IeecloudSideBar from "./sidebar/IeecloudSideBar.js";
import IeecloudContent from "./content/IeecloudContent.js";


function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    console.log(model)
    const sideBar = new IeecloudSideBar(model.sideBar);
    const sideBarTemplate = sideBar.generateTemplate();


    const content = new IeecloudContent(model.content);
    const contentTemplate = content.generateTemplate();


    const containerElement = document.querySelector("#app");


    const mainTemplate = `
   <div id="wrapper">
   <div id="content-wrapper" class="d-flex flex-column">
    <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; ieecloud 2022</span>
                    </div>
                </div>
            </footer>
   </div>
    </div>
     <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
      </a>
`



    containerElement.insertAdjacentHTML('beforeend', mainTemplate);


    const wrapperElement = document.querySelector("#wrapper");
    wrapperElement?.insertAdjacentHTML('afterbegin', sideBarTemplate);
    sideBar.insertTemplates();

    const contentWrapperElement = document.querySelector("#content-wrapper");
    contentWrapperElement?.insertAdjacentHTML('afterbegin', contentTemplate);

    content.insertTemplates();


});


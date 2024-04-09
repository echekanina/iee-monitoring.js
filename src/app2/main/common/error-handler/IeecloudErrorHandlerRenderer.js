import {Modal} from "bootstrap";
import error500Svg from './assets/cat-500-2.svg'
import error404Svg from './assets/cat-404.svg'
import errorUnknownSvg from './assets/cat-unknown.svg'

export class IeecloudErrorHandlerRenderer {
    #container;
    #modal;


    constructor(containerId) {
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate() {
        const appKey = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__;
        return `<div class="modal fade" id="errorHandlerModal-` + appKey + `"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered error-modal">
    <div class="modal-content">
      <div class="modal-header">
      <div class="icon-box">
<i class="fa-solid fa-xmark"></i>
</div>
      </div>
      <div class="modal-body">
      <div style="display:flex; flex-direction: row">
       <div id="image-error-wrapper-` + appKey + `">

   
</div>
       <div style="width:100%;">
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Произошла ошибка: </label>
  <iframe class="editable-error" id="errorText-` + appKey + `"  ></iframe>
</div>
</div>
      
</div>
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Ok</button>
      </div>
    </div>
  </div>
</div>`;
    }

    render() {
        this.#container.innerHTML = '';
        this.#container.insertAdjacentHTML('beforeend', this.generateTemplate());
        const appKey = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__;
        const modalElement = document.getElementById("errorHandlerModal-" + appKey);

        this.#modal = new Modal(modalElement);
    }

    show(code, message) {
        const appKey = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__;
        const errorTextElement = document.getElementById("errorText-" + appKey);



        if (errorTextElement) {
            errorTextElement.srcdoc = message;
        }

        const modalImgWrapperElement = document.getElementById("image-error-wrapper-" + appKey);

        modalImgWrapperElement.innerHTML = ''

        let errorSvg = code === 500 ? error500Svg : code === 404 ? error404Svg : errorUnknownSvg;

        const imgTemplate = `<img  src="${errorSvg}" height="250" width="300"
              alt="...">`

        modalImgWrapperElement.insertAdjacentHTML('beforeend', imgTemplate);

        this.#modal.show();

    }
}
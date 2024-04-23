import {Modal} from "bootstrap";
import error500Svg from './assets/cat-500-2.svg'
import error404Svg from './assets/cat-404.svg'
import errorUnknownSvg from './assets/cat-unknown.svg'
import errorNetworkSvg from './assets/cat-network.svg'

import msg from './assets/error-msg.json'

export class IeecloudErrorHandlerRenderer {
    #container;
    #modal;
    #appKey;
    #appThemeSettings;


    constructor(containerId, appThemeSettings) {
        this.#container = document.querySelector("#" + containerId);
        this.#appThemeSettings = appThemeSettings;
        this.#appKey = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__;
    }

    generateTemplate() {
        return `<div class="modal fade" id="errorHandlerModal-` + this.#appKey + `"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered error-modal" id="errorHandlerModalDialog-` + this.#appKey + `">
    <div class="modal-content">
      <div class="modal-header">
      <div class="icon-box">
<i class="fa-solid fa-triangle-exclamation"></i>
</div>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div style="display:flex; flex-direction: row">


   
</div>
       <div style="width:100%;">
<div class="mb-3">
<div style="display: flex; flex-direction: row">
 <div id="image-error-wrapper-` + this.#appKey + `"  style="${this.#appThemeSettings.theme.errorImg.settings.currentValue ? '' : 'display:none'}"></div>
  <div class="alert alert-warning" role="alert" style="margin-bottom: 0px;" id="alertErrorWrapper-` + this.#appKey + `" >
</div>
</div>
 
<div style="display: flex; flex-direction: column"> 
<div style="padding-top:1rem;padding-bottom:1rem">
<button type="button" class="btn btn-outline-secondary btn-sm" id="errorDetailsBtn-` + this.#appKey + `">Детали <i class="fa-solid fa-caret-down"></i></button>
</div>

<iframe class="editable-error d-none" id="errorText-` + this.#appKey + `"  ></iframe>
</div>
 
</div>
</div>
      
</div>
         <div class="modal-footer">
        <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Ok</button>
      </div>
      </div>
     
    </div>
  </div>
</div>`;
    }

    render() {
        this.#container.innerHTML = '';
        this.#container.insertAdjacentHTML('beforeend', this.generateTemplate());
        const modalElement = document.getElementById("errorHandlerModal-" + this.#appKey);

        this.#modal = new Modal(modalElement);
        this.#addDomListeners(modalElement);
    }

    show(code, message, isNetwork) {

        const errorTextElement = document.getElementById("errorText-" + this.#appKey);


        if (errorTextElement) {
            errorTextElement.srcdoc = message;
        }

        const modalImgWrapperElement = document.getElementById("image-error-wrapper-" + this.#appKey);

        modalImgWrapperElement.innerHTML = ''
        const alertErrorWrapperElement = document.getElementById("alertErrorWrapper-" + this.#appKey);
        alertErrorWrapperElement.innerHTML = isNetwork ? msg.NetworkErrorMsg : msg.ServerErrorMsg;

        let errorSvg = code === 500 ? error500Svg : code === 404 ? error404Svg : isNetwork ? errorNetworkSvg : errorUnknownSvg;

        if (errorSvg === errorUnknownSvg) {
            alertErrorWrapperElement.innerHTML = msg.UserErrorMsg;
        }

        const imgTemplate = `<img  src="${errorSvg}" height="150" width="200"
              alt="...">`

        modalImgWrapperElement.insertAdjacentHTML('beforeend', imgTemplate);

        this.#modal.show();

    }

    #addDomListeners(modalElement) {
        const scope = this;
        const errorDetailsBtn = document.getElementById("errorDetailsBtn-" + this.#appKey);
        errorDetailsBtn?.addEventListener('click', scope.#errorDetailsBtnClickListener);

        modalElement?.addEventListener('hidden.bs.modal', scope.#errorModalHiddenListener);
    }

    #errorModalHiddenListener = (event) => {
        const scope = this;
        const errorTextElement = document.getElementById("errorText-" + scope.#appKey);
        const errorHandlerModalDialogElement = document.getElementById("errorHandlerModalDialog-" + this.#appKey);
        if (!errorTextElement?.classList.contains('d-none')) {
            errorTextElement?.classList.add('d-none');
            errorHandlerModalDialogElement?.classList.remove('modal-xl')
        }
    }

    #errorDetailsBtnClickListener = (event) => {

        const errorTextElement = document.getElementById("errorText-" + this.#appKey);
        const errorHandlerModalDialogElement = document.getElementById("errorHandlerModalDialog-" + this.#appKey);
        if (errorTextElement) {
            if (errorTextElement.classList.contains('d-none')) {
                errorTextElement?.classList.remove('d-none');
                errorHandlerModalDialogElement?.classList.add('modal-xl');
            } else {
                errorTextElement?.classList.add('d-none');
                errorHandlerModalDialogElement?.classList.remove('modal-xl');
            }

        }


    }
}
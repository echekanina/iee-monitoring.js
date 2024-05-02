import EventDispatcher from "../events/EventDispatcher.js";
import './styles/style.scss';

export default class IeecloudLoginRenderer extends EventDispatcher {
    #container;

    constructor(containerId) {
        super();
        this.#container = document.querySelector("#" + containerId);
    }


    generateTemplate() {
        return `
<div id="layoutAuthentication" class="bg-primary">
 <div id="layoutAuthentication_content">
 <div class="container-xl px-4">
                <div class="row justify-content-center">
                    <div class="col-lg-5">
                        <!-- Basic login form-->
                        <div class="card shadow-lg border-0 rounded-lg mt-5">
                            <div class="card-header justify-content-center"><h4 class="fw-light enter-text my-4">IEE Платформа</h4></div>
                            <div class="card-body">
                                <!-- Login form-->
                                <form id="loginForm">
                                    <!-- Form Group (username)-->
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputLoginUsername">Пользователь</label>
                                        <input class="form-control" id="inputLoginUsername" type="text"
                                               placeholder="Введите Пользователя"/>
                                    </div>
                                    <!-- Form Group (password)-->
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputLoginPassword">Пароль</label>
                                        <input class="form-control" id="inputLoginPassword" type="password"
                                               placeholder="Введите пароль"/>
                                               <div class="invalid-feedback">
    
    </div>
                                    </div>
                                    <!-- Form Group (remember password checkbox)-->
                                    <div class="mb-3 d-none">
                                        <div class="form-check">
                                            <input class="form-check-input" id="rememberPasswordCheck" type="checkbox"
                                                   value="">
                                            <label class="form-check-label" style="font-size: 0.9em;" for="rememberPasswordCheck">Запомнить пароль</label>
                                        </div>
                                    </div>
                                    <!-- Form Group (login box)-->
                                    <div class="d-flex align-items-center justify-content-end mt-4 mb-0">
<!--                                        <a class="small" href="auth-password-basic.html">Forgot Password?</a>-->
                                        <button class="btn btn-primary" type="submit" id="login-btn" style="font-size: 0.875rem;" href="javascript:void(0)">Войти</input>
                                    </div>
                                </form>
                            </div>
<!--                            <div class="card-footer text-center">-->
<!--                                <div class="small"><a href="auth-register-basic.html">Need an account? Sign up!</a>-->
<!--                                </div>-->
<!--                            </div>-->
                        </div>
                    </div>
                </div>
            </div>
 </div>
 <div id="layoutAuthentication_footer">
 <footer class="footer-admin mt-auto footer-dark">
            <div class="container-xl px-4">
                <div class="row">
                    <div class="col-md-6 small">Copyright © ieecloud 2024. Версия: ${__APP_VERSION__}. Дата Сборки:  ${__BUILD_DATE__}.</div>
                </div>
            </div>
        </footer>
 </div>
</div>
    `;
    }

    showValidation(errorInputMsg) {
        let textWrappers = document.querySelectorAll('#loginForm  .invalid-feedback');
        let loginInputs = document.querySelectorAll('#loginForm .form-control');
        loginInputs.forEach(function (input) {
            input.classList.add('is-invalid');
        });
        textWrappers.forEach(function (wrapper) {
            wrapper.innerHTML = errorInputMsg;
        });
    }

    render() {
        this.#container.innerHTML = '';
        const loginTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', loginTemplate);
        this.#addDomListeners();
    }

    destroy() {
        const element = document.getElementById("layoutAuthentication");
        element?.remove();

        this.#removeDomListeners();
    }


    #addDomListeners() {
        const scope = this;
        const loginForm = document.querySelector("#loginForm");
        loginForm?.addEventListener('submit', scope.#loginListener);
    }

    #loginListener = (event) => {
        const scope = this;
        const username = document.getElementById("inputLoginUsername")?.value;
        const password = document.getElementById("inputLoginPassword")?.value;
        scope.dispatchEvent({
            type: 'IeecloudLoginRenderer.loginPressed', value: {username: username, password: password}
        });
    }

    #removeDomListeners() {
        const scope = this;
        const loginBtn = document.querySelector("#login-btn");
        loginBtn?.addEventListener('click', scope.#loginListener);
    }
}
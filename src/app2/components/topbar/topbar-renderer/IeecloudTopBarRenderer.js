import defaultProfileSvg from './assets/undraw_profile.svg'
import profileSvg from './assets/undraw_profile_1.svg'
import profileSvg2 from './assets/undraw_profile_2.svg'
import profileSvg3 from './assets/undraw_profile_3.svg'
import IeecloudTopBarModelMapper from "./IeecloudTopBarModelMapper.js";
import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudTopBarRenderer extends EventDispatcher {
    #viewModel;
    #container;
    #mapper;
    #activeNode;
    #searchBlockLgContainerId;
    #searchBlockSmContainerId;

    constructor(containerId) {
        super();
        this.#mapper = new IeecloudTopBarModelMapper()
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate(userProfile) {
        return `<nav class="topnav navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" id="top-bar">

                    
              
                    <button class="btn btn-icon order-1 order-lg-0 me-2 ms-lg-2 me-lg-0 rounded-circle mr-3" id="sidebarToggle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>


<a class="navbar-brand text-black pe-3 ps-4 ps-lg-2" href="${( "mock" === import.meta.env.MODE ? `/` : `/` + import.meta.env.WEBAPP_NAME)} ">

<span class="ms-2" style="background-color: ${(import.meta.env.ENV_TITLE_FLAG==='true' ? import.meta.env.ENV_COLOR : 'transparent')}">${( import.meta.env.ENV_TITLE_FLAG==='true' ? this.#viewModel.nodes[0].text + ' (' +  import.meta.env.ENV + ')' :  this.#viewModel.nodes[0].text)} </span></a>

                    <!-- Topbar Search -->

        <div class="dropdown d-none d-lg-block" id="search-block">

</div>
    
                   

                    <!-- Topbar Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                        <li class="nav-item dropdown no-arrow  d-lg-none" id="search-block-sm">
                          <a class="nav-link dropdown-toggle"href="javascript:void(0)"  id="searchDropdown" role="button"  data-bs-toggle="dropdown"
                                style="padding-left:0;padding-right: 0">
                                <button class="btn btn-icon rounded-circle" id="searchDropdownBtn" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
                            </a>
                    <!-- Dropdown - Search-->
                    <div class="dropdown-menu dropdown-menu-end p-3 shadow animated--fade-in-up" id="searchDropdownContent">
                        
                    </div>
                </li>
                



                        <!-- Nav Item - Alerts -->
                        <li class="nav-item dropdown no-arrow mx-1 d-none" >
                            <a class="nav-link dropdown-toggle" href="javascript:void(0)"  id="alertsDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-bell fa-fw"></i>
                                <!-- Counter - Alerts -->
                                <span class="badge bg-danger badge-counter">3+</span>
                            </a>
                            <!-- Dropdown - Alerts -->
                            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="alertsDropdown">
                                <h6 class="dropdown-header">
                                    Alerts Center
                                </h6>
                                <a class="dropdown-item d-flex align-items-center"  href="javascript:void(0)">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-primary">
                                            <i class="fas fa-file-alt text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 12, 2019</div>
                                        <span class="font-weight-bold">A new monthly report is ready to download!</span>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center"  href="javascript:void(0)">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-success">
                                            <i class="fas fa-donate text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 7, 2019</div>
                                        $290.29 has been deposited into your account!
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center"  href="javascript:void(0)">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-warning">
                                            <i class="fas fa-exclamation-triangle text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">December 2, 2019</div>
                                        Spending Alert: We've noticed unusually high spending for your account.
                                    </div>
                                </a>
                                <a class="dropdown-item text-center small text-gray-500"  href="javascript:void(0)">Show All Alerts</a>
                            </div>
                        </li>

                        <!-- Nav Item - Messages -->
                        <li class="nav-item dropdown no-arrow mx-1 d-none">
                            <a class="nav-link dropdown-toggle"  href="javascript:void(0)" id="messagesDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-envelope fa-fw"></i>
                                <!-- Counter - Messages -->
                                <span class="badge bg-danger badge-counter">7</span>
                            </a>
                            <!-- Dropdown - Messages -->
                            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="messagesDropdown">
                                <h6 class="dropdown-header">
                                    Message Center
                                </h6>
                                <a class="dropdown-item d-flex align-items-center"  href="javascript:void(0)">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="${profileSvg}"
                                            alt="...">
                                        <div class="status-indicator bg-success"></div>
                                    </div>
                                    <div class="font-weight-bold">
                                        <div class="text-truncate">Hi there! I am wondering if you can help me with a
                                            problem I've been having.</div>
                                        <div class="small text-gray-500">Emily Fowler · 58m</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="javascript:void(0)">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="${profileSvg2}"
                                            alt="...">
                                        <div class="status-indicator"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">I have the photos that you ordered last month, how
                                            would you like them sent to you?</div>
                                        <div class="small text-gray-500">Jae Chun · 1d</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center"  href="javascript:void(0)">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="${profileSvg3}"
                                            alt="...">
                                        <div class="status-indicator bg-warning"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">Last month's report looks great, I am very happy with
                                            the progress so far, keep up the good work!</div>
                                        <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                                    </div>
                                </a>
                                <a class="dropdown-item d-flex align-items-center" href="javascript:void(0)">
                                    <div class="dropdown-list-image mr-3">
                                        <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                            alt="...">
                                        <div class="status-indicator bg-success"></div>
                                    </div>
                                    <div>
                                        <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                                            told me that people say this to all dogs, even if they aren't good...</div>
                                        <div class="small text-gray-500">Chicken the Dog · 2w</div>
                                    </div>
                                </a>
                                <a class="dropdown-item text-center small text-gray-500" href="javascript:void(0)">Read More Messages</a>
                            </div>
                        </li>

                        <div class="topbar-divider d-none d-sm-block d-none"></div>

                        <!-- Nav Item - User Information -->
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle"  href="javascript:void(0)" id="userDropdown" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="me-2 d-none d-lg-inline text-gray-600 small"> ${userProfile ? userProfile.fullName: 'Unknown'} </span>
                                <img class="img-profile rounded-circle"
                                    src="${defaultProfileSvg}">
                            </a>
                            <!-- Dropdown - User Information -->
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                                <a class="dropdown-item"  href="javascript:void(0)">
                                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    ${userProfile ? userProfile.fullName: 'Unknown'}
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" id="logout-platform" href="javascript:void(0)" data-toggle="modal" data-target="#logoutModal">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Выход
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>`;
    }

    render(activeNode, systemModel, userProfile) {
        this.#viewModel = this.#mapper.map(systemModel);
        this.#activeNode = activeNode;
        const template = this.generateTemplate(userProfile);
        this.#container?.insertAdjacentHTML('afterbegin', template);


        this.#searchBlockLgContainerId = "search-block";
        this.#searchBlockSmContainerId = "searchDropdownContent";

        this.#addDomListeners();
    }

    get searchBlockLgContainerId() {
        return this.#searchBlockLgContainerId;
    }

    get searchBlockSmContainerId() {
        return this.#searchBlockSmContainerId;
    }

    #addDomListeners() {
        const scope = this;
        const sidebarToggle = document.querySelector("#sidebarToggle");
        sidebarToggle?.addEventListener('click', function (event) {
            const wrapper = document.querySelector("#wrapper");
            wrapper.classList.toggle("sidenav-toggled");
        });

        const sidebarToggleSmall = document.querySelector("#sidebarToggleTop");
        sidebarToggleSmall?.addEventListener('click', function (event) {
            const wrapper = document.querySelector("#wrapper");
            wrapper.classList.toggle("sidenav-toggled");
        });

        const logoutBtn = document.querySelector("#logout-platform");
        logoutBtn?.addEventListener('click', function (event) {
            scope.dispatchEvent({
                type: 'IeecloudTopBarRenderer.logout'
            });
        });
    }
}
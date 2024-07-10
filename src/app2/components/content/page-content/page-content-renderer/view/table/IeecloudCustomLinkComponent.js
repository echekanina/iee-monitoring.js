import {eventBus} from "../../../../../../main/index.js";

export default class IeecloudCustomLinkComponent {
    eGui;
    eLink;
    eventListener;

    init(params) {
        const valueArray = params.value.split('^');
        this.eGui = document.createElement('div');
        this.eLink = document.createElement('a');
        this.eLink.innerText  = valueArray[0];
        this.eLink.href = 'javascript:void(0)'
        this.eventListener = (event) => {
            eventBus.emit('IeecloudTableMapper.goToRegApplication', valueArray[1], false);
        };
        this.eGui.appendChild(this.eLink);
        this.eLink.addEventListener('click', this.eventListener);
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return true;
    }

    destroy() {
        if (this.eLink) {
            this.eLink.removeEventListener('click', this.eventListener);
        }
    }
}
export default class IeecloudDummyRenderer {
    model;
    constructor(model) {
        this.model = model;
    }

    generateTemplate(){
       return `<div>Dummy</div>`;
    }

    render() {

    }

}
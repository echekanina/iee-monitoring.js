class IeecloudBreadCrumbModeViewModelTree {
    nodes = [];
}

export class IeecloudBreadCrumbViewNode {
    children = [];

    constructor(id, text) {
        this.id = id;
        this.text = text;

    }

    addChild(value) {
        this.children.push(value);
    }

    hasChildren() {
        return this.children.length > 0;
    }

    size() {
        return this.children.length;
    }

}

export default class IeecloudBreadCrumbModelMapper {

    map(model) {
        let result = new IeecloudBreadCrumbModeViewModelTree();
        result.id = model.id + '';

        let treeNodes = model.nodes;
        treeNodes.forEach(node => {
            let viewNode = new IeecloudBreadCrumbViewNode(node.id, node.text);
            viewNode.schemeId = node.schemeId;
            viewNode.properties = node.properties;
            this.#mapNode(node, viewNode);
            result.nodes.push(viewNode);
        });

        return result;
    }

    #mapNode(node, viewNode) {
        const scope = this;
        if (node.hasChildren()) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                let myViewNode = new IeecloudBreadCrumbViewNode(child.id, child.text);
                myViewNode.schemeId = child.schemeId;
                myViewNode.properties = child.properties;
                viewNode.addChild(myViewNode);
                this.#mapNode(child, myViewNode);
            }
        }
    }
}

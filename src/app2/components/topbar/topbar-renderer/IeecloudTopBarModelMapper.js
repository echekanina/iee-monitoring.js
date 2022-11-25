class IeecloudTopBarViewModelTree {
    id;
    nodes = [];
}

class IeecloudTopBarViewNode {
    id;
    text;
    children = [];
    icon = '';
    constructor(id, text) {
        this.id = id;
        this.text = text;

    }

    addChild(value) {
        this.children.push(value);
    }

}

export default class IeecloudTopBarModelMapper {

    map(model) {
        let result = new IeecloudTopBarViewModelTree();
        result.id = model.id + '';

        let treeNodes = model.nodes;
        treeNodes.forEach(node => {
            let viewNode = new IeecloudTopBarViewNode(node.id, node.text);
            viewNode.schemeId = node.schemeId;
            this.#mapNode(node, viewNode);
            result.nodes.push(viewNode);
        });

        return result;
    }

    #mapNode(node, viewNode) {
        if (node.hasChildren()) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                let myViewNode = new IeecloudTopBarViewNode(child.id, child.text);
                myViewNode.schemeId = child.schemeId;
                myViewNode.properties = child.properties;
                viewNode.addChild(myViewNode);
                this.#mapNode(child, myViewNode);
            }
        }
    }
}
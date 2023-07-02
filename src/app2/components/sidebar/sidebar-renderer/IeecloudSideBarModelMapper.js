class IeecloudSideBarViewModelTree {
    id;
    nodes = [];
}

class IeecloudSideBarViewNode {
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

export default class IeecloudSideBarModelMapper {
    iconMapper = {
        "Состояние Объекта" : "fas fa-fw fa-tachometer-alt",
        "Отчеты" : "fas fa-fw fa-table",
        "Аналитика" : "fas fa-fw fa-chart-area",
        "События" : "fas fa-fw fa-chart-area",
        "Геодезический" : "fas fa-fw fa-chart-area",
        "Список Журналов" : "fas fa-fw fa-table"
    };

    map(model) {
        let result = new IeecloudSideBarViewModelTree();
        result.id = model.id + '';

        let treeNodes = model.nodes;
        treeNodes.forEach(node => {
            let viewNode = new IeecloudSideBarViewNode(node.id, node.text);
            viewNode.schemeId = node.schemeId;
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
                let myViewNode = new IeecloudSideBarViewNode(child.id, child.text);
                myViewNode.schemeId = child.schemeId;
                myViewNode.properties = child.properties;
                myViewNode.icon = scope.iconMapper[myViewNode.text];
                viewNode.addChild(myViewNode);
                this.#mapNode(child, myViewNode);
            }
        }
    }
}
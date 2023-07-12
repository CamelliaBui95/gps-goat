class Graph {
    nodes = {};

    addNode(name) {
        this.nodes[name] = new Node(name);
    }

    addEdge(from, to, weight) {
        let fromNode = this.nodes[from];
        let toNode = this.nodes[to];
        if (!fromNode || !toNode) return;

        fromNode.addEdge(fromNode, weight);
        toNode.addEdge(toNode, weight);
    }


}

class Node {
    name;
    edges = [];
    constructor(name) {
        this.name = name;
    }
    
    addEdge(toNode, weight) {
        this.edges.push(new Edge(this, toNode, weight));
    }

    getEdges() {
        return this.edges;
    }

}

class Edge {
    constructor(fromNode, toNode, weight) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.weight = weight;
    }
}

export default Graph;
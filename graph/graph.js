class Graph {
    constructor() {

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

}

class Edge {
    constructor(fromNode, toNode, weight) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.weight = weight;
    }
}

export default Graph;
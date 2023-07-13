import MinPriorityQueue from "./minPriorityQueue.js";
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

    findShortestPath(from, to) {
      const fromNode = this.nodes[from];
      const toNode = this.nodes[to];
      if (!fromNode || !toNode) return [];

      // Number.MAX_SAFE_INTEGER
        const distances = {};
        for (let node in this.nodes)
            distances[node.name] = Number.MAX_SAFE_INTEGER;
        
        distances[fromNode.name] = 0;
        
        const prevNodes = {};
        const visited = new Set();
        const queue = new MinPriorityQueue();
        queue.push(new NodeEntry(fromNode, 0));

        while (!queue.isEmpty()) {
            let current = queue.pop().node;
            visited.add(current);

            for (let edge of current.edges) {
                if (visited.has(edge.toNode))
                    continue;
                
                let newDistance = distances[current.name] + edge.weight;
                if (newDistance < distances[edge.toNode.name]) {
                    distances[edge.toNode.name] = newDistance;
                    prevNodes[edge.toNode.name] = current.name;
                    queue.push(new NodeEntry(edge.toNode, newDistance));
                }
            }
        }
    }

    buildPath() {
        
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

class NodeEntry {
    constructor(node, priority) {
        this.node = node;
        this.priority = priority;
    }
}

export default Graph;
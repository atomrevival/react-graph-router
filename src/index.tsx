import Graph from "graphology";
import React from "react";

export interface RouterNode {
  id: string;
  path: string;
  component: React.ReactNode;
}

export class GraphRouter<T extends RouterNode = RouterNode> {
  public graphRoutes: T[] = [];

  static #graph: Graph = new Graph();

  #nodes = GraphRouter.#graph.nodes();

  private generateNodes = () => {
    const currentGraph = GraphRouter.#graph;

    this.graphRoutes.forEach(({ id }) => {
      if (!currentGraph.hasNode(id)) {
        currentGraph.addNode(id);
      } else {
        console.error(`Node ${id} already exists`);
      }
    });
  };

  /**
   * @returns Array of paths - `string[]`
   */
  public getPaths = () => {
    const nodes = GraphRouter.#graph.nodes();
    return nodes
      .map((id) => this.graphRoutes.find((item) => item.id === id)?.path)
      .filter(Boolean);
  };

  private initialiseEdges = () => {
    const currentGraph = GraphRouter.#graph;
    const nodes = currentGraph.nodes();

    nodes.forEach((id, index) => {
      const [currentNode, nextNode] = [id, nodes[index + 1]];
      if (currentGraph.hasEdge(currentNode, nextNode)) {
        console.error(`Edge already exists for ${currentNode}, ${nextNode}`);
        return;
      }

      if (nextNode) {
        currentGraph.addEdge(currentNode, nextNode);
      }
    });
  };

  /**
   * @returns Number of instantiated nodes in the graph
   */
  public getOrder = () => {
    return GraphRouter.#graph.order;
  };

  public init = () => {
    this.generateNodes();
    this.initialiseEdges();
  };

  public getGraph = () => {
    return GraphRouter.#graph;
  };
}

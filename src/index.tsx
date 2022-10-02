import Graph from "graphology";

import { EdgeAttributes, GraphAttributes, NodeAttributes } from "./types";

// TODO: Separate logic for directed graph instance (segments)
export default class GraphRouter<
  RouterNode extends NodeAttributes = NodeAttributes
> {
  #initialized = false;

  #graphNodes: RouterNode[] = [];

  static #graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes> =
    new Graph();

  #currentGraph = GraphRouter.#graph;

  /**
   * Returns the Graph object
   *
   * NOTE: This is only a copy of the graph object, it will not
   * mutate the graph in the instantiated GraphRouter
   */
  get graph() {
    return this.#currentGraph.copy();
  }

  constructor(nodes: RouterNode[]) {
    if (!this.#initialized) {
      this.#graphNodes = nodes;

      this.initializeNodes(this.#graphNodes);
      this.initializeEdges();

      this.#initialized = true;
    }
  }

  // Initialises nodes and their properties
  protected initializeNodes = (nodes: RouterNode[]) => {
    const currentGraph = this.#currentGraph;

    nodes.forEach((attributes) => {
      const { id, segmentId = "" } = attributes;

      if (currentGraph.hasNode(id)) {
        console.debug(`Node ${id} already exists`);
        return;
      }

      currentGraph.addNode(id, {
        segmentId,
        ...attributes,
      });
    });
  };

  protected initializeEdges = () => {
    const currentGraph = this.#currentGraph;
    const nodes = currentGraph.nodes();

    // TODO: Make sure the order is correct.
    // `nodes()` does not guarantee the correct order for generating edges
    nodes.forEach((id, index) => {
      const [currentNode, nextNode] = [id, nodes[index + 1]];

      if (!currentNode || !nextNode) {
        return;
      }

      // TODO: We can have parallel edges
      // Improve this check
      if (currentGraph.hasEdge(currentNode, nextNode)) {
        console.debug(`Edge already exists for ${currentNode}, ${nextNode}`);
        return;
      }

      const [currentSegment, nextSegment] = [currentNode, nextNode].map(
        (node) => currentGraph.getNodeAttribute(node, "segmentId") || null
      );
      const isSameSegment = currentSegment === nextSegment;

      if (nextNode && isSameSegment) {
        // TODO: Add ability to instantiate undirected edges
        // TODO: Add ability to add edges between other nodes not in the order of #graphNodes
        currentGraph.addDirectedEdge(currentNode, nextNode);
      }
    });
  };

  protected getHeadNodeId = (segmentId?: string) => {
    return this.#graphNodes.find((route) => {
      // Returns the first element that has no segmentId
      if (!segmentId && !route.segmentId) {
        return true;
      }

      // Returns the first element that has the given segmentId
      if (route.segmentId && route.segmentId === segmentId) {
        return true;
      }

      return false;
    })?.id;
  };

  protected generateSegment = (nodeId = "", segment: string[] = []) => {
    // TODO: nodes can appear twice in a segment
    // Updates current segment
    const currentSegment = segment;

    // Get all directed neighbors
    const currentGraph = this.#currentGraph;
    const neighbors = currentGraph.outboundNeighbors(nodeId);

    // If all nodes already exist in the segment, return segment
    const isEveryNodeAdded = neighbors.every((node) =>
      currentSegment.includes(node)
    );

    // Update segment with neighbors if they don't exist in the segment yet
    if (!isEveryNodeAdded) {
      neighbors.forEach((neighborNodeId) => {
        if (!currentSegment.includes(neighborNodeId)) {
          currentSegment.push(neighborNodeId);
        }
      });

      const tailNode = currentSegment[currentSegment.length - 1];
      this.generateSegment(tailNode, currentSegment);
    }

    return currentSegment;
  };

  protected getNode = (nodeId: string) => {
    const currentGraph = this.#currentGraph;
    return nodeId ? currentGraph.getNodeAttributes(nodeId) : null;
  };

  /**
   * Lists all segments IDs available on initialisation
   */
  public get segmentIds() {
    const currentGraph = this.#currentGraph;
    const nodes = currentGraph.nodes();

    const segments = nodes.map((node) =>
      currentGraph.getNodeAttribute(node, "segmentId")
    );

    return [...new Set(segments)].filter(Boolean) as string[];
  }

  /**
   * Lists IDs based on segment or starting node
   */
  public getSegment({
    segmentId,
    id: nodeId,
  }: {
    segmentId?: string;
    id?: string;
  } = {}) {
    try {
      const segmentIds = this.segmentIds;

      if (segmentId) {
        if (segmentId && !segmentIds.includes(segmentId)) {
          throw Error(
            `segmentId "${segmentId}" does not exist in the instance.`
          );
        }
      }

      // TODO: Fix logic when segmentId is undefined and nodeId is defined
      if ((!nodeId && segmentId !== undefined) || (!nodeId && !segmentId)) {
        const firstNodeId = this.getHeadNodeId(segmentId);
        return this.generateSegment(firstNodeId) ?? null;
      }

      if (nodeId && segmentId === undefined) {
        const firstNodeSegmentId = this.getNode(nodeId)?.segmentId ?? "";
        const isInSegment = firstNodeSegmentId === (segmentId ?? "");

        console.log(isInSegment, firstNodeSegmentId);

        if (!isInSegment) {
          throw Error(
            `"${nodeId}" does not exist in the segment "${segmentId}".`
          );
        }
        return this.generateSegment(nodeId);
      }

      return this.generateSegment(nodeId);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @returns Number of instantiated nodes in the graph
   */
  public get order() {
    return GraphRouter.#graph.order;
  }
}

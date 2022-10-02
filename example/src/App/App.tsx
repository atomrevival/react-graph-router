import Graph from "graphology";
import { circular, random } from "graphology-layout";
import React, { useEffect, useRef } from "react";
import Sigma from "sigma";

import GraphRouter from "../../../src/index";
import { NodeAttributes } from "../../../src/types";

enum Feature {
  One = "isa", // 1 in Filipino
  Two = "dos", // 2 in Spanish
  Three = "trois", // 3 in French
  Four = "chetyre", // 4 in Russian
  Five = "go", // 5 in Japanese
  Six = "shist", // 6 in Ukrainian
  Seven = "sju", // 7 in Swedish
}

enum Segment {
  Pentateuch = "pentateuch",
  Neviim = "neviim",
}

export const App = () => {
  const featureRouter = new GraphRouter<NodeAttributes>([
    {
      id: Feature.One,
      path: "/en",
      component: <h1>ONE</h1>,
      segmentId: Segment.Pentateuch,
    },
    {
      id: Feature.Two,
      path: "/to",
      component: <h2>TWO</h2>,
      segmentId: Segment.Pentateuch,
    },
    {
      id: Feature.Three,
      path: "/tre",
      component: <h3>THREE</h3>,
      segmentId: Segment.Pentateuch,
    },
    {
      id: Feature.Four,
      path: "/fire",
      component: <h4>FOUR</h4>,
      segmentId: Segment.Pentateuch,
    },
    {
      id: Feature.Five,
      path: "/fem",
      component: <h5>FIVE</h5>,
      segmentId: Segment.Pentateuch,
    },

    {
      id: Feature.Six,
      path: "/seks",
      component: <h6>SIX</h6>,
      segmentId: Segment.Neviim,
    },
    {
      id: Feature.Seven,
      path: "/sju",
      component: <p>SEVEN</p>,
      segmentId: Segment.Neviim,
    },
  ]);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = divRef.current;

    if (container) {
      // Get the copy of the Graph
      const graph = featureRouter.graph as Graph<
        NodeAttributes & { label: string; size: number; color: string }
      >;

      // Add edge attributes to be rendered and read by Sigma
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(
          edge,
          "label",
          graph.getNodeAttribute(graph.extremities(edge)[0], "segmentId")
        );
        graph.setEdgeAttribute(edge, "size", 2);
        graph.setEdgeAttribute(edge, "color", "#888");
      });

      // Add node attributes to be rendered and read by Sigma
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "label", node);
        graph.setNodeAttribute(node, "size", 15);
        graph.setNodeAttribute(node, "color", "red");
      });

      circular.assign(graph);

      new Sigma(graph, container, { renderEdgeLabels: true });
    }
  }, []);

  return <div style={{ width: "100wh", height: "100vh" }} ref={divRef} />;
};

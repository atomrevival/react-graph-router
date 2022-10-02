import { Attributes } from "graphology-types";
import { ReactNode } from "react";

export type NodeAttributes = {
  id: string;
  path: string;
  component?: ReactNode;
  segmentId?: string;
};
export type EdgeAttributes = Attributes;
export type GraphAttributes = Attributes;

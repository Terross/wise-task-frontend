import { EdgeProps } from "@vue-flow/core";

type EdgeData = {
  color?: string;
  weight?: string | number;
};

export enum ConnectionSourceID {
  Right = "source-a",
  Left = "source-b",
  Top = "source-c",
  Bottom = "source-d",
}

export enum ConnectionTargetID {
  Right = "target-a",
  Left = "target-b",
  Top = "target-c",
  Bottom = "target-d",
}

export interface CustomEdge extends EdgeProps {
  data: EdgeData;
  sourceHandle?: ConnectionSourceID;
  targetHandle?: ConnectionTargetID;
  isSelected?: boolean;
}

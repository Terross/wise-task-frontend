import { EdgeProps } from "@vue-flow/core";

type EdgeData = {
  color?: string;
  weight?: string | number;
};

export interface CustomEdge extends EdgeProps {
  data: EdgeData;
}

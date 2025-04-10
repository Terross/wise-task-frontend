export type CustomNode = {
  id: string;
  position: { x: number; y: number };
  type: "special";
  data: {
    size?: { width: number; height: number };
    weight?: number;
    label?: string;
    color?: string;
  };
  parentNode?: string;
  selected?: boolean;
};

export type NodeGroup = {
  nodeIds: string[];
};

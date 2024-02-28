import * as vNG from "v-network-graph"
import { Node, Edge } from "./graph"

export const configs = vNG.defineConfigs<Node, Edge>({
    node: {
        normal: {
          type: "circle",
          color: node => node.color
        },
        hover: {
          color: node => node.color
        },
        selectable: true,
        label: {
          visible: node => !!node.label,
        },
        focusring: {
          color: "darkgray",
        },
      },
      edge: {
        normal: {
          color: edge => edge.color,
        },
      },
})
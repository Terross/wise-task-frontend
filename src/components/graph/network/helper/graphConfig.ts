import * as vNG from "v-network-graph"
import { Node, Edge } from "./graph"

export const undirectGraphConfigs = vNG.defineConfigs<Node, Edge>({
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
          visible: node => !!(node.label || node.weight),
        },
        focusring: {
          color: "darkgray",
        },
      },
      edge: {
        normal: {
          color: edge => edge.color,
        },
        marker: {
          source: {
            type: "none",
            width: 4,
            height: 4,
            margin: -1,
            offset: 0,
            units: "strokeWidth",
            color: null,
          },
          target: {
            type: "none",
            width: 4,
            height: 4,
            margin: -1,
            offset: 0,
            units: "strokeWidth",
            color: null,
          },
        }
      }
})

export const directGraphConfigs = vNG.defineConfigs<Node, Edge>({
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
        visible: node => !!(node.label || node.weight),
      },
      focusring: {
        color: "darkgray",
      },
    },
    edge: {
      normal: {
        color: edge => edge.color,
      },
      marker: {
        source: {
          type: "none",
          width: 4,
          height: 4,
          margin: -1,
          offset: 0,
          units: "strokeWidth",
          color: null,
        },
        target: {
          type: "arrow",
          width: 4,
          height: 4,
          margin: -1,
          offset: 0,
          units: "strokeWidth",
          color: null,
        },
      }
    },
})
<template>
  <div class="graph-container" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Network, Node, Edge } from 'vis-network';
import { DataSet } from 'vis-data';
import { RelationsGraph, GraphGenerationType } from '../types/RelationsGraph';
import { createGraphData } from './utils/utils';


interface Props {
  graph: RelationsGraph;
  answerGraph?: RelationsGraph;
  highlightEdge?: { from: number; to: number } | null;
  mode: string;
}


const props = defineProps<Props>();
const containerRef = ref<HTMLDivElement>();
const network = ref<Network | null>(null);
const nodes = ref<DataSet<Node>>(new DataSet());
const edges = ref<DataSet<Edge>>(new DataSet());


const options = {
  layout: { improvedLayout: false, randomSeed: 42 },
  nodes: {
    size: 30,
    font: {
      size: 30,
      face: 'Arial',
      align: 'center',
      color: '#2c3e50',
      strokeWidth: 3,
      strokeColor: '#ffffff'
    },
    shape: 'circle',
    color: {
      background: '#b1fbf2',
      border: '#027cff',
      highlight: { background: '#a3fff6', border: '#0224ff' },
      hover: { background: '#a3fff6', border: '#0224ff' }
    },
    borderWidth: 2,
    borderWidthSelected: 4,
    shadow: {
      enabled: true,
      color: 'rgba(0,0,0,0.2)',
      size: 10,
      x: 5,
      y: 5
    },
  },
  edges: {
    selfReference: { size: 20, angle: Math.PI / 4 },
    color: {
      color: '#027cff',
      opacity: 1.0,
      highlight: '#027cff',
      hover: '#8000ac',
    },
    width: 2,
    selectionWidth: 4,
    smooth: { type: 'continuous', roundness: 0.5 },
    font: {
      size: 17,
      face: 'Arial',
      strokeWidth: 5,
      color: '#2c3e50',
      align: 'middle'
    },
  },
  interaction: {
    zoomView: false,
    dragView: false,
    dragNodes: false,
    multiselect: false,
    hover: true,
  },
  physics: {
    enabled: true,
    stabilization: { enabled: true, iterations: 50, updateInterval: 10 },
    solver: 'repulsion',
    repulsion: {
      nodeDistance: 1,
      springLength: 1,
      springConstant: 0,
      centralGravity: 0.1
    }
  }
};


const initializeGraph = () => {
  if (!containerRef.value) return;

  const graphData = createGraphData(props.graph, props.answerGraph, props.mode);
  nodes.value = graphData.nodes;
  edges.value = graphData.edges;

  const nodeCount = nodes.value.length;
  const radius = 170;
  const center = { x: 0, y: 0 };

  nodes.value.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / nodeCount - 7;
    nodes.value.update({
      id: node.id,
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    });
  });
  network.value = new Network(containerRef.value, { nodes: nodes.value, edges: edges.value }, options);
};


const updateEdgeHighlight = (from: number, to: number, highlight: boolean) => {
  const edge = edges.value.get({
    filter: (e: Edge) => e.from === from && e.to === to ||
    (props.graph.GenType === GraphGenerationType.SYMMETRICAL && e.from === to && e.to === from)
  })[0];

  if (edge) {
    const originalColor = (edge.color as any)?.originalColor || '#027cff';
    edges.value.update({
      id: edge.id,
      color: {
        color: highlight ? '#cd00cd' : originalColor,
        originalColor: originalColor
      },
      width: highlight ? 4 : 2
    });
  }
};


onMounted(initializeGraph);


watch(() => props.graph, initializeGraph, { deep: true });


watch(() => props.highlightEdge, (newHighlight, oldHighlight) => {
  if (oldHighlight) {
    updateEdgeHighlight(oldHighlight.from, oldHighlight.to, false);
  }
  if (newHighlight) {
    updateEdgeHighlight(newHighlight.from, newHighlight.to, true);
  }
});


onUnmounted(() => {
  network.value?.destroy();
});
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 370px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
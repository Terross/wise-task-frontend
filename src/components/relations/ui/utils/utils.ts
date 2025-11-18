import { RelationsGraph, GraphGenerationType } from '@/components/relations/types/RelationsGraph';
import { GraphData, MatrixCell, GraphUIOptions } from '@/components/relations/ui/types/types';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';

export function createGraphData(
    graph: RelationsGraph,
    answerGraph: RelationsGraph | null = null,
    mode: string = 'default'
): GraphData {

    const nodes = new DataSet<Node>([]);
    const edges = new DataSet<Edge>([]);
    const matrix = graph.Matrix;

    for (let i = 0; i < matrix.length; i++) {
        nodes.add({
            id: i,
            label: `${i}`,
        });
    }

    const graphType = graph.GenType;
    let border = matrix.length;

    for (let i = 0; i < matrix.length; i++) {
        if (graphType === GraphGenerationType.SYMMETRICAL) {
            border = i + 1;
        }

        for (let j = 0; j < border; j++) {
            if (matrix[i][j] > 0) {
                let currentColor = GraphUIOptions.blueArrow;
                if (['training', 'demonstration'].includes(mode) && answerGraph && answerGraph.Matrix[i][j] !== matrix[i][j]) {
                    currentColor = GraphUIOptions.redArrow;
                }

                const edgeConfig: any = {
                    from: i,
                    to: j,
                    color: {
                        color: currentColor,
                        originalColor: currentColor
                    },
                    font: {color: currentColor}
                };

                if (graphType !== GraphGenerationType.SYMMETRICAL) {
                    edgeConfig.arrows = 'to';
                }

                if (matrix[i][j] > 1) {
                    edgeConfig.label = String(matrix[i][j]);
                }

                edges.add(edgeConfig);
            }
        }
    }

    return { nodes, edges };
}
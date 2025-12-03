import {defineStore} from 'pinia';
import {GraphGenerationType, MultiplyType, RelationsGraph} from '@/components/relations/types/RelationsGraph';

interface GraphState {
    isCreated: boolean;
    countGraphs: number;
    graphs: RelationsGraph[];
    answerGraphs: RelationsGraph[];
    states: boolean[];
    currentPower: number;
    currentMultiplyType: MultiplyType;
}

export const useRelationsGraphStore = defineStore('relationsGraph', {
    state: (): GraphState => ({
        isCreated: false,
        countGraphs: 0,
        graphs: [],
        answerGraphs: [],
        states: [],
        currentPower: 0,
        currentMultiplyType: MultiplyType.CLASSIC
    }),

    getters: {
        graphCount: (state) => state.countGraphs,

        lastGraph: (state) => state.graphs[state.countGraphs - 1],

        lastAnswerGraph: (state) => state.answerGraphs[state.countGraphs - 1],

        firstGraph: (state) => state.graphs[0],

        created: (state) => state.isCreated,

        getCurrentPower: (state) => state.currentPower,

        getGraphById: (state) => {
            return (index: number): RelationsGraph => {
                return state.graphs[index];
            };
        },

        getAnswerGraphById: (state) => {
            return (index: number): RelationsGraph => {
                return state.answerGraphs[index];
            };
        },

        getStateById: (state) => {
            return (index: number): boolean => {
                return state.states[index];
            }
        }
    },

    actions: {
        createGraph(size: number, edgNumber: number, graphGenType: GraphGenerationType): void {
            this.clearGraphs();
            const newGraph = new RelationsGraph(size, edgNumber, graphGenType);
            this.answerGraphs.push(newGraph);
            this.graphs.push(newGraph);
            this.states.push(true);

            this.countGraphs++;
            this.isCreated = true;
            this.currentPower = 1;
        },

        addGraph(multiplyType?: MultiplyType, multiplyPower?: number): void {
            if (!multiplyType) multiplyType = this.currentMultiplyType;
            if (!multiplyPower) multiplyPower = Number(this.currentPower) + 1;
            const newAnswerGraph = new RelationsGraph();
            newAnswerGraph.clone(this.firstGraph);


            switch(multiplyType) {
                case MultiplyType.CLASSIC:
                    newAnswerGraph.classicMultiply(multiplyPower);
                    break;
                case MultiplyType.LOGICAL:
                    newAnswerGraph.logicalMultiply(multiplyPower);
                    break;
                case MultiplyType.TROPICAL:
                    newAnswerGraph.tropicalMultiply(multiplyPower);
                    break;
            }

            this.answerGraphs.push(newAnswerGraph);
            const newGraph = new RelationsGraph();
            newGraph.clone(this.lastAnswerGraph);
            newGraph.setHideEdges();
            this.graphs.push(newGraph);
            this.states[this.countGraphs - 1] = true;
            this.states.push(false);

            this.countGraphs++;
            this.isCreated = true;
            this.currentPower = multiplyPower;
            this.currentMultiplyType = multiplyType;
        },

        clearGraphs(): void {
            this.graphs = [];
            this.answerGraphs = [];
            this.states = [];
            this.countGraphs = 0;
            this.isCreated = false;
        },

        clearWithoutFirst(): void {
            this.graphs = [this.firstGraph];
            this.answerGraphs = [this.firstGraph];
            this.states = [true];
            this.countGraphs = 1;
            this.isCreated = true;
        },
    }
});

interface SelectState {
    graphType: GraphGenerationType;
    countVertex: string;
    countEdge: string;
}

export const useSelectGraphStore = defineStore('relationsSelect', {
    state: (): SelectState => ({
        graphType: '',
        countVertex: '-1',
        countEdge: '-1',
    }),

    getters: {
        graphGenType: (state) => state.graphType,

        graphCountVertex: (state) => state.countVertex,

        graphCountEdge: (state) => state.countEdge
    },

    actions: {
        updateState(graphType: string, countVertex: number, countEdge: number): void {
            this.graphType = graphType;
            this.countVertex = String(countVertex);
            this.countEdge = String(countEdge);
        },

        setDefault(): void {
            this.graphType = '';
            this.countVertex = '-1';
            this.countEdge = '-1';
        }
    }
})


interface SelectMultiply {
    multiplyType: MultiplyType;
    multiplyPower: number;
}

export const useSelectMultiplyStore = defineStore('relationsMultiply', {
    state: () : SelectMultiply => ({
        multiplyType: MultiplyType.CLASSIC,
        multiplyPower: 2
    }),

    getters: {
        selectedMultiplyType: (state) => state.multiplyType,

        selectedMultiplyPower: (state) => state.multiplyPower
    },

    actions: {
        updateType(multiplyType: MultiplyType): void {
            this.multiplyType = multiplyType;
        },

        updatePower(multiplyPower: number): void {
            this.multiplyPower = multiplyPower;
        },

        setDefault(): void {
            this.multiplyType = MultiplyType.CLASSIC;
            this.multiplyPower = 2;
        }
    }
})
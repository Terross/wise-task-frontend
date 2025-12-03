import {RelationsGraph} from "@/components/relations/types/RelationsGraph";


export enum GraphUIOptions {
    redArrow= "#FF4500",
    blueArrow = "#027cff",
}


export interface GraphData {
    nodes: vis.DataSet<vis.Node>;
    edges: vis.DataSet<vis.Edge>;
}


export interface MatrixCell {
    row: number;
    col: number;
    value: number;
    isCorrect?: boolean;
    isEditable?: boolean;
}


export type RenderMode = 'training' | 'check' | 'demonstration' | 'default';


export interface SelectOption {
    value: string;
    text: string;
}


export interface GraphInstance {
    currentGraph: RelationsGraph;
    answerGraph: RelationsGraph;
    mode: RenderMode;
    isLocked: boolean;
    text: string;
}
export enum GraphUIOptions {
    redArrow= "#FF4500",
    blueArrow = "#027cff",
    blueCell = "#d8f8f1",
    highlightArrow = "#cd00cd",
    redCell = "#ffaaaa",
    defaultCell = "#f9f9f9"
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

export interface DemonstrationState {
    currentStep: number;
    totalSteps: number;
    isPlaying: boolean;
    speed: number;
}
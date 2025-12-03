export enum GraphGenerationType {
    DEFAULT = 'DEFAULT',
    SYMMETRICAL = 'SYMM',
    ASYMMETRICAL = 'ASYMM',
    ANTISYMMETRICAL = 'ANTISYMM'
}

export enum MultiplyType {
    CLASSIC = 'CLASSIC',
    LOGICAL = 'LOGICAL',
    TROPICAL = 'TROPICAL'
}

export class RelationsGraph {
    genType: GraphGenerationType = GraphGenerationType.DEFAULT;
    size: number = 0;
    edgeNumber: number = 0;
    sumWeights: number = 0;
    connectedComponents: number = 0;
    matrix: number[][] = [];


    constructor(
        size?: number,
        edgeNumber?: number,
        genType: GraphGenerationType = GraphGenerationType.DEFAULT
    ) {
        if (size === undefined) {
            this.size = 0;
            this.matrix = [];
            this.genType = GraphGenerationType.DEFAULT;
            return;
        }
        this.size = size;
        this.edgeNumber = edgeNumber ?? 0;
        this.genType = genType;
        this.connectedComponents = 0;

        while (this.connectedComponents !== 1) {
            this.matrix = Array.from({ length: this.size },
                () => new Array(this.size).fill(0));

            switch (genType) {
                case GraphGenerationType.DEFAULT:
                    this.generateDefault();
                    break;
                case GraphGenerationType.SYMMETRICAL:
                    this.generateSymmetrical();
                    break;
                case GraphGenerationType.ASYMMETRICAL:
                    this.generateAsymmetrical();
                    break;
                case GraphGenerationType.ANTISYMMETRICAL:
                    this.generateAntisymmetrical();
                    break;
                default:
                    throw new Error(`Unknown graph generation type: ${genType}`);
            }
            this.connectedComponents = this.findConnectedComponents();
        }
    }


    clone(oldGraph: RelationsGraph): void {
        this.genType = oldGraph.genType;
        this.size = oldGraph.size;
        this.edgeNumber = oldGraph.edgeNumber;
        this.sumWeights = oldGraph.sumWeights;
        this.connectedComponents = oldGraph.connectedComponents;
        this.matrix = oldGraph.matrix.map(row => [...row]);
    }


    findConnectedComponents(): number {
        if (this.size === 0) return 0;

        const nodes = new Set<number>();
        for (let i = 0; i < this.size; i++) nodes.add(i);

        let components = 0;
        while (nodes.size > 0) {
            const firstNode = nodes.values().next().value;
            const visitedNodes = BFS(this, firstNode);
            for (const node of visitedNodes) nodes.delete(node);
            components++;
        }
        return components;
    }


    generateDefault(): void {
        let edgesAdded = 0;
        while (edgesAdded < this.edgeNumber) {
            const i = Math.floor(Math.random() * this.size);
            const j = Math.floor(Math.random() * this.size);
            if (this.matrix[i][j] === 1) continue;

            this.matrix[i][j] = 1;
            edgesAdded++;
        }
    }


    generateSymmetrical(): void {
        let edgesAdded = 0;
        while (edgesAdded < this.edgeNumber) {
            const i = Math.floor(Math.random() * this.size);
            const j = Math.floor(Math.random() * this.size);
            if (this.matrix[i][j] == 1)
                continue;

            this.matrix[i][j] = 1;
            this.matrix[j][i] = 1;
            edgesAdded++;
        }
    }


    generateAntisymmetrical(): void {
        let edgesAdded = 0;
        while (edgesAdded < this.edgeNumber) {
            const i = Math.floor(Math.random() * this.size);
            const j = Math.floor(Math.random() * this.size);
            if (this.matrix[i][j] === 1 || this.matrix[j][i] === 1)
                continue;

            this.matrix[i][j] = 1;
            edgesAdded++;
        }
    }


    generateAsymmetrical(): void {
        let edgesAdded = 0;
        while (edgesAdded < this.edgeNumber) {
            const i = Math.floor(Math.random() * this.size);
            const j = Math.floor(Math.random() * this.size);
            if (i === j || this.matrix[i][j] === 1 || this.matrix[j][i] === 1)
                continue;

            this.matrix[i][j] = 1;
            edgesAdded++;
        }
    }

    setHideEdges(): void {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.changeEdge(i, j, -1);
            }
        }
    }


    neighbors(idx: number): number[] {
        let result = [];
        for (let i = 0; i < this.matrix[idx].length; i++) {
            if (this.matrix[idx][i]) {
                result.push(i);
            }
            if (this.matrix[i][idx]) {
                result.push(i);
            }
        }
        return result;
    }


    countEdges(): number {
        let edgeNumber = 0;
        for (const row of this.matrix) {
            for (const element of row) {
                if (element) edgeNumber++;
            }
        }
        return edgeNumber;
    }


    countWeights(): number {
        let sumWeights = 0;
        for (let row of this.matrix) {
            for (let element of row) {
                if (element) {
                    sumWeights += element;
                }
            }
        }
        return sumWeights;
    }


    classicMultiply(power: number): void {
        if (power < 1) {
            throw new Error("Bad power");
        }
        let newMatrix = this.matrix.map(row => [...row]);
        for (let i = 1; i < power; i++) {
            newMatrix = classicMatrixMultiply(newMatrix, this.matrix);
        }
        this.matrix = newMatrix;
        this.edgeNumber = this.countEdges();
        this.sumWeights = this.countWeights();
        this.connectedComponents = this.findConnectedComponents();
    }


    logicalMultiply(power: number): void {
        if (power < 1) {
            throw new Error("Bad power");
        }
        let newMatrix = this.matrix.map(row => [...row]);
        for (let i = 1; i < power; i++) {
            newMatrix = logicalMatrixMultiply(newMatrix, this.matrix);
        }
        this.matrix = newMatrix;
        this.edgeNumber = this.countEdges();
        this.sumWeights = this.countWeights();
        this.connectedComponents = this.findConnectedComponents();
    }


    tropicalMultiply(power: number): void {
        if (power < 1) {
            throw new Error("Bad power");
        }
        let newMatrix = this.matrix.map(row => [...row]);
        for (let i = 1; i < power; i++) {
            newMatrix = tropicalMatrixMultiply(newMatrix, this.matrix);
        }
        this.matrix = newMatrix;
        this.edgeNumber = this.countEdges();
        this.sumWeights = this.countWeights();
        this.connectedComponents = this.findConnectedComponents();
    }

    changeEdge(i: number, j: number, val: number): void {
        if (this.genType === GraphGenerationType.SYMMETRICAL) this.matrix[j][i] = val;
        this.matrix[i][j] = val;
    }


    get Matrix(): number[][] { return this.matrix; }


    get GenType(): GraphGenerationType { return this.genType; }


    get Size(): number { return this.size; }


    get EdgeNumber(): number { return this.edgeNumber; }


    isEquals(otherGraph: RelationsGraph): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.matrix[i][j] !== otherGraph.Matrix[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }


    findMaxWeight(): number {
        let maxWeight = this.matrix[0][0];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.matrix[i][j] > maxWeight) maxWeight = this.matrix[i][j];
            }
        }
        return maxWeight;
    }
}


export function classicMatrixMultiply(first: number[][], second: number[][]): number[][] {
    const rows1 = first.length;
    const cols1 = first[0].length;
    const rows2 = second.length;
    const cols2 = second[0].length;
    if (cols1 !== rows2) {
        throw new Error("Number of columns in first matrix must equal number of rows in second matrix");
    }

    const newMatrix: number[][] = [];
    for (let i = 0; i < rows1; i++) {
        const newRow: number[] = [];
        for (let j = 0; j < cols2; j++) {
            let temp = 0;
            for (let k = 0; k < cols1; k++) {
                temp += first[i][k] * second[k][j];
            }
            newRow.push(temp);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}


function logicalMatrixMultiply(first: number[][], second: number[][]): number[][] {
    let rows1 = first.length;
    let cols1 = first[0].length;
    let rows2 = second.length;
    let cols2 = second[0].length;
    if (cols1 !== rows2) {
        throw new Error(
            "Number of columns in first matrix must equal number of rows in second matrix");
    }

    let newMatrix = [];
    for (let i = 0; i < rows1; i++) {
        let newRow = [];
        for (let j = 0; j < cols2; j++) {
            let temp = false;
            for (let k = 0; k < cols1; k++) {
                if (first[i][k] && second[k][j]) {
                    temp = true;
                    break;
                }
            }
            newRow.push(temp ? 1 : 0);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}


function tropicalMatrixMultiply(first: number[][], second: number[][]): number[][] {
    let rows1 = first.length;
    let cols1 = first[0].length;
    let rows2 = second.length;
    let cols2 = second[0].length;
    if (cols1 != rows2) {
        throw new Error(
            "Number of columns in first matrix must equal number of rows in second matrix");
    }

    let newMatrix =
        Array.from({ length: rows1 }, () => new Array(cols2).fill(-Infinity));

    for (let i = 0; i < rows1; i++) {
        for (let j = 0; j < cols2; j++) {
            for (let k = 0; k < cols1; k++) {
                const firstVal = first[i][k] === 0 ? -Infinity : first[i][k];
                const secondVal = second[k][j] === 0 ? -Infinity : second[k][j];

                newMatrix[i][j] =
                    Math.max(newMatrix[i][j], firstVal + secondVal);
            }
            newMatrix[i][j] =
                newMatrix[i][j] === -Infinity ? 0 : newMatrix[i][j];
        }
    }
    return newMatrix;
}


export function BFS(graph: RelationsGraph, startIndex: number): Set<number> {
    const visited = new Set<number>();
    const toVisit: number[] = [startIndex];

    while (toVisit.length > 0) {
        const nodeIndex = toVisit.shift()!;
        if (!visited.has(nodeIndex)) {
            visited.add(nodeIndex);
            const neighbors = graph.neighbors(nodeIndex);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) toVisit.push(neighbor);
            }
        }
    }
    return visited;
}
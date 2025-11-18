import { ref, computed, type Ref } from 'vue';
import type { GraphGenerationType } from '@/components/relations/types/RelationsGraph';
import { SelectOption } from "@/components/relations/ui/types/types";

export function useGraphCalculations(vertexCount: Ref<number>, graphType: Ref<GraphGenerationType>) {
    const getMaxEdges = (vertices: number, type: GraphGenerationType): number => {
        if (vertices <= 0) return 0;

        switch (type) {
            case 'SYMM':
            case 'ANTISYMM':
                return vertices + (vertices * (vertices - 1)) / 2;
            case 'ASYMM':
                return (vertices * (vertices - 1)) / 2;
            default:
                return vertices * vertices;
        }
    };

    const minEdges = computed(() => {
        const vertices = vertexCount.value;
        return vertices > 0 ? vertices - 1 : 0;
    });

    const maxEdges = computed(() => {
        const vertices = vertexCount.value;
        const type = graphType.value;
        return vertices > 0 ? getMaxEdges(vertices, type) : 0;
    });

    const edgeOptions = computed((): SelectOption[] => {
        const min = minEdges.value;
        const max = maxEdges.value;

        if (min <= 0 || max <= 0) {
            return [{ value: '-1', text: 'Не выбрано' }];
        }

        const options: SelectOption[] = [];
        for (let i = min; i <= max; i++) {
            options.push({ value: i.toString(), text: i.toString() });
        }
        return options;
    });

    return {
        minEdges,
        maxEdges,
        edgeOptions,
        getMaxEdges
    };
}
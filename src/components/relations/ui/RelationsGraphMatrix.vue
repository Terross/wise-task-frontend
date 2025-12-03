<template>
  <div class="matrix-container">
    <table class="graph-matrix">
      <thead>
      <tr>
        <th></th>
        <th v-for="col in size" :key="col" :class="getColumnHeaderClass(col-1)">{{ col - 1 }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in size" :key="row">
        <th :class="getRowHeaderClass(row-1)">{{ row - 1 }}</th>
        <td
            v-for="col in size"
            :key="col"
            :class="getCellClass(row-1, col-1)"
            @mouseenter="onCellHover(row-1, col-1)"
            @mouseleave="onCellLeave(row-1, col-1)"
        >
          <input
              v-if="isEditable"
              :ref="el => setInputRef(el, row-1, col-1)"
              type="text"
              :value="getInputValue(row-1, col-1)"
              :maxlength="maxLength"
              :readonly="isLocked"
              @input="onInputChange($event, row-1, col-1)"
              @blur="onInputBlur($event, row-1, col-1)"
              @keydown.enter="onInputEnter($event, row-1, col-1)"
          />
          <span v-else>{{ getDisplayValue(row-1, col-1) }}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import { RelationsGraph } from '../types/RelationsGraph';


interface Props {
  graph: RelationsGraph;
  answerGraph?: RelationsGraph;
  mode: 'default' | 'training' | 'check' | 'demonstration';
  isLocked?: boolean;
  onCellChange?: (row: number, col: number, value: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onCellLeave?: (row: number, col: number) => void;
  demonstrationStep?: number;
  totalSteps?: number;
}


const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
  onCellChange: () => {},
  onCellHover: () => {},
  onCellLeave: () => {},
  demonstrationStep: 0,
  totalSteps: 0
});


const emit = defineEmits<{
  demonstrationCellRevealed: [row: number, col: number, value: number];
}>();


const inputRefs = ref<Record<string, HTMLInputElement>>({});
const localInputValues = ref<Record<string, string>>({});
const size = computed(() => props.graph.size);
const isEditable = computed(() =>
    ['training', 'check'].includes(props.mode) && !props.isLocked
);
const isDemonstrationMode = computed(() => props.mode === 'demonstration');
const maxLength = computed(() => {
  const maxWeight = props.answerGraph?.findMaxWeight() || props.graph.findMaxWeight();
  return String(maxWeight).length;
});


const activeRow = ref<number | null>(null);
const activeCol = ref<number | null>(null);


watch(() => props.demonstrationStep, (newStep, oldStep) => {
  if (!isDemonstrationMode.value || !props.answerGraph) return;
  if (newStep === undefined || oldStep === undefined) return;

  const currentStep = Math.max(newStep, oldStep ? oldStep : 0);
  const row = Math.floor((currentStep > 0 ? currentStep - 1 : 0) / size.value);
  const col = (currentStep - 1 > 0 ? currentStep - 1 : 0) % size.value;
  const value = currentStep === newStep ? props.answerGraph.Matrix[row][col] : -1;

  emit('demonstrationCellRevealed', row, col, value);
}, { immediate: true });


const getInputValue = (row: number, col: number): string => {
  const key = `${row}-${col}`;
  if (localInputValues.value[key] !== undefined) {
    return localInputValues.value[key];
  }
  return getCellValue(row, col);
};


const getCellValue = (row: number, col: number): string => {
  const value = props.graph.Matrix[row][col];
  return value === -1 ? '' : String(value);
};


const getDisplayValue = (row: number, col: number): string => {
  if (isDemonstrationMode.value && props.answerGraph) {
    const currentStep = props.demonstrationStep || 0;

    const cellIndex = row * size.value + col;
    const shouldShow = cellIndex < currentStep;

    if (!shouldShow) {
      return getCellValue(row, col);
    }

    const answerValue = props.answerGraph.Matrix[row][col];
    return answerValue === -1 ? '' : String(answerValue);
  }
  return getCellValue(row, col);
};


const getCellClass = (row: number, col: number): string => {
  const classes = [];
  if (props.mode === 'training' && props.answerGraph) {
    const isCorrect = props.graph.Matrix[row][col] === props.answerGraph.Matrix[row][col];
    classes.push(isCorrect ? 'cell-correct' : 'cell-incorrect');
  }
  if (isDemonstrationMode.value && props.answerGraph) {
    const cellIndex = row * size.value + col;
    const currentStep = props.demonstrationStep || 0;

    const shouldShow = cellIndex < currentStep;
    const justRevealed = cellIndex === currentStep - 1;

    if (justRevealed && currentStep > 0) {
      classes.push('cell-revealed');
    } else if (shouldShow) {
      classes.push('cell-visible');
    } else {
      classes.push('cell-hidden');
    }
  }
  return classes.join(' ');
};


const getRowHeaderClass = (row: number): string => {
  return activeRow.value === row ? 'row-header-highlighted' : '';
};


const getColumnHeaderClass = (col: number): string => {
  return activeCol.value === col ? 'column-header-highlighted' : '';
};


const setInputRef = (el: any, row: number, col: number) => {
  if (el) {
    inputRefs.value[`${row}-${col}`] = el;
  }
};


const onCellHover = (row: number, col: number) => {
  activeRow.value = row;
  activeCol.value = col;
  props.onCellHover(row, col);
};


const onCellLeave = (row: number, col: number) => {
  activeRow.value = null;
  activeCol.value = null;
  props.onCellLeave(row, col);
};


const onInputChange = (event: Event, row: number, col: number) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/[^\d]/g, '');
  const key = `${row}-${col}`;
  localInputValues.value[key] = value;
  target.value = value;
};


const onInputBlur = (event: Event, row: number, col: number) => {
  const target = event.target as HTMLInputElement;
  commitValue(target.value, row, col);
};


const onInputEnter = (event: Event, row: number, col: number) => {
  const target = event.target as HTMLInputElement;
  commitValue(target.value, row, col);
  target.blur();
};


const commitValue = (value: string, row: number, col: number) => {
  const key = `${row}-${col}`;
  delete localInputValues.value[key];
  const numericValue = value === '' ? -1 : parseInt(value, 10);
  props.onCellChange(row, col, isNaN(numericValue) ? -1 : numericValue);
};

defineExpose({
  lockInputs: () => {
    Object.values(inputRefs.value).forEach(input => {
      input.readOnly = true;
      input.classList.add('locked');
    });
  },
});
</script>

<style scoped>
.matrix-container {
  overflow: auto;
}

.graph-matrix {
  border-collapse: collapse;
  width: 100%;
}

.graph-matrix th,
.graph-matrix td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  min-width: 40px;
  transition: all 0.3s ease;
}

.graph-matrix th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.row-header-highlighted {
  background-color: #d4ebff !important;
}

.column-header-highlighted {
  background-color: #d4ebff !important;
}

.cell-correct {
  background-color: #d8f8f4;
}

.cell-incorrect {
  background-color: #ecbbbb;
}

.cell-revealed {
  background-color: #b3e0ff;
  animation: reveal 0.5s ease-in-out;
}

@keyframes reveal {
  0% {
    background-color: #ffffff;
    transform: scale(0.95);
  }
  50% {
    background-color: #d4ebff;
    transform: scale(1.02);
  }
  100% {
    background-color: #e8f4ff;
    transform: scale(1);
  }
}

input {
  width: 100%;
  border: none;
  text-align: center;
  background: transparent;
}

input:focus {
  outline: 0;
}

input.locked {
  cursor: not-allowed;
}
</style>
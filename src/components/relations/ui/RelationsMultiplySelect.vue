<template>
  <div class="multiply-selects">
    <div class="select-group">
      <label for="graph-type">Тип умножения:</label>
      <select
          v-model="multiplyType"
          class="select-item"
      >
        <option value="CLASSIC">Классическое</option>
        <option value="LOGICAL">Логическое</option>
        <option value="TROPICAL">Тропическое</option>
      </select>
    </div>

    <div class="select-group">
      <label for="graph-type">Степень:</label>
      <select
          v-model="multiplyPower"
          class="select-item"
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSelectMultiplyStore } from '@/store/relations'
import {computed, ref, watch} from "vue";
import { MultiplyType} from "@/components/relations/types/RelationsGraph";


const multiplyStore = useSelectMultiplyStore()
const multiplyType = ref<MultiplyType>(multiplyStore.selectedMultiplyType)
const multiplyPower = ref<number>(multiplyStore.selectedMultiplyPower)


const getMultiplyType = (): MultiplyType => {
  multiplyStore.updateType(multiplyType.value);
  return multiplyType.value;
};


const getMultiplyPower = (): number => {
  multiplyStore.updatePower(multiplyPower.value);
  return multiplyPower.value;
};


defineExpose({
  getMultiplyType,
  getMultiplyPower
});
</script>

<style scoped>
.multiply-selects {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-group label {
  font-weight: 600;
  font-size: 1.1rem;
}

.select-item {
  padding: 0.5rem;
  border: 3px solid #d0dcf2;
  border-radius: 15px;
  background-color: white;
}

</style>
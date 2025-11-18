<template>
  <div class="multiply-selects">
    <div class="select-group">
      <select
          v-model="multiplyPower"
          class="form-select"
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div class="select-group">
      <select
          v-model="multiplyType"
          class="form-select"
      >
        <option value="CLASSIC">Классическое</option>
        <option value="LOGICAL">Логическое</option>
        <option value="TROPICAL">Тропическое</option>
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
  font-weight: 500;
}

.form-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.form-select:disabled {
  background-color: #f5f5f5;
  color: #999;
}
</style>
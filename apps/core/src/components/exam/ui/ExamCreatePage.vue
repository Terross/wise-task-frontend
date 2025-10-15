<script setup lang="ts">
import AddTasksTable from "@/components/exam/ui/AddTasksTable.vue";
import ExamCreateForm from "@/components/exam/ui/ExamCreateForm.vue";
</script>

<template>
  <div class="layout">
    <div class="column">
      <exam-create-form />
    </div>
    <div class="column">
      <add-tasks-table />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  width: 100%;
}

.column {
  width: 50%;
  box-sizing: border-box;
}

@media (max-width: 1000px) {

  .layout {
    flex-direction: column;
  }

  .column {
    width: 100%
  }
}
</style>
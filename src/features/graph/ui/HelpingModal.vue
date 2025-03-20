<script setup lang="ts">
const props = defineProps<{
  isHelpModalOpen: boolean;
  closeHelpModal: () => void;
}>();
</script>

<template>
  <v-dialog v-model="props.isHelpModalOpen" max-width="600">
    <v-card>
      <v-card-title class="headline">Как работать с графом?</v-card-title>
      <v-card-text>
        <p>
          1. Чтобы добавить вершину, нажмите кнопку "Добавить вершину" или
          щелкните правой кнопкой мыши на панели.
        </p>
        <p>
          2. Чтобы соединить вершины, перетащите курсор от одной вершины к
          другой.
        </p>
        <p>3. Вы можете перемещать вершины, перетаскивая их.</p>
        <p>
          4. Используйте кнопку "Сменить направленность", чтобы изменить тип
          графа на направленный или ненаправленный.
        </p>
        <p>
          5. Вы можете сохранить текущее состояние графа в JSON файл, нажав
          "Скачать JSON".
        </p>
        <p>
          6. Для загрузки ранее сохраненного графа используйте кнопку "Загрузить
          JSON".
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="props.closeHelpModal"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>

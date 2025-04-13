<script setup lang="ts">
const props = defineProps<{
  isHelpModalOpen: boolean;
  closeHelpModal: () => void;
}>();
</script>

<template>
  <v-dialog
    :model-value="props.isHelpModalOpen"
    @update:modelValue="
      (val) => {
        if (!val) props.closeHelpModal();
      }
    "
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline"
        >Руководство по работе с графом</v-card-title
      >
      <v-card-text>
        <h3 class="subtitle-1 font-weight-bold">Создание вершин:</h3>
        <ul>
          <li>
            <strong>Через контекстное меню:</strong> Нажмите правой кнопкой мыши
            на область графа и выберите "Создать вершину здесь" в появившемся
            меню.
          </li>
          <li>
            <strong>Через кнопку "Добавить вершину":</strong> Нажмите на
            соответствующую кнопку, и вершина появится в центре экрана.
          </li>
        </ul>

        <h3 class="subtitle-1 font-weight-bold">Удаление вершин:</h3>
        <ul>
          <li>
            <strong>Способ 1:</strong> Выберите вершину, кликнув по ней левой
            кнопкой мыши. Над вершиной появится меню. Для удаления нажмите на
            значок крестика (×).
          </li>
          <li>
            <strong>Способ 2:</strong> Выделите одну или несколько вершин
            (удерживая Ctrl или Shift) и нажмите клавишу Backspace.
          </li>
          <li>
            <strong>Перемещение нескольких вершин:</strong> Выделите несколько
            вершин и перетащите любую из них — все выделенные будут двигаться
            вместе.
          </li>
        </ul>

        <h3 class="subtitle-1 font-weight-bold">Соединение вершин:</h3>
        <ul>
          <li>Нажмите на одну из точек соединения на стороне вершины.</li>
          <li>Перетащите линию до точки соединения на другой вершине.</li>
          <li>
            <strong>Для создания петли:</strong> проведите линию от точки
            соединения на вершине до противоположной точки на той же вершине.
          </li>
        </ul>

        <h3 class="subtitle-1 font-weight-bold">Удаление соединений:</h3>
        <ul>
          <li>
            <strong>Для соединений между вершинами:</strong> Нажмите на линию
            соединения. В появившемся меню выберите красный крестик для
            удаления.
          </li>
          <li>
            <strong>Для петель:</strong> Нажмите на петлю левой кнопкой мыши,
            чтобы удалить её.
          </li>
        </ul>

        <h3 class="subtitle-1 font-weight-bold">Дополнительные функции:</h3>
        <ul>
          <li>
            <strong>Изменение свойств вершин и соединений:</strong> Выберите
            вершину или линию соединения левой кнопкой мыши. В меню выберите
            опции для изменения цвета, веса, названия или размера (для вершин).
          </li>
          <li>
            <strong>Изменение названия вершины:</strong> Нажмите на иконку
            карандаша и введите новое название.
          </li>
        </ul>

        <h3 class="subtitle-1 font-weight-bold">Функционал графа:</h3>
        <ul>
          <li>
            <strong>Отмена действий:</strong> Нажмите кнопку "Undo", чтобы
            отменить последние действия.
          </li>
          <li>
            <strong>Сохранение и загрузка графа:</strong> Нажмите "Скачать
            JSON", чтобы сохранить текущий граф в файл. Нажмите "Загрузить
            JSON", чтобы загрузить ранее сохранённый граф из файла.
          </li>
          <li>
            <strong>Изменение направленности графа:</strong> Нажмите "Сменить
            направленность", чтобы переключить граф между направленным и
            ненаправленным режимами.
          </li>
          <li>
            <strong>Нормализация графа:</strong> Нажмите "Нормализовать" для
            автоматического упорядочивания компонент графа. Поддерживаются типы:
            Дерево, Двудольный граф, Цепь, Цикл. Каждая компонента связности
            нормализуется отдельно.
          </li>
        </ul>
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

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.subtitle-1 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 8px;
}

ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

li {
  margin-bottom: 8px;
}
</style>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1>Vue Host с JS Remote</h1>
          <v-card>
            <v-card-title>JS Application</v-card-title>
            <v-card-text>
              <div ref="remoteAppContainer"></div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HostApp',
  data() {
    return {
      remoteAppContainer: null,
    };
  },
  async mounted() {
    try {
      const module = await import('remote-js/renderApp');
      console.log('Импортированный модуль:', module);
      const { renderApp } = module.default;
      if (this.$refs.remoteAppContainer) {
        renderApp(this.$refs.remoteAppContainer);
      }
    } catch (error) {
      console.error('Ошибка загрузки ремоута:', error);
    }
  },
};
</script>

<style>
button {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
</style>
<template>
    <v-card>
      <v-card-title>Фильтр профилей</v-card-title>
      <v-card-text>
        <v-form validate-on="submit lazy" @submit.prevent="search">
          <v-text-field
            density="compact"
            variant="outlined"
            label="Имя"
            color="primary"
            v-model="firstName"
          >
          </v-text-field>
          <v-text-field
            label="Фамилия"
            color="primary"
            v-model="lastName"
            density="compact"
            variant="outlined"
          >
          </v-text-field>
          <v-text-field
            label="Email"
            color="primary"
            v-model="email"
            density="compact"
            variant="outlined"
          >
          </v-text-field>
          <v-select
            label="Роль"
            :items="['Студент', 'Преподаватель']"
            v-model="role"
            variant="solo-filled"
          ></v-select>
          <v-text-field v-if="role=='Студент'"
            label="Группа"
            color="primary"
            v-model="group"
            density="compact"
            variant="outlined"
          >
          </v-text-field>
          <v-row>
            <v-col>
              <v-btn
                :loading="loading"
                type="submit"
                block
                @click="search"
                color="primary"
                text="Найти"
                variant="outlined"
              ></v-btn>
            </v-col>
          </v-row>
        </v-form>		
      </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useProfileStore } from '@/store/profile'

export default defineComponent({
  data () {
    return {
      loading: false,
      email:'',
      firstName: '',
      lastName: '',
      role: 'Студент',
      group: '',
      profileStore: useProfileStore(),
    }
  },
  methods: {
    search() {
      const filterState = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: null, //TODO: fix role filter
        group: this.group,
      }
      this.profileStore.filterState = filterState
    }
  }
})
</script>

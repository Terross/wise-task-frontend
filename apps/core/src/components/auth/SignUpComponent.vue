<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto pa-4 pb-4 justify-center" max-width="548" rounded="lg">
          <v-card-title>Регистрация</v-card-title>
          <v-card-text>
            <v-form validate-on="submit lazy" @submit.prevent="signUp">
              <v-text-field
                label="Имя"
                color="primary"
                v-model="firstName"
                variant="solo-filled"
                :rules="firstNameRules"
              >
              </v-text-field>
              <v-text-field
                label="Фамилия"
                color="primary"
                v-model="lastName"
                variant="solo-filled"
              >
              </v-text-field>
              <v-text-field
                label="Email"
                color="primary"
                v-model="email"
                variant="solo-filled"
              >
              </v-text-field>
              <v-text-field
                label="Пароль"
                color="primary"
                v-model="password"
                variant="solo-filled"
              >
              </v-text-field>
              <v-text-field
                label="Повторите пароль"
                color="primary"
                v-model="repeatedPassword"
                variant="solo-filled"
              >
              </v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-btn
                    :loading="loading"
                    type="submit"
                    block
                    @click="signUp"
                    color="primary"
                    text="Зарегистрироваться"
                    variant="outlined"
                  ></v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    :loading="loading"
                    type="submit"
                    @click="signIn"
                    block
                    color="primary"
                    text="Аккаунт уже есть. Войти"
                    variant="outlined"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-form>		
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      loading: false,
      email :'',
      firstName: '',
      lastName: '',
      password: '',
      repeatedPassword: '',
      firstNameRules: [
      (value: string) => {
          if (value?.length > 3) return true

          return 'Имя должно состоять хотя бы из 3 символов'
        },
      ],
    }
  },
  methods: {
    signUp() {
      console.log(123)
    },
    signIn() {
      this.$router.push('/auth/signin')
    }
  }
})
</script>

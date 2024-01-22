<template>
	<v-container class="fill-height" fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto pa-4 pb-4 justify-center" max-width="548" rounded="lg">
          <v-card-title>Вход</v-card-title>
          <v-card-text>
            <v-form validate-on="submit lazy" @submit.prevent="signIn">
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
              <v-row>
                <v-col cols="6">
                  <v-btn
                    :loading="loading"
                    type="submit"
                    block
                    color="primary"
                    text="Вход"
                    variant="outlined"
                  ></v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    :loading="loading"
                    type="submit"
                    @click="signUp"
                    block
                    color="primary"
                    text="Регистрация"
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
import { useProfileStore } from '@/store/profile'
import { SIGN_IN } from '@/api/Mutations'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
			return {
					loading: false,
					email: '',
					password: '',
          profileStore: useProfileStore()
			}
    },
    methods: {
			signIn(event: any) {
                this.loading = true
				const { mutate: signIn, onDone, onError } = useMutation(SIGN_IN)
				
				const request = {
					signInRequest: {
							email: this.email,
							password: this.password
						}
				}

				signIn(request)

				onDone(response => {
                    this.loading = false
                    const token = response.data.signIn.token
                    const jwtData = token.split('.')[1]
                    const decodedJwtJsonData = window.atob(jwtData)
                    const decodedJwtData = JSON.parse(decodedJwtJsonData)
                    const user = {
                        role: decodedJwtData.role,
                        id: decodedJwtData.id,
                        email: decodedJwtData.email
                    }
          this.profileStore.activeUser = user
				})

				onError(({networkError, graphQLErrors}) => {
          this.loading = false
          if (graphQLErrors) {
            graphQLErrors.map(({message}) => {
              if (message === 'NOT_FOUND') {
                console.log("profile not found")
              }
            })
          }
            
				})
			},
      signUp() {
        this.$router.push('/auth/signup')
      }
   }

})
</script>

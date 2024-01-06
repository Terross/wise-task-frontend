<template>
	<v-container>
		<v-form validate-on="submit lazy" @submit.prevent="login">
			<v-text-field
				label="Email"
				color="primary"
				v-model="email"
			>
			</v-text-field>
			<v-text-field
					label="Пароль"
					color="primary"
					v-model="password"
			>
			</v-text-field>
			<v-btn
        :loading="loading"
        type="submit"
        block
				color="primary"
        class="mt-2"
        text="Submit"
      ></v-btn>
    </v-form>
	</v-container>
    
</template>

<script lang="ts">
import { useProfileStore } from '@/store/profile'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { defineComponent } from 'vue'
import { SIGN_IN } from '../../api/Mutations'

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
			login(event: any) {
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
			}
   }

})
</script>

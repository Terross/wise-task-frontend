<template>
	<v-row justify="center">
		<v-dialog
			v-model="dialog"
			max-width="564">
				<v-card>
					<v-card-title>Профиль пользователя</v-card-title>
					<v-container>
						<v-row>
							<v-col>
								<v-text-field
									label="Имя"
									v-model="profile.firstName"></v-text-field>
                <v-text-field
									label="Фамилия"
									v-model="profile.lastName"></v-text-field>
                <v-text-field
									label="Отчество"
									v-model="profile.patronymic"></v-text-field>
                <v-text-field
									label="Роль"
									v-model="profile.profileRole"></v-text-field>
                <v-text-field
									label="Группа"
									v-model="profile.studentGroup"></v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<v-card-actions>
						<v-btn
							color="primary"
							@click="updateProfile"
							variant="outlined">Принять</v-btn>
						<v-btn
							color="primary"
							@click="hideDialog"
							variant="outlined">Закрыть</v-btn>
					</v-card-actions>
				</v-card>
		</v-dialog>
	</v-row>
</template>

<script lang="ts">
import { UPDATE_PROFILE } from '@/api/Mutations'
import { defineComponent, toRefs, defineEmits } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/store/profile'

export default defineComponent({
	props: {
		dialog: Boolean,
		profile: Object
	},
	setup(props: any) {
		const { dialog, profile } = toRefs(props)
    const { currentUser, userList } = storeToRefs(useProfileStore())
		return { 
      dialog,
      profile,
      currentUser,
      userList
     }
	},
	methods: {
		updateProfile() {
      const { mutate, onDone, onError } = useMutation(UPDATE_PROFILE)
      const request = {
        profile: this.profile
      }
      mutate(request)

      onDone(response => {
        const profile = response.data.updateProfile
        this.$emit("hideDialogWithUpdating", false, profile)
        this.currentUser = profile
        const index = this.userList.findIndex(x => x.id == profile.id);
        this.userList[index] = profile
      })

      onError(({graphQLErrors}) => {
        this.$emit("hideDialog", false)
        if (graphQLErrors) {
          graphQLErrors.map(({message}) => {
            console.error(message)
          })
        } 
      })

		},
		hideDialog() {
			this.$emit("hideDialog", false)
		}
	}
})
</script>

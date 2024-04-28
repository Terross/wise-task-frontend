<template>
	<v-skeleton-loader
    v-if="loading"
    class="mx-auto border"
    type="table"
  ></v-skeleton-loader>
	<v-card v-if="!loading">
    <v-card-title>Решения</v-card-title>
    <v-data-table
      :headers="headers"
      :items="activeUserSolutions"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="showSolution(item)"
        >
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>
	</v-card>
</template>

<script lang="ts">
import { Solution } from '@/__generated__/graphql'
import { GET_USER_SOLUTION_STATISTIC } from '@/api/Queries'
import { useSolutionStore } from '@/store/solution'
import { useQuery } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	props: {
    profile: Object,
    loading: Boolean
  },
	setup(props) {
    const profile = computed(() => props.profile)
    const { onResult, loading, error } = useQuery(GET_USER_SOLUTION_STATISTIC, { userId: "00000000-0000-0000-0000-000000000000" })
    const { activeUserSolutions } = storeToRefs(useSolutionStore())
    const headers = [
      { key: 'id', title: 'Идентификатор задачи' },
      { key: 'isCorrect', title: 'Результат решения' },
      { key: 'actions', title: 'Действия', sortable: false}
    ]

    onResult(response => {
      if (response.data) {
        activeUserSolutions.value = response.data.getUserSolutionStatistic
      }
    })

    return { 
      profile,
      headers,
      activeUserSolutions
    }
	},

  methods: {
    showSolution(solution: Solution) {
			switch (solution.__typename) {
				case 'SolutionGraph': 
					this.$router.push('/tasks/graph/' + solution.taskId + '/solution/' + solution.id)
					break
				case 'SolutionImplementation': 
					this.$router.push('/solution/implementation/' + solution.id)
					break
			}
    }
  }
})
</script>

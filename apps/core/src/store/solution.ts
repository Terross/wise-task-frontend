import { Solution, SolutionGraph, SolutionImplementation } from "@/__generated__/graphql";
import { defineStore } from "pinia";

export const useSolutionStore = defineStore('solution', {
    state: () => {
        return {
            activeUserSolutions: [] as Solution[],
            activeSolution: {} as Solution | SolutionGraph | SolutionImplementation,
            graph: {},
            description: ""
        }
    }
})
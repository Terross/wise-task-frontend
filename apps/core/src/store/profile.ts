import { defineStore } from "pinia";
import { useQuery } from '@vue/apollo-composable'
import gql from "graphql-tag";
import { Profile } from "@/__generated__/graphql";

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            userList: [] as Profile[],
            activeUser: null as Profile | null,
            currentUser: null as Profile | null
        }
    }
})

interface UserInfo {
    firstName: string
    lastName: string
}
import { defineStore } from "pinia";
import { useQuery } from '@vue/apollo-composable'
import gql from "graphql-tag";
import { Profile } from "@/__generated__/graphql";

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            userList: [] as Profile[],
            activeUser: null as ActiveUserInfo | null,
            currentUser: null as Profile | null
        }
    },
    persist: true
})

interface UserInfo {
    firstName: string
    lastName: string
}

interface ActiveUserInfo {
    role: string
    id: string
    email: string
}
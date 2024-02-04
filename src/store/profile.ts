import { defineStore } from "pinia";
import { Profile } from "@/__generated__/graphql";
import { Role } from "@/common/Role";

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            userList: [] as Profile[],
            activeUser: null as ActiveUserInfo | null,
            currentUser: null as any | null,
            filterState: {
                email: '',
                firstName: '',
                lastName: '',
                role: null,
                group: ''
            } as FilterState
        }
    },
    getters: {
        getFilteredProfiles(state) {
            const { email, firstName, lastName, group, role }: FilterState = state.filterState
            return state.userList.filter((user) => {
                return (email === '' || user.email === email) &&
                (firstName === '' || user.firstName === firstName) &&
                (lastName === '' || user.lastName === lastName) &&
                (group === '' || user.studentGroup === group)
            })
        }
    }
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

interface FilterState {
    email: string,
    firstName: string,
    lastName: string,
    role: Role | null,
    group: string,
}
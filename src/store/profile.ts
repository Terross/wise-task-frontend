import { defineStore } from "pinia";
import { Profile } from "@/__generated__/graphql";
import { Role } from "@/common/Role";

interface UserInfo {
  firstName: string;
  lastName: string;
}

export interface ActiveUserInfo {
  role: string;
  id: string;
  email: string;
}

interface FilterState {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export const useProfileStore = defineStore("profile", {
  state: () => {
    return {
      userList: [] as Profile[],
      activeUser: null as ActiveUserInfo | null,
      currentUser: null as Profile | null,
      filterState: {
        email: "",
        firstName: "",
        lastName: "",
        role: Role.USER,
      } as FilterState,
    };
  },
  getters: {
    getFilteredProfiles(state): Profile[] {
      const { email, firstName, lastName, role }: FilterState = state.filterState;

      return state.userList.filter((user: Profile): boolean => {
        return (
            (email === "" || user.email === email) &&
            (firstName === "" || user.firstName === firstName) &&
            (lastName === "" || user.lastName === lastName) &&
            (role === null || user.profileRole === role.toString())
        );
      });
    },
  },
});
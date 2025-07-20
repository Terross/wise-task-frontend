import { UserStorageKeys } from "@/entities/user/storage/config";
import { useProfileStore } from "@/store/profile";
import { getUserFromToken } from "@/entities/user/lib/getUserFromToken";

export namespace UserStorageSetters {
  export const setToken = async (token: string) => {
    const profileStore = useProfileStore();
    if (!token) {
      return;
    }
    profileStore.activeUser = getUserFromToken(token);
  };

  export const removeToken = () => {
    localStorage.removeItem(UserStorageKeys.Token);
  };
}

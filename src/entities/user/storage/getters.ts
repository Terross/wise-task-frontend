import { UserStorageKeys } from "@/entities/user/storage/config";

export namespace UserStorageGetters {
  export const getToken = async (): Promise<string | null> => {
    return localStorage.getItem(UserStorageKeys.Token);
  };
  export const removeToken = (): void => {
    localStorage.removeItem(UserStorageKeys.Token);
  };
}

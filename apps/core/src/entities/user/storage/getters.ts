import { UserStorageKeys } from "@/entities/user/storage/config";

export namespace UserStorageGetters {
  export const getToken = async (): Promise<string | null> => {
    return await localStorage.getItem(UserStorageKeys.Token);
  };
}

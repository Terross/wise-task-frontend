import { UserStorageKeys } from "@/entities/user/storage/config";
import { ActiveUserInfo } from "@/store/profile";

export const getUserFromToken = async (
  token: string,
): Promise<ActiveUserInfo> => {
  const jwtData = token.split(".")[1];
  const decodedJwtJsonData = window.atob(jwtData);
  const decodedJwtData = JSON.parse(decodedJwtJsonData);
  await localStorage.setItem(UserStorageKeys.Token, token);
  return {
    role: decodedJwtData.role,
    id: decodedJwtData.id,
    email: decodedJwtData.email,
  };
};

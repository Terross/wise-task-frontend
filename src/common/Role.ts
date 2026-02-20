export enum Role {
    Пользователь = <any>"USER",
    Автор = <any>"AUTHOR",
    Админ = <any>"ADMIN"
}

export function getKeyByValue(value: string) {
    const indexOfS = Object.values(Role).indexOf(value as unknown as Role);
  
    const key = Object.keys(Role)[indexOfS];
  
    return key;
}
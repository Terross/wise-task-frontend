export enum Role {
    USER = <any>"USER",
    AUTHOR = <any>"AUTHOR",
    ADMIN = <any>"ADMIN"
}

export function getKeyByValue(value: string) {
    const indexOfS = Object.values(Role).indexOf(value as unknown as Role);
  return Object.keys(Role)[indexOfS];
}
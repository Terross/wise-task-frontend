export enum Role {
    Студент = <any>"STUDENT",
    Преподаватель = <any>"TEACHER",
    Админ = <any>"ADMIN"
}

export function getKeyByValue(value: string) {
    const indexOfS = Object.values(Role).indexOf(value as unknown as Role);
  
    const key = Object.keys(Role)[indexOfS];
  
    return key;
}
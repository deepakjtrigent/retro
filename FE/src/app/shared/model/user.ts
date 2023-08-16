export interface User{
    userId : string,
    displayName: string
}

export const defaultsUser: Pick<User, 'userId' | 'displayName'> = {
    userId: '',
    displayName: '',
  };
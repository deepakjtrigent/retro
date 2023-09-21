

export interface User{
  userId: string;
  displayName:string;
}

export const defaultUser:Pick<
User,
'userId' | 'displayName' >={
userId:"",
displayName :"",
}


export interface JoinUser {
  displayName: string;
  userId: string;
  noteId?:string;
  note?:string
  actionType?:string
}

export const defaultsJoinUser: Pick<JoinUser, 'userId' | 'displayName'> = {
  userId: '',
  displayName: '',
};

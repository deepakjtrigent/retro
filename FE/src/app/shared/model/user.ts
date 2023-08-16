export interface User {
    userId: string;
    projectName: string;
    sprintNumber:number|string;
  }
  
  export const defaultsUser: Pick<User, 'userId' | 'projectName'|'sprintNumber'> = {
    userId: '',
    projectName: '',
    sprintNumber:''
  };
  
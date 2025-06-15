export interface User {
  id_user: number;
  lastname: string;
  firstname: string;
  email: string;
  isAdmin: boolean;
}

export interface UserForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface EditUserForm {
    firstname: string;
    lastname: string;
    email: string;
    isAdmin: boolean;
  }
  

export interface DecodedToken {
  sub: string;
  fresh: boolean;
  iat: number;
  jti: string;
  type: string;
  nbf: number;
  exp: number;
  csrf: string;
} 
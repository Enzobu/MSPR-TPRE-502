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

export interface Prediction {
  id_prediction: number;
  id_country: number;
  id_disease: number;
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
  trend: number;
  trend_lower: number;
  trend_upper: number;
  deaths: number;
  deaths_lower: number;
  deaths_upper: number;
  pib: number;
  pib_lower: number;
  pib_upper: number;
  population: number;
  population_lower: number;
  population_upper: number;
}

export interface Country {
  id_country: number;
  name: string;
  iso_code: string;
  population: string;
  pib: string;
  latitude: string;
  longitude: string;
  id_continent: number;
  id_region: number;
} 
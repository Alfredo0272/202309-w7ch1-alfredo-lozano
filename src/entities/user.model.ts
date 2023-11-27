import { Pubs } from './pubs.model';
import { Beer } from './beer.model';

export type UserLogin = {
  password: string;
  email: string;
};

export type User = UserLogin & {
  id: string;
  name: string;
  surname: string;
  age: number;
  userName: string;
  visitado: Pubs[];
  probada: Beer[];
};

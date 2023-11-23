import { Pubs } from './pubs.model';
import { Beer } from './beer.model';

export type LoginUser = {
  password: string;
  email: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  userNane: string;
  visitado: Pubs[];
  probada: Beer[];
};

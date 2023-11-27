import { Pubs } from './pubs.model';
import { Beer } from './beer.model';
import { ImgData } from '../types/imgFiles';

export type UserLogin = {
  password: string;
  email: string;
};

export type User = UserLogin & {
  id: string;
  name: string;
  surname: string;
  age: number;
  avatar: ImgData;
  userName: string;
  visitado: Pubs[];
  probada: Beer[];
};

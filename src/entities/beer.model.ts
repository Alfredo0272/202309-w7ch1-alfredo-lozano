import { User } from './user.model';

export type Beer = {
  id: string;
  name: string;
  brewer: string;
  style: string;
  alcohol: string;
  probada: boolean;
  autor: User;
};

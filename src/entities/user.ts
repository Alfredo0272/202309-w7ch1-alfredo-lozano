export type LoginUser = {
  id: string;
  userNane: string;
  password: string;
};

export type User = LoginUser & {
  name: string;
  surname: string;
  age: number;
  email: string;
};

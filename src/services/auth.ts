import { hash, compare } from 'bcrypt';

export abstract class Auth {
  static hash(value: string): Promise<string> {
    const slatRound = 10;
    return hash(value, slatRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}

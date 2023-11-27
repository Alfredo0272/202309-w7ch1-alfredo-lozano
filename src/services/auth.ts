import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../entities/user.model.js';
import { HttpError } from '../types/http.error.js';

export type TokenPayload = {
  id: User['id'];
  email: string;
} & jwt.JwtPayload;
export abstract class Auth {
  static secret = process.env.JWT_SECRET;
  static hash(value: string): Promise<string> {
    const slatRound = 10;
    return hash(value, slatRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }

  static signJWT(payload: TokenPayload) {
    return jwt.sign(payload, Auth.secret!);
  }

  static verifyAndGetPayload(token: string) {
    try {
      const result = jwt.verify(token, Auth.secret!);
      if (typeof result === 'string') throw new HttpError(498, 'invalid token');
      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(
        498,
        'invalid token',
        (error as unknown as Error).message
      );
    }
  }
}

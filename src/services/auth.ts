import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../entities/user.model.js';
import { HttpError } from '../types/http.error.js';

export type TokenPayload = {
  id: User['id'];
  email: string;
  role: User['role'];
} & jwt.JwtPayload;
export abstract class Auth {
  static secret = process.env.TOKENSECRET;
  static hash(value: string): Promise<string> {
    const saltRound = 10;
    return hash(value, saltRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }

  static signJWT(payload: TokenPayload) {
    return jwt.sign(payload, Auth.secret!);
    // Temp return jwt.sign(payload, Auth.secret!, { expiresIn: '1h' })
  }

  static verifyAndGetPayload(token: string) {
    try {
      const result = jwt.verify(token, Auth.secret!);
      if (typeof result === 'string')
        throw new HttpError(498, 'Invalid token', result);
      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message);
    }
  }
}

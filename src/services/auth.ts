import { hash, compare } from 'bcrypt';
import Jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../entities/user.model.js';

type TokenPayload = {
  id: User['id'];
  email: string;
} & Jwt.JwtPayload;
export abstract class Auth {
  static secret = process.env.TOKENSECRET;
  static hash(value: string): Promise<string> {
    const slatRound = 10;
    return hash(value, slatRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }

  static signJWT(payload: TokenPayload) {
    return Jwt.sign(payload, Auth.secret!);
  }
}

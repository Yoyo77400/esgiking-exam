import { createHash } from 'crypto';

export class SecurityUtils {
  static sha256(str: string): string {
    return createHash('sha256').update(`${str}${process.env.SHA256_SALT}`).digest('hex');
  }
}

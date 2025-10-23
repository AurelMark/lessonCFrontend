import { logOutFromSystem } from './../api/auth';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import crypto from 'crypto';
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXT_HASH_SECRET || 'default_secret_key';
const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(SECRET).digest();
const iv = Buffer.alloc(16, 0);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const encodeId = (id: string): string => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(id, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const joinUrl = (base: string, path: string) => {
  if (base.endsWith("/") && path.startsWith("/")) {
    return base + path.slice(1);
  }
  if (!base.endsWith("/") && !path.startsWith("/")) {
    return base + "/" + path;
  }
  return base + path;
}

export const logOutSystem = async () => {
  await logOutFromSystem();
  Cookies.remove('user');
}

export function verifyToken(token: string, secret: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (err) {
    console.error('❌ Invalid token:', err);
    return null;
  }
}

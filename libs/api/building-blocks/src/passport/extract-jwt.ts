import { Request } from "express";

export function extractJWT(req: Request): string | null {
  if (
    req.cookies &&
    'access_token' in req.cookies &&
    req.cookies.access_token.length > 0
  ) {
    return req.cookies.access_token;
  }
  return null;
}
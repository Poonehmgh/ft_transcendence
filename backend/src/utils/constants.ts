import * as process from "process";

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpire = process.env.JWT_EXPIRE;
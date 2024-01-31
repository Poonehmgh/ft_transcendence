export interface reqUser {
    id: number;
    name: string;
    iat: number;
    exp: number;
}

export interface AuthenticatedRequest extends Request {
    user: reqUser;
}
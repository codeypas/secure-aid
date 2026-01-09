type tokenPayload = {
    fresh: boolean;
    iat: number;
    jti: string;
    type: string;
    sub: {
        id: number;
        role: "admin" | "user";
        email: string;
    };
    nbf: number;
    csrf: string;
    exp: number;
}
type User = {
    email: string;
    id: number;
    lat: string;
    lon: string;
    name: string;
}
export type { tokenPayload, User };
declare module "express-session" {
    interface SessionData {
        email?: string;
        user_id?: string;
        code?: integer;
        loggedIn?: boolean;
    }
}

export {};

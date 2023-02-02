export type Error = {
    code: string;
    clientVersion: string;
    meta: {
        target: string[];
    };
};
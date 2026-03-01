import { sendRequest, GET } from "./helper";

export interface checkUserResponse {
    success: boolean;
    isadmin: boolean;
    issuperadmin: boolean;
    expiresat: string;
    fullname: string;
}

export const setCookie = async () => {
    return sendRequest<void, void>("/auth/setuser", GET, undefined);
};

export const checkCookie = async () => {
    return sendRequest<void, checkUserResponse>("/auth/getuser", GET);
};

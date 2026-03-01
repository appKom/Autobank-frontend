import { sendRequest, GET } from "./helper";

export interface Committee {
  id: string;
  name: string;
}

export interface UserCommittees {
  email: string;
  name: string;
  committees: string[];
}

export const fetchCommittees = async () => {
  return sendRequest<undefined, Committee[]>("/committee/all", GET);
};

export const fetchUserComittees = async () => {
  return sendRequest<undefined, UserCommittees>("/committee/user", GET);
};

import axios from "axios";

export const POST = 'POST';
export const GET = 'GET';

export const sendRequest = async <BODY, RESULT>(url: string, method: string, body?: BODY): Promise<RESULT> => {
    try {
      const res = await axios({
        method: method,
        url: `${import.meta.env.VITE_BACKEND_URI}/api${url}`,
        data: body,
      });
      return res.data;
    } catch (e) {
      throw e;
    }
}
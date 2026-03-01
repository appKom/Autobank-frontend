import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkUserResponse } from "../pages/Authcallback";



export interface AutobankStore {
    userInfo: checkUserResponse | null;
    setUserInfo: (user: checkUserResponse | null) => void;
};

const useAutobankStore = create<AutobankStore>()(
    persist(
        (set) => ({
            userInfo: null,
            setUserInfo: (user: checkUserResponse | null) =>
                set((state) => ({
                    userInfo: user,
                }))
        }),
        {
            name: "autobank-store",
        }
    )
);

export default useAutobankStore;

import { UserRes } from "@/types/user/res/UserRes";
import { create } from "zustand";

interface UserStates {
  user: UserRes | null;
}

interface UserActions {
  setUser: (user: UserRes) => void;
}

/**
 * Userの状態管理
 */
export const useUserStates = create<UserStates & UserActions>()((set) => ({
  user: null,
  setUser: (user: UserRes) => set({ user }),
}));

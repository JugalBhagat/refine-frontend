import { create } from 'zustand'

const useProfileStore = create((set) => ({
  profile: {
    user_id:'',
    username: '',
    email: '',
    dp: '',
    role: '',
    cid: null,
  },
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({
    profile: {
      user_id:'',
      username: '',
      email: '',
      dp: '',
      role: '',
      cid: null,
    },
  }), 
  getProfile: () => {
    return set((state) => state.profile);
  },
}));

export default useProfileStore;

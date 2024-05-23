// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        memberId: null,
        profileImageUrl: '',
        nickName: '',
        role: ''
    }),
    actions: {
        setUser(memberId, profileImageUrl, nickName, role) {
            this.memberId = memberId;
            this.profileImageUrl = profileImageUrl;
            this.nickName = nickName;
            this.role = role;
        },
        clearUser() {
            this.memberId = null;
            this.profileImageUrl = '';
            this.nickName = '';
            this.role = '';
        }
    }
})

// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        memberId: null,
        profileImageUrl: '',
        nickName: ''
    }),
    actions: {
        setUser(memberId, profileImageUrl, nickName) {
            this.memberId = memberId;
            this.profileImageUrl = profileImageUrl;
            this.nickName = nickName;
        },
        clearUser() {
            this.memberId = null;
            this.profileImageUrl = '';
            this.nickName = '';
        }
    }
})

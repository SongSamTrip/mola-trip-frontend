import { defineStore } from 'pinia';

export const usePostStore = defineStore('postStore', {
  state: () => ({
    post: {}
  }),
  actions: {
    setPost(data) {
      this.post = data;
    }
  }
});
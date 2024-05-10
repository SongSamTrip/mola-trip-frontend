import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const chatStore = defineStore('chat', () => {
  const chatMessage = ref('')

  return { chatMessage }
})

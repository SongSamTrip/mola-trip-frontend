<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h2>여행 계획 참가하기</h2>
        <button @click="closeModal">X</button>
      </header>
      <div class="modal-body">
        <form @submit.prevent="submitCode">
          <label for="joinCode">참가 코드 입력:</label>
          <input type="text" id="joinCode" v-model="joinCode" placeholder="여행 코드 입력">
          <button type="submit">참가</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';

import axios from 'axios';

const props = defineProps({
  isVisible: Boolean
});

const emit = defineEmits(['update:isVisible']);

const joinCode = ref('');

function closeModal() {
  emit('update:isVisible', false);
}

const router = useRouter();

async function submitCode() {
  const authToken = localStorage.getItem('authToken'); // authToken을 localStorage에서 가져옴

  try {
    const response = await axios.post(`http://localhost:8080/api/trip-plan/${joinCode.value}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}` // Authorization 헤더에 토큰 추가
      }
    });
    closeModal();
    router.push(`/map/${response.data}`); // 응답받은 tripPlanId로 리다이렉트
  } catch (error) {
    console.error('Failed to join the trip:', error);
    alert('참가 실패: ' + error.message);
  }
}


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 20px;
}
</style>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h2>새 여행 생성</h2>
        <button @click="closeModal">X</button>
      </header>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <label for="tripName">여행 이름:</label>
          <input type="text" id="tripName" v-model="tripName">

          <label for="startDate">시작 날짜:</label>
          <input type="date" id="startDate" v-model="startDate">

          <label for="endDate">종료 날짜:</label>
          <input type="date" id="endDate" v-model="endDate">

          <button type="submit">생성</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const props = defineProps({
  isVisible: Boolean
});

const emit = defineEmits(['update:isVisible']);
const tripName = ref('');
const startDate = ref('');
const endDate = ref('');
const router = useRouter(); // useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.

function closeModal() {
  emit('update:isVisible', false);
}

async function submitForm() {
  const newTripPlan = {
    trip_name: tripName.value,
    start_date: startDate.value + 'T00:00:00',
    end_date: endDate.value + 'T23:59:59'
  };
  const authToken = localStorage.getItem('authToken'); // authToken을 localStorage에서 가져옴

  try {

    const response = await axios.post('http://localhost:8080/api/trip-plan', newTripPlan, {
      headers: {
        'Authorization': `Bearer ${authToken}` // Authorization 헤더에 토큰 추가
      }
    });
    console.log('Trip plan created:', response.data);
    closeModal();
    router.push(`/map/${response.data}`); // 응답으로 받은 여행 계획 ID를 사용하여 라우터 이동
  } catch (error) {
    console.error('Failed to create trip plan:', error);
    alert('여행 계획 생성 실패: ' + error.message);
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

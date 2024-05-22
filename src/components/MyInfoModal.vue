
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h2>내 정보</h2>
        <button @click="closeModal" type="button" class="btn-close">
          <span class="icon-cross"></span>
          <span class="visually-hidden">X</span>
        </button>
      </header>
      <div class="modal-body">
<!--        <form @submit.prevent="submitNameChange">-->
<!--          <input type="text" class="input-2" id="tripName" v-model="tripName" :placeholder="nickName || '이름 수정'">-->
<!--          &lt;!&ndash; 이름 수정 버튼 &ndash;&gt;-->
<!--          <button class="btn btn-primary btn-round-2" type="submit">이름 수정</button>-->
<!--        </form>-->

        <!-- 로그아웃 버튼은 폼 밖에 위치 -->
        <button @click="logout" class="btn btn-secondary btn-round-2">로그아웃</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const props = defineProps({
  isVisible: Boolean
});
const emit = defineEmits(['update:isVisible']);

const tripName = ref('');  // 사용자 이름 입력을 위한 반응형 참조
const nickName = computed(() => userStore.nickName);  // 사용자 스토어에서 닉네임 가져오기

function closeModal() {
  emit('update:isVisible', false);
}

function submitNameChange() {
  // 이름 수정 로직: 스토어 업데이트
  if (tripName.value) {
    userStore.setUser(userStore.memberId, userStore.profileImageUrl, tripName.value);
    closeModal();  // 이름 수정 후 모달 닫기
  }
}

function logout() {
  // 로그아웃 로직 처리
  userStore.clearUser();  // 사용자 정보 클리어
  // localStorage에서 authToken 삭제
  localStorage.removeItem('authToken');

  closeModal();  // 로그아웃 후 모달 닫기

  // 사용자를 홈페이지로 리다이렉트
  window.location.href = '/';
}

// async function submitForm() {
//   const newTripPlan = {
//     trip_name: tripName.value,
//     start_date: startDate.value + 'T00:00:00',
//     end_date: endDate.value + 'T23:59:59'
//   };
//   const authToken = localStorage.getItem('authToken');
//
//   try {
//     const response = await axios.post('http://localhost:8080/api/trip-plan', newTripPlan, {
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       }
//     });
//     console.log('Trip plan created:', response.data);
//     closeModal();
//     router.push(`/map/${response.data}`);
//   } catch (error) {
//     console.error('Failed to create trip plan:', error);
//     alert('여행 계획 생성 실패: ' + error.message);
//   }
// }
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
  width: 140px;
  height: 70px;
}

.input-2 {
  width: 80%;
  margin-right: 30px;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
}


.input-1 {
  width: 150px;
  margin-right: 30px;
  height: 32px;
  font-size: 13px;
  border: 0;
  border-radius: 10px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
}




.btn {
  appearance: none;
  -webkit-appearance: none;
  font-family: sans-serif;
  cursor: pointer;
  padding: 12px;
  min-width: 100px;
  border: 0px;
  -webkit-transition: background-color 100ms linear;
  -ms-transition: background-color 100ms linear;
  transition: background-color 100ms linear;
}

.btn:focus, .btn.focus {
  outline: 0;
}

.btn-round-1 {
  border-radius: 8px;
}

.btn-round-2 {
  border-radius: 20px;
}

.btn-primary {
  background: #db344d;
  color: #ffffff;
}

.btn-primary:hover {
  background: #af3f8c;
  color: #ffffff;
}

.btn-success {
  background: #2ecc71;
  color: #ffffff;
}




@mixin cross($size: 20px, $color: currentColor, $thickness: 1px) {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: $size;
  height: $size;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: ($size - $thickness) / 2;
    left: 0;
    right: 0;
    height: $thickness;
    background: $color;
    border-radius: $thickness;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }

  span {
    display: block;
  }

}


.btn-close {
  margin: 0;
  border: 0;
  padding: 0;
  background: hsl(216, 100, 50);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 150ms;

  .icon-cross {
    @include cross(40px, #fff, 6px);
  }

  &:hover,
  &:focus {
    transform: rotateZ(90deg);
    background: hsl(216, 100, 40);
  }

}

body {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  align-content: flex-start;
  height: 100vh;
}


.visually-hidden {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden;
}






/* Mixin으로 작성된 cross 스타일 */
.cross {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: 20px;
  height: 20px;
}

.cross::before,
.cross::after {
  content: '';
  position: absolute;
  top: calc((20px - 1px) / 2);
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  border-radius: 1px;
}

.cross::before {
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}

.cross span {
  display: block;
}

/* Example 1 */
.btn-close {
  margin: 0;
  border: 0;
  padding: 0;
  background: hsl(216, 100, 50);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 150ms;
}

.btn-close .icon-cross {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: 40px;
  height: 40px;
}

.btn-close .icon-cross::before,
.btn-close .icon-cross::after {
  content: '';
  position: absolute;
  top: calc((40px - 3px) / 2);
  left: 0;
  right: 0;
  height: 3px;
  background: grey;
  border-radius: 6px;
}

.btn-close .icon-cross::before {
  transform: rotate(45deg);
}

.btn-close .icon-cross::after {
  transform: rotate(-45deg);
}

.btn-close:hover,
.btn-close:focus {
  transform: rotateZ(90deg);
  background: hsl(216, 100, 40);
  background-color: #d94343;
}



.cross-1px::before,
.cross-1px::after {
  content: '';
  position: absolute;
  top: calc((80px - 1px) / 2);
  left: 0;
  right: 0;
  height: 1px;
  background: #000;
  border-radius: 1px;
}

.cross-1px::before {
  transform: rotate(45deg);
}

.cross-1px::after {
  transform: rotate(-45deg);
}

</style>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import NewTripModal from '@/components/NewTripModal.vue';
import JoinTripModal from '@/components/JoinTripModal.vue';
import {useJwt} from '@vueuse/integrations/useJwt'
import {useUserStore} from '@/stores/userStore';

const tripPlans = ref([]);
import axios from 'axios'; // axios를 임포트하세요

const userStore = useUserStore();

const user = userStore.$state;

onMounted(async () => {
  const authToken = localStorage.getItem('authToken');
  console.log(authToken)
  if (!authToken) {
    console.error('Authorization token not found');
    return;
  }

  try {

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Authorization token not found');
      return;
    }

    try {
      const {header, payload} = useJwt(authToken);

      // ComputedRefImpl에서 값을 추출하기 위해 .value를 사용
      const actualHeader = header.value;
      const actualPayload = payload.value;

      const userStore = useUserStore();
      userStore.setUser(actualPayload.memberId, actualPayload.profileImageUrl, actualPayload.nickName);


    } catch (error) {
      console.error('Error decoding JWT:', error);
    }

    const response = await axios.get('http://localhost:8080/api/trip-plan/lists', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    tripPlans.value = response.data;
  } catch (error) {
    console.error('Failed to fetch trip plans:', error);
  }
});


const router = useRouter();

function selectTrip(tripId) {
  router.push({name: 'map', params: {tripId}}); // 라우터를 통해 동적 경로로 이동
}


const showModal = ref(false);

const showModal2 = ref(false);
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic&display=swap" rel="stylesheet">
  <body>
  <link href="https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Brush+Script&family=Nanum+Gothic&display=swap"
        rel="stylesheet">
  <div class="container">
    <div class="card">
      <div class="header">
        <h1 class="jua-regular"><strong>어디로 여행을 갈까?</strong></h1>
        <div class="email-box">
          <p style="color: #2c3e50">
            <text style="font-size: 20px; color: #c79595" class="nanum-brush-script-regular"><b>{{ user.nickName }}</b></text>
            의 여행계획
          </p>
        </div>
      </div>
      <div class="workspace-list">
        <div class="workspace-item" v-for="plan in tripPlans" :key="plan.tripId">
          <div class="workspace-info">
            <div class="workspace-icon"></div>
            <div>
              <h2>{{ plan.tripName }}</h2>
              <p>{{ plan.totalTripMember }}명의 멤버</p>
            </div>
          </div>
          <button class="btn btn-select" @click="selectTrip(plan.tripId)">여행선택</button>
        </div>

        <div class="more-options">

          <a href="/notice" class="link"><h3>다른 여행 구경가기</h3></a>
        </div>
        <div class="more-options">
          <button  class="btn btn-primary btn-round-2" @click="showModal2 = true">여행계획 참가하기</button>
          <JoinTripModal style="z-index: 4000" v-model:isVisible="showModal2"/>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>새로운 여행 계획을 만들까요?</p>
      <button class="btn btn-primary btn-round-2" @click="showModal = true">새 여행 생성</button>
      <NewTripModal style="z-index: 5000" v-model:isVisible="showModal"/>
    </div>

  </div>
  </body>
  <div class="underlay-photo"></div>
  <div class="underlay-black"></div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,700");

.nanum-gothic-regular {
  font-family: "Nanum Gothic", sans-serif;
  font-weight: 400;
  font-style: normal;
}
.nanum-brush-script-regular {
  font-family: "Nanum Brush Script", cursive;
  font-weight: 400;
  font-style: normal;
}



[class*="underlay"] {
  left: 0;
  min-height: 100%;
  min-width: 100%;
  position: fixed;
  top: 0;
}

.underlay-photo {
  animation: hue-rotate 6s infinite;
  background: url('https://cdn.pixabay.com/photo/2016/12/21/07/43/korea-1922376_1280.jpg') no-repeat center center;
  background-size: cover;
  filter: grayscale(30%);
  z-index: -1;
}

.underlay-black {
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

.more-options {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

@keyframes hue-rotate {
  from {
    filter: grayscale(30%) hue-rotate(0deg);
  }
  to {
    filter: grayscale(30%) hue-rotate(360deg);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: transparent;

}

.container {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 24rem;
  margin-bottom: 16px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #84CEEB;
  color: black;
  border-radius: 8px 8px 0 0;
}

.email-box {
  background-color: #ffffff;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  width: 100%;
  text-align: center;
}

.workspace-list {
  padding: 16px;
}

.workspace-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.workspace-info {
  display: flex;
  align-items: center;
}

.workspace-icon {
  width: 48px;
  height: 48px;
  background-color: #F9F7F7;
  margin-right: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-select {
  background-color: #5AB9EA;
  color: white;
}

.btn-more {
  background-color: transparent;
  color: #6E42C1;
}

.link {
  color: #393E46;
  text-decoration: underline;
}

.btn-join {
  background-color: #5AB9EA;
  color: white;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 24rem;
  margin-bottom: 16px;
}

.profile-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon {
  color: #6E42C1;
}



:root {
  --motion-ease: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  --motion-duration: 0.3s;
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
  background: #5AB9EA;
  color: #ffffff;
}

.btn-primary:hover {
  background: #3F72AF;
  color: #ffffff;
}

.btn-success {
  background: #2ecc71;
  color: #ffffff;
}

</style>
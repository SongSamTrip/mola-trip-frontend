<script setup>

</script>

<template>
  <body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>어디로 여행을 갈까? </h1>
        <div class="email-box">
          <p style="color: #2c3e50">sungwoo166@gmail.com의 여행계획</p>
        </div>
      </div>
      <div class="workspace-list">
        <div class="workspace-item">
          <div class="workspace-info">
            <div class="workspace-icon"></div>
            <div>
              <h2>서울여행</h2>
              <p>1명의 멤버</p>
            </div>
          </div>
          <button class="btn btn-select">여행선택</button>
        </div>
        <div class="workspace-item">
          <div class="workspace-info">
            <div class="workspace-icon"></div>
            <div>
              <h2>우주여행</h2>
              <p>5명의 멤버</p>
            </div>
          </div>
          <button class="btn btn-select">여행선택</button>
        </div>
        <div class="workspace-item">
          <div class="workspace-info">
            <div class="workspace-icon"></div>
            <div>
              <h2>Mola-Trip</h2>
              <p>2명의 멤버</p>
            </div>
          </div>
          <button class="btn btn-select">여행선택</button>
        </div>
        <div class="more-options">
          <button class="btn btn-more">더 보기 ↓</button>
        </div>
        <div class="more-options">

          <a href="#" class="link">다른 여행 구경가기</a>
        </div>
        <div class="more-options">
          <button class="btn btn-join">여행계획 참가하기</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>새로운 여행 계획을 만들까요?</p>
      <button class="btn btn-create">새 여행 생성</button>
    </div>
    <div class="profile-icon">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <line x1="19" x2="19" y1="8" y2="14"></line>
        <line x1="22" x2="16" y1="11" y2="11"></line>
      </svg>
    </div>
  </div>
  </body>
  <div class="underlay-photo"></div>
  <div class="underlay-black"></div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,700");

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
  background-color: #6E42C1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
  background-color: #8667d7;
  color: white;
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
  background-color: #FFC82C;
  margin-right: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-select {
  background-color: #6E42C1;
  color: white;
}

.btn-more {
  background-color: transparent;
  color: #6E42C1;
}

.link {
  color: #6E42C1;
  text-decoration: underline;
}

.btn-join {
  background-color: #6E42C1;
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

</style>
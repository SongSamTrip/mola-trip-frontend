<script setup>
import {RouterView} from 'vue-router'


</script>

<template>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css">

    <!-- Font Awesome CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css">

  </head>
  <div class="container centered-image">
    <img src="/src/assets/logo.png" alt="" style="width: 300px; height: 300px;">
  </div>
  <div class="board">
    <div class="d-flex justify-content-center">
      <router-link to="/notice/boardList" class="btn-primary">Go to boardList</router-link>
      <router-link to="/notice/boardForm" class="btn-primary">Go to boardForm</router-link>
    </div>
    <router-view></router-view> <!-- 여기에 자식 컴포넌트가 렌더링됩니다 -->
  </div>
</template>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 이미지가 맨 위에 오도록 설정 */
  text-align: center;
}

.centered-image {
  width: 400px;
  height: 400px;
  margin-top: 20px; /* 상단 여백 조절 */
}

.board {
  margin-left: 20px;
  margin-right: 20px;
}
</style>

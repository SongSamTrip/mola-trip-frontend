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
    <router-link to="/map" class="btn-primary">Go to Map</router-link>
    <router-link to="/notice/boardList" class="btn-primary">Go to boardList</router-link>
    <router-link to="/notice/boardForm" class="btn-primary">Go to boardForm</router-link>
</div>
    <router-view></router-view> <!-- 여기에 자식 컴포넌트가 렌더링됩니다 -->
  </div>
</template>


<style scoped>
.btn-primary {
    background-color: #007BFF; /* 버튼의 배경색 설정 */
    color: white; /* 글자색은 흰색으로 설정 */
    padding: 10px 20px; /* 상하, 좌우 패딩 설정 */
    font-size: 16px; /* 글자 크기 설정 */
    border: none; /* 테두리 없앰 */
    border-radius: 20px; /* 버튼의 모서리를 둥글게 설정 */
    cursor: pointer; /* 마우스 오버 시 커서를 손가락 모양으로 변경 */
    text-decoration: none; /* 텍스트 밑줄 제거 */
    display: inline-block; /* 인라인 블록 요소로 설정 */
    margin: 0 10px; /* 좌우 마진으로 버튼 사이 간격 조정 */
    transition: background-color 0.3s; /* 배경색 변경시 애니메이션 효과 */
}

.btn-primary:hover {
    background-color: #0056b3; /* 호버 시 배경색 변경 */
}
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

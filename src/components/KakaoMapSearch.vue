<script setup>
import { ref, onMounted } from 'vue'
import { usePlaceStore } from '@/stores/placeStore'
import axios from "axios";

const mapContainer = ref(null)
const keyword = ref('제주도 맛집')
const placesList = ref([])
const pagination = ref(null)
let map, marker, infowindow, ps
const emit = defineEmits(['update-location'])

onMounted(() => {
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
  ps = new kakao.maps.services.Places()

  searchPlaces() // 검색
})

function searchPlaces() {
  if (!keyword.value.trim()) { // 검색어가 없다면
    alert('키워드를 입력해주세요!')
    return
  }
  // keyword.value랑 placesSearchCB 호출
  ps.keywordSearch(keyword.value, placesSearchCB)
}


function placesSearchCB(data, status, pagi) {
  const placeStore = usePlaceStore()  // 스토어 접근

  if (status === kakao.maps.services.Status.OK) {
    console.log(data)
    placeStore.setPlaces(data)  // 데이터를 스토어에 저장
    placeStore.setPagination(pagi)  // 페이지 정보를 스토어에 저장
    displayPlaces(data)
    pagination.value = pagi

    // 스토어에 저장된 데이터와 페이지네이션 정보를 콘솔에 출력
    // console.log('스토어에 저장된 장소:', placeStore.places);
    // console.log('스토어에 저장된 페이지 정보:', placeStore.pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.')
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 결과 중 오류가 발생했습니다.')
  }

}

function displayPlaces(places) {
  placesList.value = places.map((place, index) => {
    const position = new kakao.maps.LatLng(place.y, place.x)
    // const marker = addMarker(position, index)
    return { ...place, marker }
  })
}

function goToMap(url) {
  window.open(url, '_blank') // 새 탭에서 URL 열기
}

function sendLocation(place) {
  // alert(place.x + " " + place.y)
  emit('update-location', { x: place.x, y: place.y });
}


function addItem(place) {
  console.log(place.place_name)

  const newDiv = document.createElement('div');
  newDiv.className = 'draggable';
  newDiv.textContent = place.place_name;


  newDiv.setAttribute('data-v-b7ac1dbf', '')
  const selectorElement = document.querySelector("#app > div > div > div:nth-child(3) > main > div:nth-child(4) > div");
  selectorElement.appendChild(newDiv);
  console.log(place)
  console.log("Parent element HTML:");
  // const container = document.getElementById('subList');
  newDiv.id = `place-${place.id}`;
  newDiv.setAttribute('data-name', place.place_name);
  newDiv.setAttribute('data-road-address', place.road_address_name);
  newDiv.setAttribute('data-address', place.address_name);
  newDiv.setAttribute('data-url', place.place_url);
  newDiv.setAttribute('data-phone', place.phone);
  newDiv.setAttribute('data-x', place.x);
  newDiv.setAttribute('data-y', place.y);

  // json 화
  const container2 = document.getElementById('subList');
  const items = container2.querySelectorAll('div');
  const elements = Array.from(items).map(item => {
    return {
      class: item.className,
      id: item.id,
      name: item.getAttribute('data-name'),
      road_address: item.getAttribute('data-name'),
      address: item.getAttribute('data-address'),
      url: item.getAttribute('data-url'),
      phone: item.getAttribute('data-phone'),
      x: item.getAttribute('data-x'),
      y: item.getAttribute('data-y'),
      textContent: item.textContent.trim()
    };
  });

  const jsonData = {
    items: elements   // 생성된 객체 배열을 'items' 키에 할당
  };
  console.log(JSON.stringify(jsonData, null, 2));
  // console.log(container.innerHTML);

}

function sendData() {
  // JSON 데이터를 문자열로 변환
  const jsonString = JSON.stringify(jsonData);

  // Axios를 사용하여 POST 요청 보내기
  axios.post('https://localhost:8080/api/data', {
    data: jsonString
  })
      .then(function (response) {
        console.log('Response:', response.data);
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
}

</script>

<template>
  <form style="margin-top: 10px" @submit.prevent="searchPlaces" class="search-form">
    <input type="text" v-model="keyword" size="15" value="" placeholder="Search" class="search-input">
    <button type="submit" class="search-button">
      <svg class="submit-button">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search"></use>
      </svg>
    </button>

  </form>
  <div class="map_wrap" style="
      position: absolute;
      top: 70px;
      width: 350px;
      height: 350px;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 5000;">
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" display="none">
        <symbol id="search" viewBox="0 0 32 32">
          <path d="M 19.5 3 C 14.26514 3 10 7.2651394 10 12.5 C 10 14.749977 10.810825 16.807458 12.125 18.4375 L 3.28125 27.28125 L 4.71875 28.71875 L 13.5625 19.875 C 15.192542 21.189175 17.250023 22 19.5 22 C 24.73486 22 29 17.73486 29 12.5 C 29 7.2651394 24.73486 3 19.5 3 z M 19.5 5 C 23.65398 5 27 8.3460198 27 12.5 C 27 16.65398 23.65398 20 19.5 20 C 15.34602 20 12 16.65398 12 12.5 C 12 8.3460198 15.34602 5 19.5 5 z" />
        </symbol>
      </svg>
    <div id="menu_wrap" class="bg_white" style="
      overflow-y: auto;
      max-height: 340px;
      margin: 10px;">
      <li style="margin-left: 15px; margin-right: 15px; margin-top: 5px;" v-for="(place, index) in placesList"
          :key="index"
          @mouseover="handleMouseOver(place)"
          @mouseout="handleMouseOut"
          @click="sendLocation(place)"
          class="leaderboard__profile">
        <b><span style="color: black; font-size: 13px">{{ place.place_name }}</span></b>
        <span style="color: darkslategray; font-size: 13px">{{ place.road_address_name || place.address_name }}</span>
        <div>
          <button style="color: darkslategray; font-size: 11px" @click="goToMap(place.place_url)">페이지</button>
          <button style="color: deeppink; font-size: 11px" @click="addItem(place)">추가해</button>
        </div>
      </li>
    </div>
  </div>
</template>
<style scoped>

.map_wrap {
  border-radius: 20px;
  position: relative; /* Ensure the scrollbar is only for the list content */
}

.menu_wrap {
  max-height: 360px; /* Set maximum height to trigger scrollbar */
  overflow-y: auto; /* Enable scrolling inside the list */
  padding: 0; /* 내부 패딩 제거 */
  margin: 20px; /* 모든 방향에 대해 20px의 마진을 추가 */
  background-color: #94a3b8; /* 배경색을 하얀색으로 설정 */

}


.list_container ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.list_container li {
  padding: 10px;
  border-bottom: 1px solid #cbd5e1;
}

body {
  margin: 0;
  background-color: #eaeaea;
  display: grid;
  height: 100vh;
  place-items: center;
  font-family: 'Source Sans Pro', sans-serif;
}

.leaderboard {
  max-width: 490px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, 0.4);
}

.leaderboard header {
  --start: 15%;
  height: 130px;
  background-image: repeating-radial-gradient(circle at var(--start), transparent 0%, transparent 10%, rgba(54, 89, 219, 0.33) 10%, rgba(54, 89, 219, 0.33) 17%), linear-gradient(to right, #5b7cfa, #3659db);
  color: #fff;
  position: relative;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.leaderboard__title {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: calc(var(--start) * 0.75);
  transform: translateY(-50%);
  text-transform: uppercase;
  margin: 0;
}

.leaderboard__title--top {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 6.5px;
}

.leaderboard__title--bottom {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 3.55px;
  opacity: 0.65;
  transform: translateY(-2px);
}

.leaderboard__icon {
  fill: #fff;
  opacity: 0.35;
  width: 50px;
  position: absolute;
  top: 50%;
  left: var(--start);
  transform: translate(-50%, -50%);
}

.leaderboard__profiles {
  background-color: #fff;
  border-radius: 0 0 12px 12px;
  padding: 15px 15px 20px;
  display: grid;
  row-gap: 8px;
}

.leaderboard__profile {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
  padding: 10px 30px 10px 10px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 5px 7px -1px rgba(51, 51, 51, 0.23);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.7, 0.98, 0.86, 0.98), box-shadow 0.25s cubic-bezier(0.7, 0.98, 0.86, 0.98);
  background-color: #fff;
}

.leaderboard__profile:hover {
  transform: scale(1.1);
  box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
}


.leaderboard__name {
  color: #979cb0;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.64px;
  margin-left: 12px;
}

.leaderboard__value {
  color: #35d8ac;
  font-weight: 700;
  font-size: 34px;
  text-align: right;
}

.leaderboard__value > span {
  opacity: 0.8;
  font-weight: 600;
  font-size: 13px;
  margin-left: 3px;
}
.search-form {
  position: relative;
  top: 30px;
  left: 50%;
  width: 350px;
  height: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);
  background: #fff;
  transition: all 0.3s ease;
}

.search-form.focus {
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.15);
}

.search-input {
  position: absolute;
  top: 10px;
  left: 38px;
  font-size: 14px;
  background: none;
  color: #5a6674;
  width: 195px;
  height: 20px;
  border: none;
  appearance: none;
  outline: none;
}

.search-input::-webkit-search-cancel-button {
  appearance: none;
}

.search-button {
  position: absolute;
  top: 10px;
  left: 15px;
  height: 20px;
  width: 20px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
}

.search-button svg {
  width: 20px;
  height: 20px;
  fill: #5a6674;
}


/* Scrollbar styles */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  border: 1px solid #bfde85;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #d2d7ca;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bfde85;
}
</style>
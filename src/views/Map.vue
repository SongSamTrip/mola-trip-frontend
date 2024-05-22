<script setup>
import {onMounted, ref, watch, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import KakaoMapSearch from '@/components/KakaoMapSearch.vue'
import Chat from '@/components/Chat.vue'
import Draggable from '@/components/List.vue'
import {usePlaceStore} from '@/stores/placeStore'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores/userStore'
import MyInfoModal from "@/components/MyInfoModal.vue"; // userStore를 import하는 코드 추가

const route = useRoute()
const router = useRouter()
const mapContainer = ref(null)
const placeStore = usePlaceStore()
const {places} = storeToRefs(placeStore)

const userStore = useUserStore()


let map = null
let markers = []
let bounds = null
let infowindow = new kakao.maps.InfoWindow({zIndex: 9000})

const imageLoaded = ref(false);

onMounted(() => {

  kakao.maps.load(() => {
    const options = {
      center: new kakao.maps.LatLng(35.1785969384698, 129.199700145244),
      level: 3
    }

    map = new kakao.maps.Map(mapContainer.value, options)
    bounds = new kakao.maps.LatLngBounds()
    let ps = new kakao.maps.services.Places()

    // alert('메인 경로가 표시됩니다.');
    // var linePath = [
    //   new kakao.maps.LatLng(33.498577203781664, 126.45914433997106),
    //   new kakao.maps.LatLng(33.2579811121134,126.416704762779)
    // ];
    // var polyline = new kakao.maps.Polyline({
    //   path: linePath, // 선을 구성하는 좌표배열 입니다
    //   strokeWeight: 5, // 선의 두께 입니다
    //   strokeColor: '#FFAE00', // 선의 색깔입니다
    //   strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    //   strokeStyle: 'solid' // 선의 스타일입니다
    // });
    // polyline.setMap(map);

  })
})
let currentPolyline = null;

function showAlert() {


  alert('메인 경로가 표시됩니다.');
  removeMarker()
  // mainList 내부의 모든 자식 div 요소들을 선택
  var places = document.querySelectorAll('#mainList .draggable');
  var linePath = [];
  var index = 0;
  // 각 place의 data-x와 data-y 속성 값을 읽어 linePath 배열에 추가
  places.forEach(function(place) {
    var x = parseFloat(place.getAttribute('data-x'));
    var y = parseFloat(place.getAttribute('data-y'));
    linePath.push(new kakao.maps.LatLng(y, x));


    console.log(index)
    const position = new kakao.maps.LatLng(y, x)
    const marker = addMarker(position, index)

    bounds.extend(position)

    // kakao.maps.event.addListener2(marker, 'mouseover', function () {
    //   displayInfowindow(marker, place)
    // })
    index++;
    markers.push(marker) // 새로 생성된 마커를 배열에 추가, x));
  });

  // 이전에 그려진 폴리라인이 있다면 지도에서 제거
  if (currentPolyline) {
    currentPolyline.setMap(null);
  }

  // 새로운 폴리라인 객체 생성 및 지도에 표시
  var polyline = new kakao.maps.Polyline({
    path: linePath, // 선을 구성하는 좌표 배열
    strokeWeight: 5, // 선의 두께
    strokeColor: '#FFAE00', // 선의 색깔
    strokeOpacity: 0.7, // 선의 불투명도
    strokeStyle: 'solid' // 선의 스타일
  });

  polyline.setMap(map); // 폴리라인을 지도에 표시
  currentPolyline = polyline; // 현재 폴리라인을 전역 변수에 저장
}

const navigateToBoard = () => {
  router.push({name: 'boardList'});
}


function handleLocationUpdate(location) {
  var moveLatLon = new kakao.maps.LatLng(location.y, location.x)
  map.panTo(moveLatLon)
  console.log('Received location:', location)
}

// places 데이터가 변경될 때마다 displayPlaces 함수를 호출합니다.
watch(
    places,
    (newPlaces) => {
      displayPlaces(newPlaces)
    },
    {deep: true}
)


function displayPlaces(places) {
  if (!map) return // 지도가 초기화되지 않은 경우 함수를 종료합니다.

  removeMarker() // 기존 마커 제거
  // bounds = null;
  bounds = new kakao.maps.LatLngBounds()
  places.forEach((place, index) => {
    const position = new kakao.maps.LatLng(place.y, place.x)
    const marker = addMarker(position, index)

    bounds.extend(position)

    kakao.maps.event.addListener(marker, 'mouseover', function () {
      displayInfowindow(marker, place)
    })



    kakao.maps.event.addListener(marker, 'click', function () {
      if (!navigator.clipboard) {
        // 클립보드 API를 지원하지 않는 경우
        alert('클립보드 기능을 지원하지 않는 브라우저입니다.');
      } else {
        navigator.clipboard.writeText(place.road_address_name).then(function () {
          alert('주소가 클립보드에 복사되었습니다.');
          // 클립보드 복사 성공 후 새 탭에서 특정 URL로 이동
          window.open('https://map.kakao.com/link/map/' + place.id, '_blank');
        }, function (err) {
          alert('복사 실패: ' + err);
          // 복사 실패해도 URL로 이동할지 결정 필요'
          window.open('https://example.com', '_blank');
        });
      }
    });


    kakao.maps.event.addListener(marker, 'mouseout', function () {
      infowindow.close()
    })

    markers.push(marker) // 새로 생성된 마커를 배열에 추가
  })
  map.setBounds(bounds)
}

function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null)
  }
  markers = [] // 마커 배열을 초기화
}

function addMarker(position, idx) {
  const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'
  const imageSize = new kakao.maps.Size(36, 37)
  const imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
    offset: new kakao.maps.Point(13, 37)
  }
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions)
  const marker = new kakao.maps.Marker({
    position: position,
    image: markerImage
  })

  marker.setMap(map)
  return marker
}

function displayInfowindow(marker, place) {
  var content =
      '<div style="padding:10px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' +
      '<h4 style="color: #333; margin-bottom: 5px;">' + place.place_name + '</h4>' +
      '<div style="font-size: 14px; color: #666; margin-bottom: 5px;">' + place.road_address_name + '</div>' +
      '<div style="font-size: 14px; color: #666;">' + place.phone + '</div>' +
      '<div style="font-size: 16px; color: #666;"><b>카카오 맵 이동시 클릭하세요!</b></div>' +
      '</div>';


  infowindow.setContent(content)
  infowindow.open(map, marker)
}


const isDropdownVisible = ref(false);

function toggleDropdown() {
  isDropdownVisible.value = !isDropdownVisible.value;
}

function selectTrip(trip) {
  console.log('Selected Trip:', trip.name);
  isDropdownVisible.value = false; // 드롭다운 닫기
  // 추가적인 작업을 여기에 추가할 수 있습니다. 예: 페이지 리다이렉트
}


const tripCode = ref(""); // tripCode를 저장할 ref 생성

const userProfileImageUrl = computed(() => {
  return userStore.profileImageUrl || "https://robohash.org/geeknews?set=set4";
});

const showDropdown2 = ref(true);

function toggleDropdown2() {
  console.log("toggleDropdown2 called");
  toggleDropdown2.value = !toggleDropdown2.value;
  console.log(showDropdown2.value)
}

const showModal = ref(false);

</script>

<template>
  <div ref="mapContainer" style="width: 100vw; height: 100vh">
    <div
        style="position: absolute; top: 0px; left: 20px; width: 350px; height: 400px; z-index: 5000"
    >

      <KakaoMapSearch @update-location="handleLocationUpdate"></KakaoMapSearch>
      <div class="profile-user-img">
        <img @click="showModal = true" :src="userStore.profileImageUrl" alt="profile-user-img"
             class="profile-user-img-img">
        <MyInfoModal style="z-index: 5000" v-model:isVisible="showModal"/>

      </div>

      <div style="z-index: 100; margin-left: 500px; position: absolute; top: 0; width: 400px; display: flex; justify-content: space-evenly;">

        <nav style="z-index: 100; background-color: rgba(255, 255, 255, 0);" id="navigation" class="site-navigation" role="navigation">
          <ul style="margin-top: 15px; width: 1000px" class="menu">
            <!-- 여기 추가 -->
            <li style="margin-left: 50px; background-color: #f0f0f0;" class="menu-item"><a href="/tripPosts/boardList" style="color: black;">게시판</a></li>
            <li style="margin-left: 50px; background-color: #d1e7dd;" class="menu-item"><a href="/land" style="color: black;">여행목록</a></li>
            <li style="margin-left: 50px; background-color: #b8daff;" class="menu-item">
              <a href="#" style="color: black;" @click="showAlert()">메인경로표시</a>
            </li>

          </ul>
        </nav>

      </div>

    </div>
    <div
        style="position: absolute; top: 430px; left: 20px; width: 350px; height: 500px; z-index: 500"
    >
      <Chat :class="{ 'disabled-background': showModal }"/>
    </div>
    <div  :class="{ 'disabled-background': showModal }" style=" border-radius: 20px; margin-top: 0px; margin-right: 20px;
 background-color: white; position: absolute; top: 20px; right: 20px; width: 300px; height: 900px; z-index: 500;
overflow: hidden;">
      <Draggable></Draggable>

    </div>
  </div>
</template>

<style scoped>
.disabled-background {
  pointer-events: none; /* 포인터 이벤트 비활성화 */
  opacity: 0.2; /* 콘텐츠를 흐리게 표시 */
}

.dropdown-menu-image {
  position: absolute;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: none;
}

.dropdown-menu button {
  margin: 5px;
  padding: 10px;
}

.dropdown-menu {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 5000;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li a {
  display: block;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
}

.dropdown-menu li a:hover {
  background-color: #f1f1f1;
}

.profile-user-img {
  width: 50px;
  height: 50px;
  border-radius: 70%;
  overflow: hidden;
  margin-left: 400px;
  margin-top: -14px;
  z-index: 100000;
}

.profile-user-img-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1000;

}


body {
  overflow: hidden; /* 스크롤바 제거 */
}

.add-notes-btn {
  margin-top: 25px;
  margin-left: px;
  background-color: #007bff; /* 부트스트랩 파란색과 유사 */
  color: white; /* 글자색은 흰색 */
  padding: 10px 20px; /* 내부 여백 */
  border: none; /* 테두리 없음 */
  border-radius: 20px; /* 둥근 모서리 */
  font-size: 16px; /* 글자 크기 */
  cursor: pointer; /* 마우스 오버시 커서 모양 변경 */
  transition: background-color 0.3s; /* 배경색 변경 애니메이션 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
}

.add-notes-btn:hover {
  background-color: #0056b3; /* 호버 시 더 어두운 파란색으로 변경 */
}

.site-navigation {

  display: block;
  font-family: 'Titillium Web', sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin: 20px;
}

.site-navigation ul {
  background: #000000;
  list-style: none;
  margin: 0;
  padding-left: 0;
}

.site-navigation li {
  color: #fff;
  background: rgba(255, 255, 255, 0);
  border-radius: 20px; /* 둥근 모서리 */

  display: block;
  float: left;
  margin: 0 2px 0 0;
  padding: 12px;

  position: relative;
  text-decoration: none;
  text-transform: uppercase;
}

.site-navigation li a {
  color: #ffffff;
  text-decoration: none;
  display: block;
}

.site-navigation li:hover {
  @include transition(background, 0.2s);
  background: rgba(255, 255, 255, 0);

  cursor: pointer;
}

.site-navigation ul li ul {
  background: rgba(255, 255, 255, 0);

  visibility: hidden;
  float: left;
  min-width: 150px;
  position: absolute;
  transition: visibility 0.65s ease-in;
  margin-top: 12px;
  left: 0;
  z-index: 999;
}

.site-navigation ul li:hover > ul,
.site-navigation ul li ul:hover {
  visibility: visible;
}

.site-navigation ul li ul li {
  clear: both;
  padding: 5px 0 5px 18px;
  width: 100%;
}

.site-navigation ul li ul li:hover {
  background: #74b7e4;
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


.profile-user-img {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%; /* 이미지를 원형으로 만듦 */
  overflow: hidden; /* 이미지나 요소가 컨테이너 밖으로 나가지 않도록 함 */
  transition: transform 0.3s ease; /* 부드러운 변환 효과 */
}

.profile-user-img-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
  transition: opacity 0.3s ease; /* 부드러운 투명도 변환 효과 */
}

.profile-user-img:hover .profile-user-img-img {
  opacity: 0.7; /* 이미지를 약간 투명하게 만들어 클릭 유도 */
  transform: scale(1.1); /* 이미지를 약간 확대 */
}
</style>

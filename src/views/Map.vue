<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import KakaoMapSearch from '@/components/KakaoMapSearch.vue'
import Chat from '@/components/Chat.vue'
import Draggable from '@/components/List.vue'
import { usePlaceStore } from '@/stores/placeStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const mapContainer = ref(null)
const placeStore = usePlaceStore()
const { places } = storeToRefs(placeStore)
let map = null
let markers = []
let bounds = null
let infowindow = new kakao.maps.InfoWindow({ zIndex: 9000 })


onMounted(() => {
  kakao.maps.load(() => {
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    }

    map = new kakao.maps.Map(mapContainer.value, options)
    bounds = new kakao.maps.LatLngBounds()
    let ps = new kakao.maps.services.Places()
  })


})

const navigateToBoard = () => {
  router.push({ name: 'boardList' });
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
  // Create the content for the infowindow
  var content =
      '<div style="padding:5px;">' +
      place.place_name +
      '</div>' +
      '<div style="padding:5px;">' +
      place.road_address_name +
      '</div>' +
      '<div style="padding:5px;">' +
      place.place_url +
      '</div>' +
      '<div style="padding:5px;">' +
      place.phone +
      '</div>'

  // Set the content and open the infowindow
  infowindow.setContent(content)
  infowindow.open(map, marker)
}
</script>

<template>
  <div ref="mapContainer" style="width: 100vw; height: 100vh">
    <div
        style="position: absolute; top: 0px; left: 20px; width: 350px; height: 400px; z-index: 5000"
    >
      <KakaoMapSearch @update-location="handleLocationUpdate"></KakaoMapSearch>
      <!-- 버튼 추가 -->
      <button class="add-notes-btn" @click="navigateToBoard" style="position: absolute; right: -120px; top: 0;">게시글</button>
    </div>
    <div
        style="position: absolute; top: 430px; left: 20px; width: 350px; height: 500px; z-index: 5000"
    >
      <Chat/>
    </div>
    <div style="opacity: 0.8;  border-radius: 20px; margin-top: 0px; margin-right: 20px;
 background-color: white; position: absolute; top: 20px; right: 20px; width: 300px; height: 900px; z-index: 5000;
overflow: hidden;">


      <Draggable>
      </Draggable>
    </div>
  </div>
</template>

<style scoped>
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


</style>

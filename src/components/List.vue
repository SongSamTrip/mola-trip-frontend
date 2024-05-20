<script setup lang="ts">
import Sortable from "./Sortable.vue";
import {computed, nextTick, ref, watch} from "vue";
import type {SortableEvent, SortableOptions} from "sortablejs";
import type {AutoScrollOptions} from "sortablejs/plugins";
import {onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {EventSourcePolyfill} from 'event-source-polyfill';
import axios from 'axios';


const route = useRoute()
const tripId = route.params.tripId;
const authToken = localStorage.getItem('authToken');  // 인증 토큰 가져오기

const http = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});

// API 호출을 수행하는 함수
const getList = async () => {
  try {
    console.log("Attempting to fetch data...");
    let {data} = await http.get(`/api/trip-plan/${tripId}`);
    if (data.mainTripList) {
      // mainTripList를 JSON 객체로 파싱
      updateTripListDiv(JSON.parse(data.mainTripList).items, 'mainList');
    } else {
      console.log('Main Trip List is null');
    }

    if (data.subTripList) {
      // subTripList를 JSON 객체로 파싱
      updateTripListDiv(JSON.parse(data.subTripList).items, 'subList');
    } else {
      console.log('Sub Trip List is null');
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

onMounted(() => {
  if (tripId) {
    getList();
    setupSseConnection(tripId)
  }

});

function setupSseConnection(tripId) {
  const authToken = localStorage.getItem('authToken');

  const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/stream/trip-plans/${tripId}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data);

    // mainTripList가 있다면 해당 데이터를 처리
    if (data.mainTripList) {
      // mainTripList를 JSON 객체로 파싱
      updateTripListDiv(JSON.parse(data.mainTripList).items, 'mainList');
    } else {
      console.log('Main Trip List is null');
    }

    // subTripList가 있다면 해당 데이터를 처리
    if (data.subTripList) {
      // subTripList를 JSON 객체로 파싱
      updateTripListDiv(JSON.parse(data.subTripList).items, 'subList');
    } else {
      console.log('Sub Trip List is null');
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close(); // 현재의 연결을 종료
    setTimeout(() => {
      setupSseConnection(tripId); // 재연결 시도
    }, 1000); // 5초 후 재연결
  };
}

function updateTripListDiv(tripList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // 기존 내용을 비움

  if (tripList && tripList.length > 0) {
    tripList.forEach(place => {
      const newDiv = document.createElement("div")
      newDiv.className = 'draggable';
      newDiv.textContent = place.name; // 텍스트를 한 번만 설정

      newDiv.setAttribute('data-v-b7ac1dbf', '');
      newDiv.id = `${place.id}`;
      newDiv.setAttribute('data-name', place.name);
      newDiv.setAttribute('data-road-address', place.road_address);
      newDiv.setAttribute('data-address', place.address);
      newDiv.setAttribute('data-url', place.url);
      newDiv.setAttribute('data-phone', place.phone);
      newDiv.setAttribute('data-x', place.x);
      newDiv.setAttribute('data-y', place.y);

      // 삭제 버튼 추가
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete'; // 버튼 텍스트 설정
      deleteButton.onclick = function(event) {
        event.preventDefault(); // 기본 이벤트 동작 방지
        newDiv.remove(); // 현재 div를 삭제
        updateTripList('mainList', 'subList');
      };

      // 텍스트와 삭제 버튼을 newDiv에 추가
      newDiv.appendChild(deleteButton);
      container.appendChild(newDiv);

    });
  } else {
    console.log('No data to display for:', containerId);
  }

}

function onAdd(event: SortableEvent, group: keyof typeof store.elements) {
  console.log("-------------onAdd----------------")
  console.log(event.from);
  console.log(event.to);
  // updateTripList('mainList', 'subList');

}

function onChange(event: SortableEvent, group: keyof typeof store.elements) {
  console.log("---------------onChange--------------")
  console.log(event.from);
  console.log(event.to);
  // updateTripList('mainList', 'subList');

}

function onUnchoose(event: SortableEvent, group: keyof typeof store.elements) {
  console.log("---------------onUnchoose--------------")
  console.log(event.from);
  console.log(event.to);
  updateTripList('mainList', 'subList');

}


function updateTripList(containerIdMain, containerIdSub) {
  // Helper function to extract trip list data from a container
  const extractData = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return [];
    }

    const items = container.querySelectorAll('div');
    return Array.from(items).map(item => ({
      class: item.className,
      id: item.id,
      name: item.getAttribute('data-name'),
      road_address: item.getAttribute('data-road-address'),
      address: item.getAttribute('data-address'),
      url: item.getAttribute('data-url'),
      phone: item.getAttribute('data-phone'),
      x: item.getAttribute('data-x'),
      y: item.getAttribute('data-y'),
      textContent: item.textContent.trim()
    }));
  };

  // Extract data from both main and sub containers
  const mainTripListElements = extractData(containerIdMain);
  const subTripListElements = extractData(containerIdSub);

  // Serialize data
  const mainTripListJson = JSON.stringify({items: mainTripListElements});
  const subTripListJson = JSON.stringify({items: subTripListElements});

  // Prepare data object for sending
  const tripListHtmlDto = {
    mainTripList: mainTripListJson,
    subTripList: subTripListJson,
  };

  // Get authentication token and trip ID from route
  const accessToken = localStorage.getItem('authToken');
  const tripId = route.params.tripId;

  // Send data to server
  axios.put(`http://localhost:8080/api/trip-plan/list/${tripId}`, tripListHtmlDto, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
      .then((response) => {
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

const options = computed<SortableOptions | AutoScrollOptions>(() => {
  return {
    draggable: ".draggable",
    animation: 150,
    ghostClass: "ghost",
    dragClass: "drag",
    group: "testgroup",
    scroll: true,
    forceFallback: true,
    bubbleScroll: true,
  };
});


</script>

<template>
  <main>
    <div style="margin-top: 5px; margin-left: 5px">본리스트</div>
    <div class="wrapper">
      <Sortable id="mainList" ref="sortable1" :list="elements" item-key="id" :options="options" @change="logEvent"
                @choose="logEvent"
                @unchoose="onUnchoose($event, 'items')" @start="logEvent" @end="logEvent" @add="onAdd($event, 'items')"
                @update="onUpdate($event, 'items')" @sort="onSort" @remove="onRemove($event, 'items')"
                @filter="logEvent"
                @move="logEvent" @clone="logEvent">
        <template #item="{ element }">
          <div :key="element.id" class="draggable">
            {{ element.place_name }}
          </div>

        </template>
      </Sortable>

    </div>
    <div style="margin-top: 5px; margin-left: 5px">부리스트</div>
    <div class="wrapper">
      <Sortable id="subList" ref="sortable2" :list="elements2" item-key="id" :options="options"
                @change="onChange($event, 'items')"
                @choose=""
                @unchoose="onUnchoose($event, 'items')"
                @start=""
                @add="onAdd($event, 'items')"
                @update="onUpdate($event, 'items')"
                @sort=""
                @remove=""
                @filter=""
                @move="onMove($event, 'items')"
                @clone="">
        <template #item="{ element }">
          <div :key="element.id" class="draggable">
            {{ element.place_name }}

          </div>

        </template>
      </Sortable>
    </div>


  </main>
</template>

<style lang="css" scoped>
main {
  max-width: 800px;
  margin: 0 auto;
}

.draggable {
  background: #fff;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  cursor: move;
}

.ghost {
  opacity: 0.5;
  background: #fff;
  border: 1px dashed #ccc;
}

.drag {
  background: #f5f5f5;
}

.wrapper {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 5px 10px 5px;
}

.settings {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.settings .range {
  display: flex;
  flex-direction: column;
}

.settings .range p {
  margin: 0;
}
</style>
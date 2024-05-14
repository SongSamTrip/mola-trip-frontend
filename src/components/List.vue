<script setup lang="ts">
import Sortable from "./Sortable.vue";
import {computed, nextTick, ref, watch} from "vue";
import type {SortableEvent, SortableOptions} from "sortablejs";
import type {AutoScrollOptions} from "sortablejs/plugins";
import { onMounted } from 'vue'
import axios from '@/commons/axios';

const http = axios.create({
  baseURL: 'http://localhost:8080'
});

onMounted(() => {
  const logout = async () => {
    try {
      let { data } = await http.get("/logout");
      console.log(data.result)
      if (data.result == "success") {
        // do something
      }
    } catch (error) {
      console.error(error);
    }
  };
})
const store = {
  elements: {
    items: [
      // {
      //   id: "1",
      //   address_name: "제주특별자치도 서귀포시 색달동 2132-2",
      //   category_group_name: "음식점",
      //   phone: "0507-1386-7060",
      //   place_name: "밥",
      //   place_url: "http://place.map.kakao.com/1890778114",
      //   road_address_name: "제주특별자치도 서귀포시 색달로 10",
      //   x: "126.40610781515082",
      //   y: "33.25884970372605"
      // },
      // {
      //   id: "2",
      //   address_name: "제주특별자치도 제주시 이호일동 651-3",
      //   category_group_name: "음식점",
      //   phone: "064-746-2222",
      //   place_name: "국",
      //   place_url: "http://place.map.kakao.com/21455793",
      //   road_address_name: "제주특별자치도 제주시 항골남길 46",
      //   x: "126.45914433997106",
      //   y: "33.498577203781664"
      // },
      // {
      //   id: "3",
      //   address_name: "제주특별자치도 서귀포시 색달동 2132-2",
      //   category_group_name: "음식점",
      //   phone: "0507-1386-7060",
      //   place_name: "김치",
      //   place_url: "http://place.map.kakao.com/1890778114",
      //   road_address_name: "제주특별자치도 서귀포시 색달로 10",
      //   x: "126.40610781515082",
      //   y: "33.25884970372605"
      // },
      // {
      //   id: "4",
      //   address_name: "제주특별자치도 제주시 이호일동 651-3",
      //   category_group_name: "음식점",
      //   phone: "064-746-2222",
      //   place_name: "물",
      //   place_url: "http://place.map.kakao.com/21455793",
      //   road_address_name: "제주특별자치도 제주시 항골남길 46",
      //   x: "126.45914433997106",
      //   y: "33.498577203781664"
      // },
    ],
  },
};

const store2 = {
  elements: {
    items2: [
      // {
      //   id: "1",
      //   address_name: "제주특별자치도 서귀포시 색달동 2132-2",
      //   category_group_name: "음식점",
      //   phone: "0507-1386-7060",
      //   place_name: "버거",
      //   place_url: "http://place.map.kakao.com/1890778114",
      //   road_address_name: "제주특별자치도 서귀포시 색달로 10",
      //   x: "126.40610781515082",
      //   y: "33.25884970372605"
      // },
      // {
      //   id: "2",
      //   address_name: "제주특별자치도 제주시 이호일동 651-3",
      //   category_group_name: "음식점",
      //   phone: "064-746-2222",
      //   place_name: "피자",
      //   place_url: "http://place.map.kakao.com/21455793",
      //   road_address_name: "제주특별자치도 제주시 항골남길 46",
      //   x: "126.45914433997106",
      //   y: "33.498577203781664"
      // },
      // {
      //   id: "3",
      //   address_name: "제주특별자치도 서귀포시 색달동 2132-2",
      //   category_group_name: "음식점",
      //   phone: "0507-1386-7060",
      //   place_name: "치킨",
      //   place_url: "http://place.map.kakao.com/1890778114",
      //   road_address_name: "제주특별자치도 서귀포시 색달로 10",
      //   x: "126.40610781515082",
      //   y: "33.25884970372605"
      // },
      // {
      //   id: "4",
      //   address_name: "제주특별자치도 제주시 이호일동 651-3",
      //   category_group_name: "음식점",
      //   phone: "064-746-2222",
      //   place_name: "터키",
      //   place_url: "http://place.map.kakao.com/21455793",
      //   road_address_name: "제주특별자치도 제주시 항골남길 46",
      //   x: "126.45914433997106",
      //   y: "33.498577203781664"
      // },
    ],
  },
};

watch(() => store2.elements.items2, (newItems, oldItems) => {
  console.log('items2 changed:', {newItems, oldItems});
}, {deep: true});


const elements = computed(() => {

  return store.elements.items;
});
const elements2 = computed(() => {

  return store2.elements.items2;
});

const sortable = ref<InstanceType<typeof Sortable> | null>(null);

// const logEvent = (evt: Event, evt2?: Event) => {
//   if (evt2) {
//     console.log(evt, evt2);
//   } else {
//     console.log(evt);
//   }
// };

const removeItemFromArray = (group: keyof typeof store.elements, from: number) => {
  store.elements[group].splice(from, 1)[0];

};

// Element is removed from the list into another list
function onRemove(event: SortableEvent, group: keyof typeof store.elements) {
  if (!event.oldIndex) return;
  removeItemFromArray(group, event.oldIndex);
}

function onSort(event: SortableEvent, group: keyof typeof store.elements): void {

}

const addItemToGroup = (group: keyof typeof store.elements, item: { id: string; text: string }, to: number) => {

  store.elements[group].splice(to, 0, item);
  console.log("--------------store.elements-----------------")

  console.log(store.elements);
  console.log("----------------store2.elements---------------")
  console.log(store2.elements);
  console.log("-------------------------------")

};

function onAdd(event: SortableEvent, group: keyof typeof store.elements) {

  console.log(event.from);
  console.log(event.to);
  console.log("---------------------------------")

  nextTick(() => {
    if (!event.newIndex) return;
    // let item = {
    //   id: "new",
    //   text: "New Item",
    // };
    // addItemToGroup(group, item, event.newIndex)
    addItemToGroup(group, event.item, event.newIndex)
  });
}

const moveItemInArray = (group: keyof typeof store.elements, from: number, to: number) => {
  const item = store.elements[group].splice(from, 1)[0];
  store.elements[group].splice(to, 0, item);
};

// Changed sorting within list
function onUpdate(event: SortableEvent, group: keyof typeof store.elements): void {
  if (!event.oldIndex || !event.newIndex) return;
  moveItemInArray(group, event.oldIndex, event.newIndex);
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

const sortable1 = ref<InstanceType<typeof Sortable> | null>(null);
const sortable2 = ref<InstanceType<typeof Sortable> | null>(null);

// Watch props.options and log the changes
watch(options, (newOptions, oldOptions) => {
  console.log('Options changed:', {newOptions, oldOptions});
  if (sortable1.value) {
    for (const property in newOptions) {
      sortable1.value.option(property as keyof SortableOptions, newOptions[property as keyof SortableOptions]);
    }
  }
  if (sortable2.value) {
    for (const property in newOptions) {
      sortable2.value.option(property as keyof SortableOptions, newOptions[property as keyof SortableOptions]);
    }
  }
});


</script>

<template>
  <main>
    <div style="margin-top: 5px; margin-left: 5px">본리스트</div>
    <div class="wrapper">
      <Sortable ref="sortable1" :list="elements" item-key="id" :options="options" @change="logEvent" @choose="logEvent"
                @unchoose="logEvent" @start="logEvent" @end="logEvent" @add="onAdd($event, 'items')"
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
      <Sortable ref="sortable2" :list="elements2" item-key="id" :options="options" @change="logEvent" @choose="logEvent"
                @unchoose="logEvent" @start="logEvent" @end="logEvent" @add="onAdd($event, 'items')"
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
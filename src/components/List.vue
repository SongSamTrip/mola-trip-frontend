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
  const getList = async () => {
    try {
      let { data } = await http.get("/api/list");
      if (data.result == "success") {
        // do something
      }
    } catch (error) {
      console.error(error);
    }
  };
  getList();
});

function onAdd(event: SortableEvent, group: keyof typeof store.elements) {
  console.log("-------------onAdd----------------")
  console.log(event.from);
  console.log(event.to);

}
function onChange(event: SortableEvent, group: keyof typeof store.elements) {
  console.log("---------------onChange--------------")
  console.log(event.from);
  console.log(event.to);
}


// Changed sorting within list
function onUpdate(event: SortableEvent, group: keyof typeof store.elements): void {
  console.log("---------------onUpdate--------------")
  console.log(event.from);
  console.log(event.to);

}

function onMove(event: SortableEvent, group: keyof typeof store.elements): void {
  console.log("---------------onMove--------------")
  console.log(event.from);
  console.log(event.to);

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
      <Sortable id="mainList" ref="sortable1" :list="elements" item-key="id" :options="options" @change="logEvent" @choose="logEvent"
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
      <Sortable id="subList" ref="sortable2" :list="elements2" item-key="id" :options="options"
                @change="onChange($event, 'items')"
                @choose=""
                @unchoose=""
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
<template>
  <div>
    <button
      v-if="pagination.previousPage"
      @click="loadPage(pagination.previousPage)"
    >
      이전
    </button>
    <button
      v-if="pagination.nextPage"
      @click="loadPage(pagination.nextPage)"
    >
      다음
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlaceStore } from '@/stores/placeStore'

const store = usePlaceStore()

const pagination = computed(() => store.pagination)

function loadPage(pageNumber) {
  store.loadPage(pageNumber)  // 페이지 로드 함수 구현 필요
}
</script>

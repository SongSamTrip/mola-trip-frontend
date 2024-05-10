// stores/placeStore.js
import { defineStore } from 'pinia'

export const usePlaceStore = defineStore('placeStore', {
    state: () => ({
        places: [],
        pagination: {}
    }),
    actions: {
        setPlaces(places) {
            this.places = places
        },
        setPagination(pagi) {
            this.pagination = pagi
        },
        async loadPage(pageNumber) {
            this.ps.keywordSearch(this.keyword, (data, status, pagi) => {
                if (status === kakao.maps.services.Status.OK) {
                    this.setPlaces(data);
                    this.setPagination(pagi);
                } else {
                    alert("페이지 로드 중 오류 발생");
                }
            }, { page: pageNumber });
        }
    }
})

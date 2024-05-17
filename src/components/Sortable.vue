<script setup lang="ts">
// Vue와 SortableJS 유틸리티를 가져옵니다.
import { ref, PropType, watch, onUnmounted, computed, useAttrs, Ref } from "vue";
import Sortable, { SortableOptions } from "sortablejs";
import type { AutoScrollOptions } from "sortablejs/plugins";

// SortableJS 이벤트 핸들러를 제외한 옵션들의 타입을 정의합니다.
type SortableOptionsProp = Omit<
    SortableOptions | AutoScrollOptions,
    "onUnchoose" | "onChoose" | "onStart" | "onEnd" | "onAdd" |
    "onUpdate" | "onSort" | "onRemove" | "onFilter" | "onMove" |
    "onClone" | "onChange"
>;

// 부모 컴포넌트에서 사용할 수 있도록 노출할 속성들의 타입을 정의합니다.
type ExposedProps = {
  containerRef: Ref<HTMLDivElement | null>;
  sortable: Ref<Sortable | null>;
  isDragging: Ref<boolean>;
};

// 컴포넌트의 속성을 정의합니다.
const props = defineProps({
  // SortableJS 옵션들; 이벤트는 아래 defineEmits를 통해 처리하고 v-on을 통해 사용
  options: {
    type: Object as PropType<SortableOptionsProp>,
    default: null,
    required: false,
  },
  // 정렬될 아이템 목록
  list: {
    type: [Array, Object] as PropType<any[]>,
    default: [],
    required: true,
  },
  // 리스트 각 아이템의 유니크 키를 식별하는 필드 이름
  itemKey: {
    type: [String, Function] as PropType<string | ((item: any) => string | number | Symbol)>,
    default: "",
    required: true,
  },
  // 렌더링될 태그 종류
  tag: {
    type: String as PropType<string>,
    default: "div",
    required: false,
  },
});

// 컴포넌트 이벤트를 정의합니다.
const emit = defineEmits<{
  (eventName: "choose", evt: Sortable.SortableEvent): void;
  // 다른 이벤트들도 유사하게 정의
}>();

// 속성들을 가져오기 위해 useAttrs를 사용합니다.
const attrs = useAttrs();

// 드래그 상태와 관련된 ref들
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const sortable = ref<Sortable | null>(null);

// 아이템 키를 가져오는 계산된 속성
const getKey = computed(() => {
  if (typeof props.itemKey === "string")
    return (item: any) => item[props.itemKey as string];
  return props.itemKey;
});

// 부모 컴포넌트에서 사용할 수 있도록 속성들을 노출합니다.
defineExpose({
  containerRef,
  sortable,
  isDragging,
} as ExposedProps);

// containerRef가 변경되면 Sortable을 초기화합니다.
watch(containerRef, (newContainer) => {
  if (newContainer) {
    sortable.value = new Sortable(newContainer, {
      ...props.options,
      onChoose: (event) => emit("choose", event),
      // 다른 이벤트 핸들러들도 유사하게 설정
      onStart: (event) => {
        isDragging.value = true;
        emit("start", event);
      },
      onEnd: (event) => {
        setTimeout(() => {
          isDragging.value = false;
          emit("end", event);
        });
      },
    });
  }
});

// Vue의 watch 함수를 사용하여 props.options를 감시합니다.
watch(
    // 감시할 대상은 props.options입니다.
    () => props.options,
    // props.options가 변경될 때 실행될 콜백 함수입니다.
    (options) => {
      // options를 콘솔에 출력합니다.

      // options가 존재하고, sortable 인스턴스가 초기화된 경우에만 실행합니다.
      if (options && sortable.value) {
        // options 객체의 모든 속성을 순회합니다.


        for (const property in options) {
          // sortable 인스턴스의 옵션을 업데이트합니다.
          sortable.value.option(
              property as keyof SortableOptionsProp, // 옵션의 키
              options[property as keyof SortableOptionsProp] // 옵션의 값
          );
        }
      }
    }
);


// 컴포넌트가 언마운트될 때 정리 작업을 수행
onUnmounted(() => {
  if (sortable.value) {
    sortable.value.destroy();
    containerRef.value = null;
    sortable.value = null;
  }
  console.log(onUnmounted)
});
</script>

<template>
  <component ref="containerRef" :is="$props.tag" :class="$props.class">
    <slot
        v-for="(item, index) of list"
        :key="getKey(item)"
        :element="item"
        :index="index"
        name="item"
    ></slot>
  </component>
</template>

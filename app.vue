<template>
  <div>
    <qr-reader @detected="onDetected" />
    <div class="text">{{ lastDetected }}</div>
  </div>
</template>

<script setup lang="ts">
import { type CodeResult } from './components/qr-reader.types';

const route = useRoute();

onMounted(() => {
  watch(() => route.query.f, (newValue) => {
    if (!newValue) {
      lastDetected.value = undefined;
      return;
    }
  }, {
    immediate: true
  });
});

const lastDetected = ref<string | undefined>(undefined);


const onDetected = (result: CodeResult) => {
  lastDetected.value = result.text;
}
</script>

<style>
:root {
  background-color: black;
}
* {
  margin: 0;
  padding: 0;
}

.qr-reader {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.text {
  color: white;
  margin-top: 75vh;
}
</style>

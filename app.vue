<template>
  <div>
    <qr-reader ref="qrReaderRef" @detected="onDetected" />
    <div
      class="content-area"
      :style="{
        '--content-area-margin-top': qrReaderRef?.height
          ? qrReaderRef.height + 'px'
          : '75vh'
      }"
    >
      <span v-if="!detected" class="text--m">Can you find the needle?</span>
      <template v-else>
        <span class="text--m">You found</span>
        <span class="text--l bold">{{
          QrOption.NEEDLE === detected ? 'the needle!!!' : QrOption.HAY
        }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeResult } from './components/qr-reader.types';
import { getQuery } from 'ufo';
import type QrReader from './components/qr-reader.vue';
import { confetti_firework, confetti_hay } from './helpers/confetti';

const route = useRoute();
const qrReaderRef = ref<InstanceType<typeof QrReader> | null>(null);

enum QrOption {
  HAY = 'hay',
  NEEDLE = 'needle'
}
const isQrOption = (string: string): string is QrOption =>
  Object.values(QrOption).includes(string as QrOption);

const detected = ref<QrOption | undefined>(undefined);

onMounted(() => {
  watch(
    () => route.query.q,
    (newValue) => {
      if (!newValue || typeof newValue !== 'string' || !isQrOption(newValue)) {
        detected.value = undefined;
        return;
      }
      detected.value = newValue;
    },
    {
      immediate: true
    }
  );
});

let needleCoolOff = false;
let unsetLastDetected: ReturnType<typeof setTimeout>;
const onDetected = (result: CodeResult) => {
  if (needleCoolOff) return;
  const query = getQuery(result.text);
  if (typeof query.q === 'string' && isQrOption(query.q)) {
    detected.value = query.q;

    clearTimeout(unsetLastDetected);
    unsetLastDetected = setTimeout(() => {
      detected.value = undefined;
    }, 3000);
  }
};

watch(detected, (newValue) => {
  if (newValue === QrOption.NEEDLE) {
    needleCoolOff = true;
    setTimeout(() => {
      needleCoolOff = false;
    }, 3000);
    confetti_firework();
  } else if (newValue === QrOption.HAY) {
    confetti_hay();
  }
});
</script>

<style lang="scss">
$border-radius: 8px;

:root {
  background-color: black;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}
* {
  margin: 0;
  padding: 0;
}

.text--m {
  font-size: 1.5rem;
}
.text--l {
  font-size: 3rem;
}
.bold {
  font-weight: bold;
}

.qr-reader {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}

.content-area {
  $margin-top: calc(var(--content-area-margin-top) - $border-radius);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  background-color: antiquewhite;
  color: rgb(30, 26, 0);
  margin-top: $margin-top;
  min-height: calc(100dvh - $margin-top);
}
</style>

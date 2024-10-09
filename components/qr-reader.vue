<template>
  <div id="reader" ref="qrReaderRef" class="qr-reader" />
</template>

<script setup lang="ts">
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
  type Html5QrcodeFullConfig,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback
} from 'html5-qrcode';
import type { CodeFormat, CodeResult } from './qr-reader.types';

const emits = defineEmits<{
  (e: 'detected', value: CodeResult): void;
}>();

const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
  emits('detected', {
    format: decodedResult.result.format!.formatName as CodeFormat,
    text: decodedText
  });
};

const onScanFailure: QrcodeErrorCallback = (_error) => {};

let html5Qrcode: Html5Qrcode | undefined;

const startScan = async () => {
  const windowHeight = document.documentElement.clientHeight;
  const windowWidth = document.documentElement.clientWidth;

  await html5Qrcode?.start(
    {},
    {
      fps: 10,
      qrbox: 250,
      videoConstraints: {
        width: windowWidth,
        height: Math.max(250, Math.min(500, windowHeight * 0.75)),
        facingMode: 'environment'
      }
    },
    onScanSuccess,
    onScanFailure
  );
};

const handleResize = async () => {
  if (html5Qrcode?.getState() === Html5QrcodeScannerState.SCANNING) {
    await html5Qrcode.stop();
    await startScan();
  }
};

let handlingResizeTimeout: ReturnType<typeof setTimeout> | undefined;
const debounceResize = () => {
  if (!handlingResizeTimeout) {
    handlingResizeTimeout = setTimeout(() => {
      handleResize().finally(() => {
        handlingResizeTimeout = undefined;
      });
    }, 500);
  }
};

let resizeObserver: ResizeObserver;

onMounted(async () => {
  const config: Html5QrcodeFullConfig = {
    verbose: false,
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
  };
  html5Qrcode = new Html5Qrcode('reader', config);
  await startScan();
  window.addEventListener('resize', debounceResize);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  html5Qrcode?.stop();
  window.removeEventListener('resize', debounceResize);
});

const elementHeight = ref<number | undefined>();
const qrReaderRef = ref<HTMLDivElement | null>(null);
onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    elementHeight.value = entries[0].contentRect.height;
  });
  watch(
    qrReaderRef,
    (newValue) => {
      if (newValue) {
        resizeObserver.observe(newValue);
      } else {
        resizeObserver.disconnect();
      }
    },
    { immediate: true }
  );
});

defineExpose({
  height: elementHeight
});
</script>

<style>
[alt='Info icon'] {
  display: none;
}
</style>

<template>
  <div class="qr-reader" ref="readerRef" id="reader" />
</template>

<script setup lang="ts">
import {Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeScanType, Html5QrcodeSupportedFormats, type Html5QrcodeFullConfig, type QrcodeErrorCallback, type QrcodeSuccessCallback} from "html5-qrcode";
import { CodeFormat, type CodeResult } from "./qr-reader.types";

const emits = defineEmits<{
  (e: 'detected', value: CodeResult): void;
}>();

const readerRef = ref<HTMLDivElement | null>(null);

const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
  emits('detected', {
    format: decodedResult.result.format!.formatName as CodeFormat,
    text: decodedText
  })
}

const onScanFailure: QrcodeErrorCallback  = (_error) => {}

let html5Qrcode: Html5Qrcode | undefined;

const getVideoConstraints = () => {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  };
};

const handleResize = async () => {
  if (html5Qrcode?.getState() === Html5QrcodeScannerState.SCANNING) {
    await html5Qrcode.applyVideoConstraints(getVideoConstraints());
    await html5Qrcode.stop();
    await html5Qrcode.start({ facingMode: 'environment' }, { fps: 10 }, onScanSuccess, onScanFailure)
  }
};

let handlingResize = false;
const throttledResize = () => {
  if (!handlingResize) {
    handlingResize = true;
    handleResize().finally(() => {
      handlingResize = false;
    });
  }
}

onMounted(async () => {
  const config: Html5QrcodeFullConfig = {
    verbose: false,
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
  };
  html5Qrcode = new Html5Qrcode(
    "reader",
    config);
  await html5Qrcode.start({ facingMode: 'environment' }, { fps: 10 }, onScanSuccess, onScanFailure)
  html5Qrcode.applyVideoConstraints({...getVideoConstraints(), facingMode: 'environment' });

  window.addEventListener('resize', throttledResize);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', throttledResize);
})
</script>

<style>
[alt="Info icon"] {
  display: none;
}
</style>

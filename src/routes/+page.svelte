<script lang="ts">
  import cv from '$lib/opencv';
  Module = {
    onRuntimeInitialized() {
      // this is our application:
      console.log(cv.getBuildInformation());
    },
  };
  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;

  function initVideoProcessing() {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
  }
  async function initCameraStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      },
    });
    video.srcObject = stream;
    video.play();
  }
  initCameraStream();
</script>

<div class="flex h-screen items-center justify-center">
  <video bind:this={video}>
    <track kind="captions" />
  </video>
  <canvas bind:this={canvas}></canvas>
</div>

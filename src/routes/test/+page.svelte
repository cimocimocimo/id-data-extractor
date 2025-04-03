<script lang="ts">
  import type { Action } from 'svelte/action';
  import type { PageProps } from './$types';
  import { initVideoProcessing } from '$lib/object-detection';

  let { data }: PageProps = $props();
  let videoNode: HTMLVideoElement;
  let canvasNode: HTMLCanvasElement;
  const videoUrl = 'PXL_20250328_035706984.TS.mp4';
  let nativeWidth: number = $state(0);
  let nativeHeight: number = $state(0);

  let intervalId: number;
  function handleMetadataLoaded() {
    if (videoNode) {
      nativeWidth = videoNode.videoWidth;
      nativeHeight = videoNode.videoHeight;
      console.log(`Native resolution: ${nativeWidth}x${nativeHeight}`);
      videoNode.play();
      // You can now use nativeWidth and nativeHeight
      intervalId = initVideoProcessing(videoNode, canvasNode);
    }
  }
  const parentAction: Action = () => {
    console.log('parent node mounted');
    // videoNode.srcObject = data.camera.stream;
  };
  function handleVideoEnded() {
    console.log('Video has ended!');
    // Add your logic here, e.g., replay the video, show a message, etc.
    clearInterval(intervalId);
  }
</script>

<div use:parentAction>
  <div>
    <video
      bind:this={videoNode}
      src={videoUrl}
      width="960"
      height="512"
      aria-label="video"
      onloadedmetadata={handleMetadataLoaded}
      onended={handleVideoEnded}
    >
      <track kind="captions" />
    </video>
  </div>
  <div>
    <canvas bind:this={canvasNode} class="w-full" aria-label="canvas"></canvas>
  </div>
</div>

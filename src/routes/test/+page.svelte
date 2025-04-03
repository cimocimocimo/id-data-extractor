<script lang="ts">
  import type { Action } from 'svelte/action';
  import type { PageProps } from './$types';
  import { initVideoProcessing } from '$lib/camera';

  let { data }: PageProps = $props();
  let videoNode: HTMLVideoElement;
  let canvasNode: HTMLCanvasElement;
  const videoUrl = 'PXL_20250328_035706984.TS.mp4';
  let nativeWidth: number = $state(0);
  let nativeHeight: number = $state(0);

  function handleMetadataLoaded() {
    if (videoNode) {
      nativeWidth = videoNode.videoWidth;
      nativeHeight = videoNode.videoHeight;
      console.log(`Native resolution: ${nativeWidth}x${nativeHeight}`);
      videoNode.play();
      // You can now use nativeWidth and nativeHeight
      initVideoProcessing(videoNode, canvasNode);
    }
  }
  const parentAction: Action = () => {
    console.log('parent node mounted');
    // videoNode.srcObject = data.camera.stream;
  };
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
    >
      <track kind="captions" />
    </video>
  </div>
  <div>
    <canvas bind:this={canvasNode} class="w-full" aria-label="canvas"></canvas>
  </div>
</div>

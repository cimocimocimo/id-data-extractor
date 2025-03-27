<script lang="ts">
  import type { Action } from 'svelte/action';
  import type { PageProps } from './$types';
  import { initVideoProcessing } from '$lib/camera';

  let { data }: PageProps = $props();
  let videoNode: HTMLVideoElement;
  let canvasNode: HTMLCanvasElement;

  const parentAction: Action = () => {
    console.log('parent node mounted');
    videoNode.srcObject = data.camera.stream;
    videoNode.play();

    initVideoProcessing(videoNode, canvasNode);
  };
  console.log(data.camera.settings);
</script>

<div use:parentAction>
  <div>
    <video
      bind:this={videoNode}
      id="video-raw"
      height={data.camera.settings.height}
      width={data.camera.settings.width}
    >
      <track kind="captions" />
    </video>
  </div>
  <div>
    <canvas bind:this={canvasNode} id="video-processed" style="width: 100%; height: auto;"></canvas>
  </div>
</div>

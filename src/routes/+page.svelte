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
</script>

{#if data.camera}
  <div use:parentAction>
    <div>
      <video
        bind:this={videoNode}
        height={data.camera.settings.height}
        width={data.camera.settings.width}
        class="hidden"
      >
        <track kind="captions" />
      </video>
    </div>
    <div>
      <canvas bind:this={canvasNode} class="w-full"></canvas>
    </div>
  </div>
{:else}
  <div><span>Camera not found</span></div>
{/if}

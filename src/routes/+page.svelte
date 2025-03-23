<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { fn } from '@storybook/test';

  let isProcessingVideo = $state(false);
  let paused = $state(true);
  let videoSource = null;
  let loadingVideo = $state(false);

  async function getCameraStream() {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      },
    });
  }

  const toggleVideoStream = async () => {
    try {
      loadingVideo = true;
      videoSource.srcObject = await getCameraStream();
      videoSource.play();
      loadingVideo = false;
    } catch (error) {
      console.log(error);
    }
  };
</script>

<div class="flex h-screen items-center justify-center">
  <div>
    <Button class="" onclick={toggleVideoStream}
      >{isProcessingVideo ? 'Stop' : 'Start'} Video</Button
    >
  </div>
  {#if loadingVideo}
    <h1>LOADING</h1>
  {/if}
  <video bind:this={videoSource} bind:paused>
    <track kind="captions" />
  </video>
  <canvas id="canvasOutput"></canvas>
</div>

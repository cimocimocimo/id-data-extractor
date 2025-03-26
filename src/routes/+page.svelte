<script lang="ts">
  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
</script>

<div>
  <div>
    <video bind:this={video} id="video-raw">
      <track kind="captions" />
    </video>
  </div>
  <div>
    <canvas bind:this={canvas} id="video-processed"></canvas>
  </div>
</div>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { fn } from '@storybook/test';

	let isProcessingVideo = $state(false);
	let paused = $state(true);
	let videoSource = null;
	let loadingVideo = false;

	const toggleVideoStream = async () => {
		try {
			loadingVideo = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 4096 },
					height: { ideal: 2160 }
				}
			});
			videoSource.srcObject = stream;
			videoSource.play();
			loadingVideo = false;
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="">
	<Button class="" onclick={toggleVideoStream}>{isProcessingVideo ? 'Stop' : 'Start'} Video</Button>
	{#if loadingVideo}
		<h1>LOADING</h1>
	{/if}
	<video bind:this={videoSource} bind:paused>
		<track kind="captions" />
	</video>
	<canvas id="canvasOutput"></canvas>
</div>

import type { PageLoad } from './$types';
import { loadOpenCv, initVideoElement, getCameraStream, initVideoProcessing } from '$lib/camera';

export const ssr = false;

export const load: PageLoad = async () => {
  await loadOpenCv();

  // This code isn't working, look into using actions to run it after the two elements have been created.
  const video = document.getElementById('video-raw') as HTMLVideoElement;
  const canvas = document.getElementById('video-processed') as HTMLCanvasElement;
  await initVideoElement(getCameraStream(), video);
  initVideoProcessing(video, canvas);
  return {};
};

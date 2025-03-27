import type { PageLoad } from './$types';
import {
  loadOpenCv,
  initVideoElement,
  getCameraStream,
  initVideoProcessing,
  getCameraSettings,
} from '$lib/camera';

export const ssr = false;

export const load: PageLoad = async () => {
  await loadOpenCv();
  const stream = await getCameraStream();
  const settings = getCameraSettings(stream);

  // // This code isn't working, look into using actions to run it after the two elements have been created.
  // const video = document.getElementById('video-raw') as HTMLVideoElement;
  // const canvas = document.getElementById('video-processed') as HTMLCanvasElement;
  // await initVideoElement(getCameraStream(), video);
  // initVideoProcessing(video, canvas);
  return {
    camera: {
      stream: stream,
      settings: settings,
    },
  };
};

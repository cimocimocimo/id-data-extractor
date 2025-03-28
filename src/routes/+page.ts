import type { PageLoad } from './$types';
import { loadOpenCv, getCameraStream, getCameraSettings } from '$lib/camera';

export const ssr = false;

export const load: PageLoad = async () => {
  await loadOpenCv();

  try {
    const stream = await getCameraStream();
    const settings = getCameraSettings(stream);
    return {
      camera: {
        stream: stream,
        settings: settings,
      },
    };
  } catch (err) {
    // Do something
    console.log(err);
  }
};

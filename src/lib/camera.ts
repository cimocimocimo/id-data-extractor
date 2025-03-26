const OPENCV_URL = 'opencv.js';

export async function loadOpenCv() {
  let script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('type', 'text/javascript');
  script.addEventListener('load', async () => {
    // WASM
    if (cv instanceof Promise) {
      cv = await cv;
    } else {
      console.log('Error loading OpenCV.');
    }
  });
  script.src = OPENCV_URL;
  let node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(script, node);
}

export async function getCameraStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: {
      width: { exact: 1024 },
      height: { exact: 540 },
    },
  });
}

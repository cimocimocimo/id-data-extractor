declare var cv: {};

const OPENCV_URL = 'opencv.js';

export async function loadOpenCv() {
  let script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('type', 'text/javascript');
  script.addEventListener('load', async () => (cv = cv instanceof Promise ? await cv : cv));
  script.src = OPENCV_URL;
  document.head.appendChild(script);
}

export async function getCameraV2() {
  return ((stream) => {
    return {
      stream: stream,
      settings: stream.getVideoTracks()[0].getSettings(),
    };
  })(
    await navigator.mediaDevices.getUserMedia({
      video: {
        width: { exact: 1024 },
        height: { exact: 540 },
      },
    }),
  );
}

export async function getCameraStream(): Promise<MediaStream> {
  return await navigator.mediaDevices.getUserMedia({
    video: {
      width: { exact: 1024 },
      height: { exact: 540 },
      // width: { ideal: 4096 },
      // height: { ideal: 2160 },
    },
  });
}

export function getCameraSettings(stream: MediaStream): MediaTrackSettings {
  return stream.getVideoTracks()[0].getSettings();
}

export async function initVideoElement(
  stream: Promise<MediaStream>,
  element: HTMLVideoElement,
): Promise<boolean> {
  element.srcObject = await stream;
  element.play();
  return true;
}

function detectObjects(frame) {
  const minArea = 1;
  const maxArea = 9999;
  const minAspectRatio = 0;
  const maxAspectRatio = 0;

  let gray = new cv.Mat();
  let blurred = new cv.Mat();
  let edges = new cv.Mat();
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  // 1. Preprocessing
  cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0); // Adjust size
  cv.Canny(blurred, edges, 30, 90); // Adjust thresholds

  // 2. Contour Detection
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // 3. Shape Identification and Filtering
  for (let i = 0; i < contours.size(); ++i) {
    let contour = contours.get(i);
    let peri = cv.arcLength(contour, true);
    let approx = new cv.Mat();
    cv.approxPolyDP(contour, approx, 0.04 * peri, true); // Adjust epsilon

    if (approx.rows === 4) {
      // Quadrilateral
      let area = cv.contourArea(contour);
      if (area > minArea && area < maxArea) {
        // Area threshold
        // Calculate aspect ratio (example)
        let rect = cv.boundingRect(contour);
        let aspectRatio = rect.width / rect.height;
        if (aspectRatio > minAspectRatio && aspectRatio < maxAspectRatio) {
          // ... Perspective Transform
          //
          // make checks to ensure we have an ID here.
          //
          // take photo of id for extracting data.
        }
      }
    }
    approx.delete();
    contour.delete();
  }

  gray.delete();
  blurred.delete();
  contours.delete();
  hierarchy.delete();

  return edges;
}

export function initVideoProcessing(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  console.log({
    h: video.height,
    w: video.width,
  });
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);
  const FPS = 30;
  function processVideo() {
    try {
      let begin = Date.now();

      // start processing.
      cap.read(src);
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      cv.imshow(canvas, detectObjects(src));

      // schedule the next one.
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    } catch (err) {
      console.log(err);
      // clean and stop.
      src.delete();
      dst.delete();
      return;
    }
  }

  // schedule the first one.
  setTimeout(processVideo, 0);
}

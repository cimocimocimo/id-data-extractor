const OPENCV_URL = 'opencv.js';
const FPS = 30;

export async function loadOpenCv() {
  let script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('type', 'text/javascript');
  script.addEventListener('load', async () => (cv = cv instanceof Promise ? await cv : cv));
  script.src = OPENCV_URL;
  document.head.appendChild(script);
}

function detectObjects(frame, canvas) {
  const minArea = 5000;
  const maxArea = 500000;
  const minAspectRatio = 1.2;
  const maxAspectRatio = 1.8;

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
        console.log('area is about right');
        console.log(area);
        // Area threshold
        // Calculate aspect ratio (example)
        let rect = cv.boundingRect(contour);
        let aspectRatio = rect.width / rect.height;
        console.log('aspectRatio: ' + aspectRatio);
        if (aspectRatio > minAspectRatio && aspectRatio < maxAspectRatio) {
          console.log('aspect ratio is correct');
          console.log(rect);
          // Draw the rectangle
          let point1 = new cv.Point(rect.x, rect.y);
          let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(frame, point1, point2, new cv.Scalar(0, 255, 0), 2);

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

  cv.imshow(canvas, frame);

  gray.delete();
  blurred.delete();
  contours.delete();
  hierarchy.delete();
  edges.delete();
}

export function initVideoProcessing(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);

  function processVideo() {
    try {
      let begin = Date.now();

      // start processing.
      cap.read(src);
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

      detectObjects(src, canvas);

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

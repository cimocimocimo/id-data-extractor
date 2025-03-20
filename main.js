var imgElement = document.getElementById("imageSrc");
var inputElement = document.getElementById("fileInput");
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false
);

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
  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

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
        console.log(aspectRatio);
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

function onOpenCvReady() {
  // eslint-disable-line no-unused-vars
  document.getElementById("status").innerHTML =
    "<b>OpenCV.js is ready</b>." +
    "You can upload an image.<br>" +
    "The <b>imageSrc</b> is a &lt;img&gt; element used as cv.Mat input. " +
    "The <b>canvasOutput</b> is a &lt;canvas&gt; element used as cv.Mat output.";

  cv.then((cv) => {
    imgElement.onload = function () {
      cv.imshow("canvasOutput", detectObjects(cv.imread(imgElement)));
    };
  });
}

function onOpenCvError() {
  // eslint-disable-line no-unused-vars
  var element = document.getElementById("status");
  element.setAttribute("class", "err");
  element.innerHTML = "Failed to load opencv.js";
}

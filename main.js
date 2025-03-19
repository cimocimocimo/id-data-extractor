var imgElement = document.getElementById("imageSrc");
var inputElement = document.getElementById("fileInput");
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false,
);

function onOpenCvReady() {
  // eslint-disable-line no-unused-vars
  document.getElementById("status").innerHTML =
    "<b>OpenCV.js is ready</b>." +
    "You can upload an image.<br>" +
    "The <b>imageSrc</b> is a &lt;img&gt; element used as cv.Mat input. " +
    "The <b>canvasOutput</b> is a &lt;canvas&gt; element used as cv.Mat output.";

  cv.then((cv) => {
    imgElement.onload = function () {
      var src = cv.imread(imgElement);
      var dst = new cv.Mat();
      cv.threshold(src, dst, 177, 200, cv.THRESH_BINARY);
      cv.imshow("canvasOutput", dst);
      src.delete();
      dst.delete();
    };
  });
}

function onOpenCvError() {
  // eslint-disable-line no-unused-vars
  var element = document.getElementById("status");
  element.setAttribute("class", "err");
  element.innerHTML = "Failed to load opencv.js";
}

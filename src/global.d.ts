declare namespace Module {}
declare namespace cv {
  class Mat {
    constructor(height: number, width: number, type: number);
    rows: number;
    cols: number;
    delete(): void;
  }
  class MatVector {
    get(index: number): any;
    size(): number;
    delete(): void;
  }
  class Size {
    constructor(width: number, height: number);
  }
  class Point {
    constructor(x: number, y: number);
  }
  class Scalar {
    constructor(v0: number, v1: number, v2: number, v3: number);
  }
  class Rect {
    constructor(x: number, y: number, width: number, height: number);
    x: number;
    y: number;
    width: number;
    height: number;
  }
  class VideoCapture {
    constructor(video: HTMLVideoElement);
    read(mat: Mat): void;
  }

  function cvtColor(src: Mat, dst: Mat, code: number): void;
  function GaussianBlur(src: Mat, dst: Mat, size: Size, sigmaX: number): void;
  function Canny(src: Mat, dst: Mat, threshold1: number, threshold2: number): void;
  function findContours(
    image: Mat,
    contours: MatVector,
    hierarchy: Mat,
    mode: number,
    method: number,
  ): void;
  function arcLength(curve: Mat, closed: boolean): number;
  function approxPolyDP(curve: Mat, approxCurve: Mat, epsilon: number, closed: boolean): void;
  function contourArea(contour: Mat): number;
  function boundingRect(contour: Mat): Rect;
  function rectangle(img: Mat, pt1: Point, pt2: Point, color: Scalar, thickness: number): void;
  function imshow(canvas: HTMLCanvasElement, mat: Mat): void;

  const COLOR_RGBA2GRAY: number;
  const RETR_EXTERNAL: number;
  const CHAIN_APPROX_SIMPLE: number;
  const CV_8UC4: number;
  const CV_8UC1: number;
}

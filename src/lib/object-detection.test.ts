import { describe, test, expect, beforeAll } from 'vitest';
import { default as cvPromise } from '../../static/opencv.js';

import { Canvas, createCanvas, Image, ImageData, loadImage } from 'canvas';
import { JSDOM } from 'jsdom';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const cv = await cvPromise;
// Define a global variable 'Module' with a method 'onRuntimeInitialized':

console.log(cv.getBuildInformation());

// Using jsdom and node-canvas we define some global variables to emulate HTML DOM.
// Although a complete emulation can be archived, here we only define those globals used
// by cv.imread() and cv.imshow().
function installDOM() {
  const dom = new JSDOM();
  global.document = dom.window.document;

  // The rest enables DOM image and canvas and is provided by node-canvas
  global.Image = Image;
  global.HTMLCanvasElement = Canvas;
  global.ImageData = ImageData;
  global.HTMLImageElement = Image;
}

// Load 'opencv.js' assigning the value to the global variable 'cv'
describe('/object-detection.ts', async () => {
  installDOM();

  let image: Image;

  beforeAll(async () => {
    image = await loadImage(resolve(__dirname, './test-image.jpeg'));
  });

  // using node-canvas, we an image file to an object compatible with HTML DOM Image and therefore with cv.imread()
  test('image processing', () => {
    const src = cv.imread(image);
    const dst = new cv.Mat();
    const M = cv.Mat.ones(5, 5, cv.CV_8U);
    const anchor = new cv.Point(-1, -1);
    cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    // we create an object compatible HTMLCanvasElement
    const canvas = createCanvas(300, 300);
    cv.imshow(canvas, dst);
    writeFileSync('output.jpg', canvas.toBuffer('image/jpeg'));
    src.delete();
    dst.delete();
    expect(true).toBe(true);
  });

  test('nothing', () => {
    new cv.Mat();
    expect(true).toBe(true);
  });
});

// // Load 'opencv.js' assigning the value to the global variable 'cv'
// describe('/object-detection.ts', async () => {
//   installDOM();

//   // using node-canvas, we an image file to an object compatible with HTML DOM Image and therefore with cv.imread()
//   const image = await loadImage('./test-image.jpeg');

//   const src = cv.imread(image);
//   const dst = new cv.Mat();
//   const M = cv.Mat.ones(5, 5, cv.CV_8U);
//   const anchor = new cv.Point(-1, -1);
//   cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

//   // we create an object compatible HTMLCanvasElement
//   const canvas = createCanvas(300, 300);
//   cv.imshow(canvas, dst);
//   writeFileSync('output.jpg', canvas.toBuffer('image/jpeg'));
//   src.delete();
//   dst.delete();

//   test('nothing', () => {
//     new cv.Mat();
//     expect(true);
//   });
// });

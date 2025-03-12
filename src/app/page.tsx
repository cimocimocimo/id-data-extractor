"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import cv from "opencv.js";

declare global {
  interface Window {
    cv: any; // OpenCV.js
  }
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null); // Add error state
  const [opencvReady, setOpencvReady] = useState(false);

  useEffect(() => {
    const loadOpenCV = async () => {
      try {
        if (typeof window.cv === "undefined") {
          const script = document.createElement("script");
          script.src = "/opencv/opencv.js"; // Ensure correct path to your opencv.js file (place in public folder or appropriate assets directory)
          script.onload = () => {
            console.log("OpenCV.js loaded");
            setOpencvReady(true);
          };
          script.onerror = () => {
            console.error("Failed to load OpenCV.js");
            setError(
              "Failed to load OpenCV.js.  Ensure opencv.js is in /public/opencv folder."
            );
          };
          document.head.appendChild(script);
        } else {
          setOpencvReady(true);
          console.log("OpenCV already loaded");
        }
      } catch (e) {
        console.error("Error loading OpenCV", e);
        setError("Error loading OpenCV: " + e.message);
      }
    };

    loadOpenCV();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (opencvReady && isStreaming && videoRef.current && canvasRef.current) {
      const detectObjects = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Canvas context not available");
          return;
        }

        const cv = window.cv;

        if (!cv) {
          console.error("OpenCV not loaded");
          return;
        }

        const cap = new cv.VideoCapture(video);
        const frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);

        cap.read(frame);

        // Convert to grayscale
        let gray = new cv.Mat();
        cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);

        // Load pre-trained classifier (Haar Cascade) - Ensure this file exists in the correct directory!
        const faceCascade = new cv.CascadeClassifier();
        faceCascade.load("/opencv/haarcascade_frontalface_default.xml"); // Load from public directory or appropriate assets directory.  Important!

        // Detect faces
        const faces = new cv.RectVector();
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0); // Adjust parameters as needed

        // Draw rectangles around detected faces
        for (let i = 0; i < faces.size(); ++i) {
          const face = faces.get(i);
          const point1 = new cv.Point(face.x, face.y);
          const point2 = new cv.Point(
            face.x + face.width,
            face.y + face.height
          );
          cv.rectangle(frame, point1, point2, [255, 0, 0, 255], 2); // Draw a blue rectangle

          // Label the detected object
          ctx.font = "16px Arial";
          ctx.fillStyle = "red";
          ctx.fillText("Face", face.x, face.y - 10);
        }

        // Display the processed frame on the canvas
        cv.imshow(canvas, frame);

        // Clean up Mats
        frame.delete();
        gray.delete();
        faces.delete();

        // Request next frame
        requestAnimationFrame(detectObjects);
      };

      detectObjects();
    }

    return () => {
      // Cleanup function (if needed) - for example, releasing resources
    };
  }, [isStreaming, opencvReady]);

  const handleClick = async () => {
    if (!isStreaming) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          setStream(newStream);
        }
        setIsStreaming(true);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(err.message || "Failed to access camera"); // Set error message
        setIsStreaming(false);
      }
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
      setStream(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button onClick={handleClick}>
        {isStreaming ? "Stop Video" : "Start Video"}
      </Button>
      <div className="mt-4">
        <video ref={videoRef} autoPlay muted className="w-64 h-48" />
        <canvas ref={canvasRef} width="640" height="480" />{" "}
        {/* Ensure canvas dimensions match video dimensions */}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleClick = async () => {
    if (!isStreaming) {
      try {
        console.log("hey");
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log("hey");
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          setStream(newStream);
        }
        console.log("hey");
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
      </div>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error message */}
    </main>
  );
}

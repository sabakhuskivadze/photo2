"use client";
import { useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);

  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const photo1Ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d'); // Use optional chaining
    const photo = photoRef.current;

    const canvas1 = canvas1Ref.current;
    const context1 = canvas1?.getContext('2d'); // Use optional chaining
    const photo1 = photo1Ref.current;

    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (video) {
          video.srcObject = stream;
          video.addEventListener('loadeddata', () => {
            // Capture the first image instantly
            setTimeout(() => {
              if (context) { // Check if context is available
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL('image/png');
                if (photo) {
                  photo.src = imageDataUrl;
                }

                // Convert image to Blob and send via Axios
                canvas.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], "photo.png", { type: "image/png" });
                    sendPhotoToServer(file); // Send first file to server
                  }
                });
              }
            }, 0); // Capture immediately

            // Capture the second image after 1 second
            setTimeout(() => {
              if (context1) { // Check if context1 is available
                context1.drawImage(video, 0, 0, canvas1.width, canvas1.height);
                const imageDataUrl1 = canvas1.toDataURL('image/png');
                if (photo1) {
                  photo1.src = imageDataUrl1;
                }

                // Convert second image to Blob and send via Axios
                canvas1.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], "photo1.png", { type: "image/png" });
                    sendPhotoToServer(file); // Send second file to server
                  }
                });
              }
            }, 1000); // 1-second delay
          });
        }
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });

  }, []);

  const sendPhotoToServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Update the URL to your AWS endpoint
      const response = await axios.post('http://localhost:3001/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ4dXNraUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjkzNzAzMzQsImV4cCI6MTcyOTk3NTEzNH0.418SS6wMgHndP49WbQlumdXQEqy5PlfpvOoq_4JK7js`
        },
      });

      console.log('Photo uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading the photo:', error);
    }
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
      <img ref={photoRef} alt="Captured Photo" width="640" height="480" />

      <canvas ref={canvas1Ref} width="640" height="480" style={{ display: 'none' }}></canvas>
      <img ref={photo1Ref} alt="Captured Photo" width="640" height="480" />
    </div>
  );
}

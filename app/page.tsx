"use client";
import { useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);

  const canvas1Ref = useRef(null);
  const photo1Ref = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const photo = photoRef.current;

    const canvas1 = canvas1Ref.current;
    const context1 = canvas1.getContext('2d');
    const photo1 = photo1Ref.current;

    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener('loadeddata', () => {
          // Capture the first image instantly
          setTimeout(() => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/png');
            photo.src = imageDataUrl;

            // Convert image to Blob and send via Axios
            canvas.toBlob((blob) => {
              const file = new File([blob], "photo.png", { type: "image/png" });
              sendPhotoToServer(file); // Send first file to server
            });
          }, 0); // Capture immediately

          // Capture the second image after 1 second
          setTimeout(() => {
            context1.drawImage(video, 0, 0, canvas1.width, canvas1.height);
            const imageDataUrl1 = canvas1.toDataURL('image/png');
            photo1.src = imageDataUrl1;

            // Convert second image to Blob and send via Axios
            canvas1.toBlob((blob) => {
              const file = new File([blob], "photo1.png", { type: "image/png" });
              sendPhotoToServer(file); // Send second file to server
            });
          }, 1000); // 1-second delay
        });
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });

  }, []);

  const sendPhotoToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Update the URL to your local server endpoint
      const response = await axios.post('http://localhost:3003/photo/uploud', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

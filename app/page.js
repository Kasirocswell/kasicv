// pages/page.js
"use client";
import Head from "next/head";
import ThreeDTour from "../components/ThreeDTour";

export default function MainPage() {
  return (
    <div className="h-screen bg-gray-900 text-white relative">
      <Head>
        <title>3D Portfolio Tour</title>
        <meta
          name="description"
          content="A 3D tour of my portfolio using Next.js, Tailwind, and Three.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-3/4 lg:w-3/4 xl:w-2/3">
        <ThreeDTour />
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-gray-800 p-4 rounded-md text-sm shadow-md opacity-60">
        <strong>Kasi Reeves Portfolio</strong>
        <br />
        Click & Drag - Move Camera
        <br />Z - Zoom
      </div>

      {/* <footer className="p-4 mt-4 text-center bg-gray-800 shadow-md">
        <p>Designed with ❤️ by Kasi Reeves</p>
      </footer> */}
    </div>
  );
}

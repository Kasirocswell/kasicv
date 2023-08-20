"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ThreeDTour from "../components/ThreeDTour";
import { Howl } from "howler";

let callSequence = 0;

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [part, setPart] = useState("");
  const wordRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");

  const phoneRing = new Howl({
    src: ["/cell.mp3"],
  });

  const words = [
    "Summoning pixels...",
    "Reticulating splines...",
    "Wait, wrong app!",
    "Loading the awesomeness. Hang tight!",
    "Did you know? Coffee breaks speed up loading times. Just saying...",
    "Warming up the hamsters...",
  ];

  let i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 15,
    speed = 70;

  const sequences = [
    {
      image: "/morph.png",
      message: `This is the recruiter here, I've got something for you, a new recruit, skilled, dedicated, and creative.  He's proven, but still fresh to the work force, check out his experience...sending it over...`,
      modalContent: "    Work Experience: ...",
    },
    {
      image: "/morph.png",
      message: `Recruiter here again, what did you think about his work experience, not bad huh?  I think you'll be impressed by his skill set, I've sent the doc over to your HUD.`,
      modalContent: "Relevant Skills: ...",
    },
    {
      image: "/morph.png",
      message: `Hiring manager, this will be our last conversation, I found an encrypted file containing Kasi's projects, you HAVE to see these, they should be in your HUD any minute`,
      modalContent: "Projects: ...",
    },
  ];

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsLoading(false);
      phoneRing.play();
    }, 15000);

    const handleKeyPress = (event) => {
      if (event.key === "c") {
        phoneRing.stop();
        setShowDialog(true);
        typeMessage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const typeMessage = () => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < sequences[callSequence].message.length) {
        setTypewriterText(sequences[callSequence].message);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70);
  };

  const closeDialog = () => {
    callSequence += 1;
    setTypewriterText("");
    setShowDialog(false);
    setShowModal(true);
    if (callSequence < 2) {
      setTimeout(() => {
        phoneRing.play();
      }, 10000);
    }
  };

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    // Loading screen word effect
    const wordflick = setInterval(() => {
      if (forwards) {
        if (offset >= words[i].length) {
          ++skip_count;
          if (skip_count === skip_delay) {
            forwards = false;
            skip_count = 0;
          }
        }
      } else {
        if (offset === 0) {
          forwards = true;
          i++;
          offset = 0;
          if (i >= len) {
            i = 0;
          }
        }
      }
      setPart(words[i].substr(0, offset));
      if (skip_count === 0) {
        if (forwards) {
          offset++;
        } else {
          offset--;
        }
      }
    }, speed);

    return () => {
      clearTimeout(timer);
      clearInterval(wordflick);
    };
  }, []);

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <Head>
        <title>3D Portfolio Tour</title>
        <meta
          name="description"
          content="A 3D tour of my portfolio using Next.js, Tailwind, and Three.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? (
        <div className="ring">
          Loading
          {/* <span></span> */}
          <div className="word flex flex-row">{part}</div>
        </div>
      ) : (
        <>
          <div className="w-screen h-3/4 lg:w-3/4 xl:w-2/3">
            <ThreeDTour />
          </div>
          {showDialog && (
            <div className="absolute top-[400px] left-[50px] overflow-clip w-[600px] h-[275px] bg-green-600 opacity-40 p-4 rounded-md text-white border">
              <Image
                src={sequences[callSequence].image}
                width={100}
                height={100}
                alt="Caller profile picture"
              />
              <p className="font-bold">Recruiter</p>
              <p className="mt-2">{typewriterText}</p>
              <button className="pt-[25px]" onClick={closeDialog}>
                Close
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal w-[600px] h-[400px]">
              <div className="pl-2">{sequences[callSequence].modalContent}</div>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          )}
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-gray-800 p-4 rounded-md text-sm shadow-md opacity-60">
            <strong>Kasi Reeves Portfolio</strong>
            <br />
            Click & Drag - Move Camera
            <br />Z - Zoom
            <br />C - Answer Cell
          </div>
        </>
      )}
    </div>
  );
}

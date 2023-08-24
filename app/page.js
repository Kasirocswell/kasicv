"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ThreeDTour from "../components/ThreeDTour";
import { Howl } from "howler";
import twitter from "../public/x.png";
import linked from "../public/linkedin.jpg";
import tiktok from "../public/tiktok.png";
import github from "../public/github.png";
import cd from "../public/CD.jpg";
import eth from "../public/eth.jpg";
import soke from "../public/soke.png";

let callSequence = 0;
let showModal = false;
let showEndModal = false;
let document;

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [part, setPart] = useState("");
  const wordRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [isMobile, setIsMobile] = useState(false); // Added state for mobile detection

  const phoneRing = new Howl({
    src: ["/cell.mp3"],
  });

  function findDoc() {
    if (callSequence == 0) {
      document = "/work-1.png";
    } else if (callSequence == 1) {
      document = "/work2-1.png";
    } else if ((callSequence = 2)) {
      document = "/work3-1.png";
    } else {
    }
  }

  const soundRef = useRef(null);

  const playRing = () => {
    findDoc();
    if (soundRef.current) {
      soundRef.current.stop();
    }
    soundRef.current = phoneRing;
    soundRef.current.play();
  };

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
      message: `Greetings, Hiring Manager. Ever heard of 'The One' in the developer realm? I've discovered a talent, both seasoned and innovative. Dive into his work experience, it's quite the matrix...`,
      modalContent: "Work Experience: ...",
    },
    {
      image: "/morph.png",
      message: `Impressed by the experience? Just wait till you see the arsenal of skills he's mastered. Transmitting data to your HUD now...`,
      modalContent: "Relevant Skills: ...",
    },
    {
      image: "/morph.png",
      message: `Before we unplug, there's one last gem. I've decrypted a cache of Kasi's projects. Prepare to be amazed. Uploading to your HUD...`,
      modalContent: "Projects: ...",
    },
  ];

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }

    const initialTimer = setTimeout(() => {
      setIsLoading(false);
      playRing();
    }, 7000);

    const handleKeyPress = (event) => {
      if (event.key === "c" && callSequence < 3) {
        if (soundRef.current) {
          soundRef.current.stop();
        }
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
      if (callSequence <= 2) {
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
    showModal = true;
    console.log(showModal);
  };

  const closeModal = () => {
    showModal = false;
    if (callSequence < 3 && showModal == false) {
      setTimeout(() => {
        playRing();
      }, 3000);
    } else {
      showEndModal = true;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

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
      {isMobile ? (
        <div className="flex items-center justify-center h-full">
          <p>Please use your laptop to enjoy the full experience</p>
        </div>
      ) : (
        <>
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
              <div className="word flex flex-row">{part}</div>
            </div>
          ) : (
            <>
              <div className="w-screen h-3/4 lg:w-3/4 xl:w-2/3">
                <ThreeDTour />
              </div>
              {showDialog && (
                <div className="absolute top-[400px] left-[50px] overflow-clip w-[600px] h-[275px] bg-green-600 p-4 rounded-md text-white border">
                  <Image
                    src={"/morph.png"}
                    width={100}
                    height={100}
                    alt="Caller profile picture"
                  />
                  <p className="font-bold mt-[2px]">Recruiter</p>
                  <p className="mt-2">{typewriterText}</p>
                  <button className="pt-[25px]" onClick={closeDialog}>
                    Close
                  </button>
                </div>
              )}

              {showModal && (
                <div className="absolute top-[25px] left-[625px] modal w-[600px] h-[800px] text-black bg-white z-20">
                  <div className="pl-2">
                    <Image
                      src={document}
                      width={580}
                      height={780}
                      alt="Resume Document"
                    />
                  </div>
                  <button className="ml-[25px]" onClick={closeModal}>
                    Close
                  </button>
                </div>
              )}

              {showEndModal && (
                <div className=" overflow-auto flex flex-col absolute top-[25px] left-[625px] modal w-[600px] h-[800px] text-black bg-white z-20">
                  <div className="pt-4 mx-auto text-6xl">Contacts</div>
                  <div className="flex-col pl-2 pt-4 mx-auto text-2xl">
                    <Link href={"mailto:kasirocswell@rocketmail.com"}>
                      KasiRocsWell@Rocketmail.com
                    </Link>
                    <div className="mt-2 text-center">(510)866-9438</div>
                  </div>
                  <div className="pt-4 pb-4 mx-auto text-6xl">Projects</div>
                  <div className="container flex flex-row">
                    <div className="Card1 flex-col ml-[50px]">
                      <div className="image">
                        <Link
                          href="https://github.com/Kasirocswell/CDMUD"
                          target="_blank"
                        >
                          <Image
                            src={cd}
                            width={150}
                            height={150}
                            alt="Twitter Logo"
                          />
                        </Link>
                      </div>
                      <p className="ml-[30px]">Celestial Deep</p>
                    </div>
                    <div className="Card2 flex-col ml-[25px]">
                      <div className="image">
                        <Link
                          href="https://github.com/Kasirocswell/soke2x"
                          target="_blank"
                        >
                          <Image
                            src={soke}
                            width={150}
                            height={150}
                            alt="Twitter Logo"
                          />
                        </Link>
                      </div>
                      <p className="ml-[38px]">Soke's Swig</p>
                    </div>
                    <div className="Card3 flex-col ml-[30px]">
                      <div className="image">
                        <Link
                          href="https://github.com/Kasirocswell/eth-global-2022"
                          target="_blank"
                        >
                          <Image
                            src={eth}
                            width={150}
                            height={150}
                            alt="Twitter Logo"
                          />
                        </Link>
                      </div>
                      <p className="ml-[29px]">ETH Global 2022</p>
                    </div>
                  </div>
                  <div className=" flex-row pl-2 pt-4"></div>
                  <div className="pt-4 mx-auto text-6xl">Socials</div>
                  <div className=" flex-row pl-2 pt-4">
                    <div className="flex flex-row mx-[50px] justify-between">
                      <Link
                        href="https://twitter.com/robotproxywar"
                        target="_blank"
                      >
                        <Image
                          src={twitter}
                          width={65}
                          height={40}
                          alt="Twitter Logo"
                        />
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/kasi-reeves-6b987741/"
                        target="_blank"
                      >
                        <Image
                          src={linked}
                          width={75}
                          height={50}
                          alt="Resume Document"
                        />
                      </Link>
                      <Link
                        href="https://www.tiktok.com/@robotproxywar"
                        target="_blank"
                      >
                        <Image
                          src={tiktok}
                          width={125}
                          height={50}
                          alt="Resume Document"
                        />
                      </Link>
                      <Link
                        href="https://github.com/Kasirocswell"
                        target="_blank"
                      >
                        <Image
                          src={github}
                          width={65}
                          height={50}
                          alt="Resume Document"
                        />
                      </Link>
                    </div>
                  </div>
                  <div>
                    <p className="text-black mt-4 mx-6">
                      Thank you for completing the portfolio. I hope you enjoyed
                      it and the experience was as fun for you as it was for me
                      to build! For this project I used Next.js, Three.js,
                      Howler.js, React-Three-Fiber, and Tailwind.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 bg-gray-800 p-4 rounded-md text-sm shadow-md opacity-60">
                <strong>Kasi Reeves Portfolio</strong>
                <br />
                Click & Drag - Move Camera
                <br />Z - Zoom
                <br />C - Answer Cell
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

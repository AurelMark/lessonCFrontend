"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import OKakImage from "@/public/okak.png";
import "./[locale]/globals.css";
import useSound from "use-sound";
import { Button } from "@/componentsUI/button";

export default function NotFound() {
  const [animate, setAnimate] = useState(false);
  const [playCat] = useSound("/sounds/purring-cat-alice.mp3", { volume: 1 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleToGoHome = () => (window.location.href = "/");

  return (
    <div className="relative h-svh w-full bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-evenly px-4 z-0 select-none gap-32">
        <div
          className={`text-white font-extrabold text-[35vw] leading-none opacity-0 ${
            animate ? "animate-fade-slide-left" : ""
          }`}
          style={animate ? { animationDelay: "300ms" } : {}}
        >
          4
        </div>
        <div
          className={`text-white font-extrabold text-[35vw] leading-none opacity-0 ${
            animate ? "animate-fade-slide-right" : ""
          }`}
          style={animate ? { animationDelay: "300ms" } : {}}
        >
          4
        </div>
      </div>

      <div
        className={`relative z-10 w-[145vw] max-w-[1800px] aspect-[4/5] opacity-0 ${
          animate ? "animate-fade-in" : ""
        }`}
        style={animate ? { animationDelay: "1200ms" } : {}}
      >
        <Image
          src={OKakImage}
          alt="404 Cat"
          fill
          priority
          className="object-contain"
        />

        <div
          className={`absolute bottom-1/3 inset-x-0 z-20 font-extrabold leading-none select-none flex justify-center transition-opacity duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={animate ? { transitionDelay: "1800ms" } : {}}
        >
          <Button
            onClick={() => playCat()}
            variant="secondary"
            className="text-[7vw] md:text-[7vw] lg:text-[8vw] cursor-pointer z-20 no-underline hover:no-underline h-auto flex items-center gap-4"
          >
            OKAK
          </Button>
        </div>
        <div
          className={`absolute inset-x-0 z-20 font-extrabold leading-none select-none flex justify-center transition-opacity duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={
            animate
              ? { transitionDelay: "2000ms", bottom: "calc(33.3333% - 50px)" }
              : { bottom: "calc(33.3333% - 50px)" }
          }
        >
          <Button variant="destructive" onClick={handleToGoHome}>
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}

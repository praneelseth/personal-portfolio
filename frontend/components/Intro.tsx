"use client";
import Image from "next/image";

export default function Intro() {
  return (
    <div className="mb-10 flex flex-col sm:flex-row justify-between items-start gap-6">
      <div className="flex-1">
        <p className="text-lg mb-2 font-medium">
          Hi! I&apos;m a Computer Science student at UT Austin, passionate about Machine Learning, AI, and software engineering.
        </p>
        <p className="text-md text-gray-700">
          I enjoy building scalable software and learning new things. Welcome to my portfolio!
        </p>
      </div>
      <div className="flex-shrink-0 flex justify-center items-center mt-4 sm:mt-0">
        <Image
          src="/me.jpg"
          alt="Praneel Seth"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover ml-0 sm:ml-6 bg-gray-200"
          unoptimized
        />
      </div>
    </div>
  );
}
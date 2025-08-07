"use client";
import Image from "next/image";

export default function Intro() {
  return (
    <div className="mb-10 flex flex-col sm:flex-row justify-between items-start gap-6">
      <div className="flex-shrink-0 flex justify-center items-center mt-4 sm:mt-0">
        <Image
          src="/assets/me.jpg"
          alt="Praneel Seth"
          width={130}
          height={130}
          className="w-30 h-30 rounded-full object-cover ml-0 sm:ml-6 bg-gray-200"
          unoptimized
        />
      </div>
      <div className="flex-1">
        <p className="text-lg mb-2 font-medium">
          Hi there! I&apos;m Praneel, a computer science student at UT Austin. I&apos;m passionate about machine learning and software engineering.
        </p>
        <p className="text-md text-gray-700">
          I enjoy building projects involving artifical intelligence and learning new things. Welcome to my portfolio!
        </p>
      </div>
    </div>
  );
}
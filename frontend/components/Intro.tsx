"use client";

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
        <img
          src="/me.jpg"
          alt="Praneel Seth"
          className="w-24 h-24 rounded-full object-cover ml-0 sm:ml-6 bg-gray-200"
          onError={(e) => {
            // fallback: display a gray circle if image fails to load
            (e.target as HTMLImageElement).style.display = "none";
            const fallback = document.createElement("div");
            fallback.style.width = "96px";
            fallback.style.height = "96px";
            fallback.style.borderRadius = "50%";
            fallback.style.background = "#e5e7eb";
            fallback.style.display = "inline-block";
            fallback.setAttribute("aria-label", "Profile placeholder");
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      </div>
    </div>
  );
}
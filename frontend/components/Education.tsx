"use client";

export default function Education() {
  return (
    <ul className="mb-10">
      <li>
        <div className="flex justify-between">
          <div className="text-lg font-bold text-gray-900">
            University of Texas at Austin
          </div>
          <div className="text-gray-700">
            Aug 2023 - May 2027
          </div>
        </div>
        <div className="text-md font-semibold text-gray-800 mb-1">
          B.S. Computer Science (100 Credit Hours Completed)
        </div>
        <div className="text-gray-700 mb-1">
          <span className="font-medium">Relevant Coursework:</span>{" "}
          Essentials of AI, Autonomous Intelligent Robotics, Honors Data Structures and Algorithms, Honors Operating Systems, Computer Architecture, Natural Language Processing, Computer Vision, Neural Networks
        </div>
        <div className="text-gray-700">
          <span className="font-medium">Organizations:</span>{" "}
          Texas Association for Computing Machinery (ACM), UT EcoCar EV Challenge, Texas Dhoom Dance
        </div>
      </li>
    </ul>
  );
}
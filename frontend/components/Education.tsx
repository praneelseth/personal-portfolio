"use client";

const EDUCATION = [
  {
    university: "Stanford University",
    dates: "Sep 2020 – Jun 2024",
    degree: "B.S. in Computer Science, Artificial Intelligence Track",
    coursework: [
      "Machine Learning",
      "Deep Learning",
      "Algorithms",
      "Databases",
      "Computer Vision",
      "Natural Language Processing"
    ],
    organizations: [
      "Stanford AI Group",
      "ACM",
      "Women in Computer Science"
    ]
  }
];

export default function Education() {
  const edu = EDUCATION[0];
  return (
    <ul className="mb-10">
      <li>
        <div className="flex justify-between">
          <div className="text-lg font-bold text-gray-900">{edu.university}</div>
          <div className="text-gray-700 text-sm">{edu.dates}</div>
        </div>
        <div className="text-md font-semibold text-gray-800 mb-1">{edu.degree}</div>
        <div className="text-gray-700 mb-1">
          <span className="font-medium">Relevant Coursework:</span>{" "}
          {edu.coursework.join(", ")}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">Organizations:</span>{" "}
          {edu.organizations.join(", ")}
        </div>
      </li>
    </ul>
  );
}
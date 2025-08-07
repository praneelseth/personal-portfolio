export default function Contact() {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-4 items-center">
        <a
          href="mailto:praneelseth@gmail.com"
          className="text-blue-700 underline font-medium"
        >
          praneelseth@gmail.com
        </a>
        <a href="https://linkedin.com/in/praneelseth" aria-label="LinkedIn" className="text-gray-700 hover:text-blue-700">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline-block align-middle">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
        <a href="https://github.com/praneelseth" aria-label="GitHub" className="text-gray-700 hover:text-black">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline-block align-middle"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.799 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.724-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.606-2.665-.304-5.467-1.332-5.467-5.931 0-1.311.469-2.382 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.019.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.118 3.176.77.839 1.235 1.91 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>
  );
}
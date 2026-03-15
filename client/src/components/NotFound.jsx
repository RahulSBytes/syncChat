
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-center text-white px-4">
      {/* Main 404 Headline */}
      <h1 className="text-[6rem] md:text-[8rem] font-extrabold text-gray-200 leading-none">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mt-4">
        Page Not Found
      </h2>

      {/* Explanation */}
      <p className="mt-3 text-gray-400 max-w-md text-base md:text-lg">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 rounded-lg bg-[#248F60] text-white text-sm md:text-base font-medium shadow-md hover:bg-[#1f744e] transition"
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
function LayoutLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-white z-50">
      {/* Orbit Loader */}
      <div className="relative w-24 h-24 animate-spin-slow">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#248F60] rounded-full transform -translate-x-1/2"></div>
        <div className="absolute right-0 top-1/2 w-3 h-3 bg-[#248F60] rounded-full transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#248F60] rounded-full transform -translate-x-1/2"></div>
        <div className="absolute left-0 top-1/2 w-3 h-3 bg-[#248F60] rounded-full transform -translate-y-1/2"></div>
      </div>

      {/* Text */}
      <p className="mt-8 text-gray-300 text-lg font-medium tracking-wide">
        Loading <span className="text-[#248F60]">SynqChat</span>…
      </p>
    </div>
  );
}

export default LayoutLoader;
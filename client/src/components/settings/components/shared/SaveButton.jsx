export default function SaveButton({ onClick, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto px-6 py-2.5 md:py-3 rounded-lg 
        transition-all font-medium text-white ${
          disabled
            ? 'bg-[#404040] cursor-not-allowed opacity-60'
            : 'bg-[#248f60] hover:bg-[#1e7a52] active:scale-[0.98] shadow-lg shadow-[#248f60]/20'
        }`}
    >
      {label}
    </button>
  );
}
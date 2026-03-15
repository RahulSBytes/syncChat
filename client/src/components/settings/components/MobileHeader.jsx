// settings/components/MobileHeader.jsx
import { ChevronLeft, Menu, X } from 'lucide-react';

export default function MobileHeader({ onBack, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#323232] bg-[#242424]">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>
      
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}
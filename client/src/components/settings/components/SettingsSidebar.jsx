// settings/components/SettingsSidebar.jsx
import { User, Palette, Shield, Settings as SettingsIcon, LogOut, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';


const tabs = [
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'appearance', label: 'Appearance', Icon: Palette },
  { id: 'privacy', label: 'Privacy & Security', Icon: Shield },
  { id: 'general', label: 'General', Icon: SettingsIcon },
];

export default function SettingsSidebar({ activeTab, mobileMenuOpen, setMobileMenuOpen, onBack }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    const success = await logout();
    if (!success) return toast.error("failed logging out")
    toast.success("logged out successfully")
    navigate('/auth/login')
  };

  const handleTabClick = (tabId) => {
    navigate(`/settings/${tabId}`, { replace: true });
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-searchbar dark:bg-searchbar-dark  
        flex flex-col transform transition-transform duration-300 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-4 p-6 border-b border-[#323232]">
        <button
          className="text-secondary dark:text-secondary-dark hover:bg-zinc-300 dark:hover:bg-zinc-600 p-2 rounded-full transition-colors"
          onClick={onBack}
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-primary dark:text-primary-dark">Settings</h1>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {tabs.map(({Icon, label, id}) => {
            const isActive = activeTab === id;

            return (
              <li key={id}>
                <button
                  onClick={() => handleTabClick(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-surface  dark:bg-surface-dark text-secondary dark:text-secondary-dark'
                      : 'text-secondary dark:text-secondary-dark  hover:bg-zinc-300 dark:hover:bg-zinc-600'
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 ">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-lg 
            transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
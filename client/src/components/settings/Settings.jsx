// settings/Settings.jsx
import { useState, Suspense } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import useMeta from '../../hooks/useMeta.js';
import usePreferencesStore from '../../store/usePreferencesStore.js';
import SettingsSidebar from './components/SettingsSidebar';
import MobileHeader from './components/MobileHeader';
import PasswordModal from './components/PasswordModal.jsx';

export default function Settings() {
  useMeta({ title: "Settings", description: "Manage your account settings" });

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { isLoading } = usePreferencesStore();

  // Extract active tab from current path
  const activeTab = location.pathname.split('/').filter(Boolean).pop() || 'profile';

  if (isLoading) {
    return (
      <div className="h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark flex flex-col lg:flex-row overflow-hidden">
      <MobileHeader
        onBack={() => navigate(-1)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <SettingsSidebar
        activeTab={activeTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onBack={() => navigate(-1)}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-zinc-400">Loading...</div>
            </div>
          }>
            <Outlet context={{ onPasswordModal: () => setShowPasswordModal(true) }} />
          </Suspense>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
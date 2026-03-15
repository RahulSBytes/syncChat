import { useState } from 'react';
import { Menu, X, ArrowLeft, Search, Users } from 'lucide-react';
import { useUIStore } from "../../store/store.js";
import { useParams, useNavigate } from 'react-router-dom';

export default function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { id: chatId } = useParams();

  
  const { 
    setIsNewGroupClicked, 
    setIsSearchPeopleClicked, 
    setIsNotificationClicked 
  } = useUIStore();

  const handleMenuAction = (action) => {
    setShowMobileMenu(false);
    
    switch (action) {
      case 'newGroup':
        setIsNewGroupClicked(true);
        break;
      case 'search':
        setIsSearchPeopleClicked(true);
        break;
      case 'notifications':
        setIsNotificationClicked(true);
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // Handle logout
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center">
            {chatId ? ( <p></p>
              
            ) : (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-white hover:bg-gray-700 rounded mr-2"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            
            <h1 className="text-white font-semibold text-lg">
              {chatId ? 'Chat' : 'ChatApp'}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {!chatId && (
              <button
                onClick={() => handleMenuAction('search')}
                className="p-2 text-white hover:bg-gray-700 rounded"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && !chatId && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-2">
          <div className="space-y-1">
            <button
              onClick={() => handleMenuAction('newGroup')}
              className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-700 rounded text-left"
            >
              <Users className="w-5 h-5 mr-3" />
              New Group
            </button>
            
            <button
              onClick={() => handleMenuAction('search')}
              className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-700 rounded text-left"
            >
              <Search className="w-5 h-5 mr-3" />
              Search People
            </button>
            
            <button
              onClick={() => handleMenuAction('notifications')}
              className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-700 rounded text-left"
            >
              Notifications
            </button>
            
            <hr className="border-gray-600 my-2" />
            
            <button
              onClick={() => handleMenuAction('settings')}
              className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-700 rounded text-left"
            >
              Settings
            </button>
            
            <button
              onClick={() => handleMenuAction('logout')}
              className="flex items-center w-full px-3 py-3 text-red-400 hover:bg-gray-700 rounded text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
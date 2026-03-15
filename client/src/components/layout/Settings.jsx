import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Eye, EyeOff, User, Mail, Clock, Palette, LogOut, Lock, Shield, Settings as SettingsIcon, ChevronLeft, Menu, X, Type, Image as ImageIcon, MessageSquare, Sparkles, Keyboard, Volume2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMeta from '../../hooks/useMeta.js';
import usePreferencesStore from '../../store/usePreferencesStore.js';
import { useState } from 'react';

export default function Settings() {
  useMeta({ title: "setting", description: "this is setting page" });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    preferences,
    isLoading,
    fetchPreferences,
    updateAppearance: updateAppearanceStore,
    updatePrivacy: updatePrivacyStore,
    updateNotifications,
    updateGeneralSettings,
  } = usePreferencesStore();

  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      // Profile
      fullName: 'John Doe',
      username: 'johndoe',
      bio: 'Hey there! I am using this chat app.',
      email: 'john.doe@gmail.com',
      avatar: null,

      // Appearance
      theme: 'dark',
      fontSize: 'medium',
      chatWallpaper: null,
      messageBubbleStyle: 'rounded',
      accentColor: '#0084ff',
      timeFormat: '12h',

      // Privacy
      profilePhotoVisibility: 'everyone',
      onlineStatusVisibility: 'everyone',
      typingIndicator: true,
      lastSeenVisible: true,

      // General
      notificationsEnabled: true,
      tickSound: true,
      enterToSend: true,
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      reset({
        // Keep profile data (would come from user API)
        fullName: preferences.fullName || 'John Doe',
        username: preferences.username || 'johndoe',
        bio: preferences.bio || 'Hey there! I am using this chat app.',
        email: preferences.email || 'john.doe@gmail.com',
        avatar: null,

        // Appearance
        theme: preferences.appearance?.theme || 'dark',
        fontSize: preferences.appearance?.fontSize || 'medium',
        chatWallpaper: preferences.appearance?.chatWallpaper || null,
        messageBubbleStyle: preferences.messageBubbleStyle || 'rounded',
        accentColor: preferences.accentColor || '#0084ff',
        timeFormat: preferences.timeFormat || '12h',

        // Privacy
        profilePhotoVisibility: preferences.privacy?.profilePhoto || 'everyone',
        onlineStatusVisibility: preferences.privacy?.onlineStatus || 'everyone',
        typingIndicator: preferences.privacy?.typingIndicator ?? true,
        lastSeenVisible: true,

        // General
        notificationsEnabled: preferences.notifications ?? true,
        tickSound: preferences.tickSound ?? true,
        enterToSend: preferences.enterToSend ?? true,
      });
    }
  }, [preferences, reset]);


  const onProfileSubmit = handleSubmit((data) => {
    const profileData = {
      fullName: data.fullName,
      username: data.username,
      bio: data.bio,
      email: data.email,
      avatar: data.avatar,
    };
    console.log('Profile saved:', profileData);
    alert('Profile saved successfully!');
  });

  const onAppearanceSubmit = handleSubmit(async (data) => {
    const appearanceData = {
      theme: data.theme,
      fontSize: data.fontSize,
      chatWallpaper: data.chatWallpaper,
      messageBubbleStyle: data.messageBubbleStyle,
      accentColor: data.accentColor,
      timeFormat: data.timeFormat,
    };

    const success = await updateAppearanceStore(appearanceData);
    if (success) {
      alert('Appearance settings saved successfully!');
    } else {
      alert('Failed to save appearance settings');
    }
  });

  const onPrivacySubmit = handleSubmit(async (data) => {
    const privacyData = {
      profilePhoto: data.profilePhotoVisibility,
      onlineStatus: data.onlineStatusVisibility,
      typingIndicator: data.typingIndicator,
    };

    const success = await updatePrivacyStore(privacyData);
    if (success) {
      alert('Privacy settings saved successfully!');
    } else {
      alert('Failed to save privacy settings');
    }
  });

  const onGeneralSubmit = handleSubmit(async (data) => {
    const notificationSuccess = await updateNotifications({
      notifications: data.notificationsEnabled,
      tickSound: data.tickSound,
    });

    const generalSuccess = await updateGeneralSettings({
      enterToSend: data.enterToSend,
    });

    if (notificationSuccess && generalSuccess) {
      alert('General settings saved successfully!');
    } else {
      alert('Failed to save general settings');
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit((data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password changed');
    setShowPasswordModal(false);
    passwordForm.reset();
    alert('Password changed successfully!');
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatar', file);
    }
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('chatWallpaper', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'general', label: 'General', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Profile Settings</h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src="../../../image.png"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#323232]"
                  alt="Profile"
                />
                <label className="absolute bottom-0 right-0 bg-[#248f60] p-1.5 md:p-2 rounded-full cursor-pointer hover:bg-[#1e7a52] transition-colors">
                  <Camera size={14} className="md:w-4 md:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-base md:text-lg">Profile Picture</p>
                <p className="text-xs md:text-sm text-zinc-400">Click camera icon to change</p>
              </div>
            </div>

            <div className="grid gap-4 md:gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Full Name</label>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Username</label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Bio</label>
                <textarea
                  {...register('bio', { maxLength: 150 })}
                  rows={3}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] resize-none transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {watch('bio')?.length || 0}/150 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={onProfileSubmit}
              className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
            >
              Save Profile Change
            </button>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Appearance</h2>

            <div className="space-y-4 md:space-y-6">
              {/* Theme */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg">Theme</h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose your preferred theme</p>
                  </div>
                  <select
                    {...register('theme')}
                    className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
              </div>

              {/* Font Size */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Type size={16} className="md:w-[18px] md:h-[18px]" />
                      Font Size
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Adjust text size in chats</p>
                  </div>
                  <select
                    {...register('fontSize')}
                    className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              </div>

              {/* Message Bubble Style */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                      Message Bubble Style
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose message bubble appearance</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['rounded', 'sharp', 'minimal'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setValue('messageBubbleStyle', style)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                          watch('messageBubbleStyle') === style
                            ? 'bg-[#248f60] text-white'
                            : 'bg-[#323232] text-zinc-300 hover:text-white hover:bg-[#404040]'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Sparkles size={16} className="md:w-[18px] md:h-[18px]" />
                      Accent Color
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Customize app accent color</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      {...register('accentColor')}
                      className="w-12 h-10 bg-transparent border-2 border-[#404040] rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-zinc-400">{watch('accentColor')}</span>
                  </div>
                </div>
              </div>

              {/* Chat Wallpaper */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <ImageIcon size={16} className="md:w-[18px] md:h-[18px]" />
                      Chat Wallpaper
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Set a custom background for chats</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="bg-[#323232] hover:bg-[#404040] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleWallpaperChange}
                      />
                    </label>
                    {watch('chatWallpaper') && (
                      <button
                        type="button"
                        onClick={() => setValue('chatWallpaper', null)}
                        className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {watch('chatWallpaper') && (
                    <div className="mt-2">
                      <img
                        src={watch('chatWallpaper')}
                        alt="Wallpaper preview"
                        className="h-20 w-32 object-cover rounded-lg border border-[#404040]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Time Format */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Clock size={16} className="md:w-[18px] md:h-[18px]" />
                      Time Format
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose 12-hour or 24-hour format</p>
                  </div>
                  <div className="flex bg-[#323232] rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setValue('timeFormat', '12h')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${
                        watch('timeFormat') === '12h'
                          ? 'bg-[#248f60] text-white'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      12h
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('timeFormat', '24h')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${
                        watch('timeFormat') === '24h'
                          ? 'bg-[#248f60] text-white'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      24h
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onAppearanceSubmit}
              className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
            >
              Save Appearance Change
            </button>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Privacy & Security</h2>

            <div className="space-y-4 md:space-y-6">
              {/* Profile Photo Visibility */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <User size={16} className="md:w-[18px] md:h-[18px]" />
                      Profile Photo
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Who can see your profile photo</p>
                  </div>
                  <select
                    {...register('profilePhotoVisibility')}
                    className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>

              {/* Online Status */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                      Online Status
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Who can see when you're online</p>
                  </div>
                  <select
                    {...register('onlineStatusVisibility')}
                    className="bg-[#323232] border border-[#404040] rounded-lg px-3 md:px-4 py-2 text-white focus:outline-none focus:border-[#248f60]"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>

              {/* Last Seen */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      {watch('lastSeenVisible') ? (
                        <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                      ) : (
                        <EyeOff size={16} className="md:w-[18px] md:h-[18px]" />
                      )}
                      Last Seen
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Control who can see your last seen status</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('lastSeenVisible')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                      Typing Indicator
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Show when you're typing to others</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('typingIndicator')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between hover:bg-[#323232] p-3 -m-3 rounded-lg transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Lock size={16} className="md:w-[18px] md:h-[18px]" />
                      Password
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Change your account password</p>
                  </div>
                  <ChevronLeft size={20} className="rotate-180 text-zinc-400" />
                </button>
              </div>
            </div>

            <button
              onClick={onPrivacySubmit}
              className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
            >
              Save Privacy Change
            </button>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">General Settings</h2>

            <div className="space-y-4 md:space-y-6">
              {/* Enable Notifications */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Bell size={16} className="md:w-[18px] md:h-[18px]" />
                      Enable Notifications
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Receive notifications for new messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('notificationsEnabled')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>

              {/* Tick Sound */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Volume2 size={16} className="md:w-[18px] md:h-[18px]" />
                      Message Tick Sound
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">Play sound when sending messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('tickSound')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>

              {/* Enter to Send */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
                      <Keyboard size={16} className="md:w-[18px] md:h-[18px]" />
                      Enter to Send
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1">
                      {watch('enterToSend')
                        ? 'Press Enter to send, Shift+Enter for new line'
                        : 'Press Ctrl+Enter to send, Enter for new line'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('enterToSend')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#248f60]"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={onGeneralSubmit}
              className="w-full sm:w-auto bg-[#248f60] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#1e7a52] transition-colors font-medium"
            >
              Save General Settings
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-lg">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#323232] bg-[#242424]">
        <div className="flex items-center gap-3">
          <button
            className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#242424] border-r border-[#323232] transform transition-transform duration-300 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="hidden lg:flex items-center gap-4 p-6 border-b border-[#323232]">
          <button
            className="text-white hover:bg-[#323232] p-2 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#323232] text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#323232]">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-8">{renderContent()}</div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242424] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  passwordForm.reset();
                }}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Current Password</label>
                <input
                  type="password"
                  {...passwordForm.register('oldPassword', { required: 'Current password is required' })}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Enter current password"
                />
                {passwordForm.formState.errors.oldPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.oldPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">New Password</label>
                <input
                  type="password"
                  {...passwordForm.register('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Confirm New Password</label>
                <input
                  type="password"
                  {...passwordForm.register('confirmPassword', { required: 'Please confirm your password' })}
                  className="w-full bg-[#323232] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#248f60] transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    passwordForm.reset();
                  }}
                  className="flex-1 bg-[#404040] hover:bg-[#4a4a4a] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#248f60] hover:bg-[#1e7a52] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
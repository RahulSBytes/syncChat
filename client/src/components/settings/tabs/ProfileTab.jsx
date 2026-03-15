// settings/tabs/ProfileTab.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Mail } from 'lucide-react';
import { useChangeTracking } from '../../../hooks/useChangeTracking';
import usePreferencesStore from '../../../store/usePreferencesStore.js';
import SaveButton from '../components/shared/SaveButton.jsx';
import { useAuthStore } from '../../../store/authStore.js';
import toast from 'react-hot-toast';

// Avatar Upload Component
function AvatarUpload({ currentAvatar, onChange, watch }) {
  const avatarFile = watch('avatar');
  const [preview, setPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max, like registration)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="relative">
        <img
          src={preview || currentAvatar || '/unknown.jpg'}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#323232]"
          alt="Profile"
        />
        <label className="absolute bottom-0 right-0 bg-accent p-1.5 md:p-2 rounded-full 
          cursor-pointer hover:bg-[#1e7a52] transition-colors">
          <Camera size={14} className="md:w-4 md:h-4 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="Change profile picture"
          />
        </label>
      </div>
      <div className="text-center sm:text-left">
        <p className="font-medium text-primary dark:text-primary md:text-lg">Profile Picture</p>
        <p className="text-xs md:text-sm text-muted dark:text-muted-dark">Click camera icon to change (Max 2MB)</p>
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ label, name, type = 'text', register, errors, rules, icon: Icon, placeholder }) {
  const error = errors?.[name];
  
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium mb-2 text-primary  dark:text-primary-dark flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, rules)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 md:px-4 py-2.5 md:py-3 
          text-secondary dark:text-secondary-dark focus:outline-none focus:border-accent transition-colors bg-searchbar dark:bg-searchbar-dark"
      />
      {error && <p className="text-error text-xs mt-1">{error.message}</p>}
    </div>
  );
}

// Main Profile Tab Component
export default function ProfileTab() {
  const { updateProfile } = usePreferencesStore();
  const user = useAuthStore(state => state.user);

  const formMethods = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      bio: '',
      email: '',
      avatar: null,
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = formMethods;
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      formMethods.reset({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        avatar: null,
      });
    }
  }, [user, formMethods]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Build submission data (only changed fields)
      const changes = {};
      
      if (data.fullName !== user.fullName) changes.fullName = data.fullName;
      if (data.username !== user.username) changes.username = data.username;
      if (data.bio !== user.bio) changes.bio = data.bio;
      if (data.email !== user.email) changes.email = data.email;
      if (data.avatar instanceof File) changes.avatar = data.avatar;

      if (Object.keys(changes).length === 0) {
        toast.info('No changes to save');
        return;
      }

      setIsSaving(true);
      console.log('Updating profile with:', changes);

      const success = await updateProfile(changes);

      if (success) {
        toast.success('Profile updated successfully!');
        // Reset avatar field after successful upload
        setValue('avatar', null);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  });

  // Check for changes (including avatar)
  const hasChanges = () => {
    return isDirty || watch('avatar') instanceof File;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Profile Settings</h2>

      <AvatarUpload 
        currentAvatar={user?.avatar?.url}
        onChange={(file) => setValue('avatar', file)}
        watch={watch}
      />

      <div className="grid gap-4 md:gap-5">
        <FormField
          label="Full Name"
          name="fullName"
          register={register}
          errors={errors}
          placeholder="Enter your full name"
          rules={{ 
            required: 'Full name is required',
            maxLength: { value: 30, message: 'Max 30 characters' }
          }}
        />

        <FormField
          label="Username"
          name="username"
          register={register}
          errors={errors}
          placeholder="Enter your username"
          rules={{ 
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            maxLength: { value: 30, message: 'Max 30 characters' },
            
          }}
        />

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2 text-primary dark:text-primary-dark">
            Bio
          </label>
          <textarea
            id="bio"
            {...register('bio', { maxLength: 150 })}
            rows={3}
            className="w-full bg-searchbar dark:bg-searchbar-dark  rounded-lg px-3 md:px-4 py-2.5 md:py-3 
              text-secondary dark:text-secondary-dark focus:outline-none focus:border-[#248f60] resize-none transition-colors"
            placeholder="Tell us about yourself"
          />
          <p className="text-xs text-zinc-500 mt-1">
            {watch('bio')?.length || 0}/150 characters
          </p>
        </div>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          register={register}
          errors={errors}
          placeholder="Enter your email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
        />
      </div>

      <SaveButton 
        onClick={onSubmit} 
        label="Save Profile Changes"
        disabled={!hasChanges()}
        loading={isSaving}
      />
    </div>
  );
}
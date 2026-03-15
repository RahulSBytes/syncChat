// settings/tabs/PrivacyTab.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import { User, Eye, EyeOff, MessageSquare, Lock, ChevronRight } from 'lucide-react';
import { useChangeTracking } from '../../../hooks/useChangeTracking';
import usePreferencesStore from '../../../store/usePreferencesStore.js';
import SaveButton from '../components/shared/SaveButton.jsx';
import SettingItem from '../components/shared/SettingItem.jsx';
import ToggleSwitch from '../components/shared/ToggleSwitch.jsx';

export default function PrivacyTab() {

  if(true) return <div className='text-secondary dark:text-secondary-dark text-center'>This section is currently being improved. Updates will be available soon.</div>


  const { onPasswordModal } = useOutletContext();
  const { preferences, fetchPreferences, updatePrivacy } = usePreferencesStore();
  
  const formMethods = useForm({
    defaultValues: {
      profilePhotoVisibility: 'everyone',
      onlineStatusVisibility: 'everyone',
      typingIndicator: true,
      lastSeenVisible: true,
    }
  });

  const { register, handleSubmit, watch, setValue } = formMethods;

  // ✅ Use custom hook for change tracking
  const { isSaving, hasChanges, handleSave } = useChangeTracking(
    formMethods,
    preferences ? {
      profilePhotoVisibility: preferences.privacy?.profilePhoto || 'everyone',
      onlineStatusVisibility: preferences.privacy?.onlineStatus || 'everyone',
      typingIndicator: preferences.privacy?.typingIndicator ?? true,
      lastSeenVisible: preferences.privacy?.lastSeenVisible ?? true,
    } : null
  );

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const onSubmit = handleSubmit(() => {
    // Field mapping from form fields to API fields
    const fieldMapping = {
      profilePhotoVisibility: 'profilePhoto',
      onlineStatusVisibility: 'onlineStatus',
      typingIndicator: 'typingIndicator',
      lastSeenVisible: 'lastSeenVisible'
    };

    handleSave(updatePrivacy, {
      fieldMapping,
      successMessage: 'Privacy settings updated successfully!',
      errorMessage: 'Failed to save privacy settings',
      noChangesMessage: 'No privacy changes to save'
    });
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Privacy & Security</h2>

      <div className="space-y-4 md:space-y-6">
        <SettingItem
          title="Profile Photo"
          description="Who can see your profile photo"
          icon={User}
        >
          <select
            {...register('profilePhotoVisibility')}
            className="bg-[#404040] rounded-lg px-3 md:px-4 py-2 text-white 
              focus:outline-none focus:border-[#248f60] transition-colors"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Online Status"
          description="Who can see when you're online"
          icon={Eye}
        >
          <select
            {...register('onlineStatusVisibility')}
            className="bg-[#404040] rounded-lg px-3 md:px-4 py-2 text-white 
              focus:outline-none focus:border-[#248f60] transition-colors"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </SettingItem>

        <ToggleSwitch
          label="Last Seen"
          description="Control who can see your last seen status"
          icon={watch('lastSeenVisible') ? Eye : EyeOff}
          checked={watch('lastSeenVisible')}
          onChange={(checked) => setValue('lastSeenVisible', checked)}
        />

        <ToggleSwitch
          label="Typing Indicator"
          description="Show when you're typing to others"
          icon={MessageSquare}
          checked={watch('typingIndicator')}
          onChange={(checked) => setValue('typingIndicator', checked)}
        />

        <div className="bg-searchbar dark:bg-searchbar-dark rounded-lg p-4 md:p-6">
          <button
            type="button"
            onClick={onPasswordModal}
            className="w-full flex items-center justify-between hover:bg-surface dark:hover:bg-surface-dark p-3 -m-3 
              rounded-lg transition-colors group"
          >
            <div className="text-left">
              <h3 className="font-medium text-secondary dark:text-secondary-dark md:text-lg flex items-center gap-2">
                <Lock size={16} className="md:w-[18px] md:h-[18px]" />
                Password
              </h3>
              <p className="text-xs md:text-sm text-muted dark:text-muted-dark mt-1">Change your account password</p>
            </div>
            <ChevronRight size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <SaveButton 
        onClick={onSubmit} 
        label="Save Privacy Changes"
        disabled={!hasChanges()}
        loading={isSaving}
      />
    </div>
  );
}
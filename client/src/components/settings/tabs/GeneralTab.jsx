// settings/tabs/GeneralTab.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Volume2 } from 'lucide-react';
import { useChangeTracking } from '../../../hooks/useChangeTracking';
import usePreferencesStore from '../../../store/usePreferencesStore.js';
import SaveButton from '../components/shared/SaveButton.jsx';
import ToggleSwitch from '../components/shared/ToggleSwitch.jsx';

export default function GeneralTab() {

  if(true) return <div className='text-secondary dark:text-secondary-dark text-center'>This section is currently being improved. Updates will be available soon.</div>


  const { preferences, fetchPreferences, updateGeneralSettings } = usePreferencesStore();
  
  const formMethods = useForm({
    defaultValues: {
      notificationsEnabled: true,
      tickSound: true,
      enterToSend: true,
    }
  });

  const { watch, setValue, handleSubmit } = formMethods;

  // ✅ Use custom hook for change tracking
  const { isSaving, hasChanges, handleSave } = useChangeTracking(
    formMethods,
    preferences ? {
      notificationsEnabled: preferences.notifications ?? true,
      tickSound: preferences.tickSound ?? true,
      enterToSend: preferences.enterToSend ?? true,
    } : null
  );

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const onSubmit = handleSubmit(() => {
    // ✅ SUPER SIMPLE: Let handleSave do everything
    const fieldMapping = {
      notificationsEnabled: 'notifications',
      tickSound: 'tickSound',
      enterToSend: 'enterToSend'
    };

    handleSave(updateGeneralSettings, {
      fieldMapping,
      successMessage: 'General settings updated successfully!',
      errorMessage: 'Failed to save general settings'
    });
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">General Settings</h2>

      <div className="space-y-4 md:space-y-6">
        <ToggleSwitch
          label="Enable Notifications"
          description="Receive notifications for new messages"
          icon={Bell}
          checked={watch('notificationsEnabled')}
          onChange={(checked) => setValue('notificationsEnabled', checked)}
        />

        <ToggleSwitch
          label="Message Tick Sound"
          description="Play sound when sending messages"
          icon={Volume2}
          checked={watch('tickSound')}
          onChange={(checked) => setValue('tickSound', checked)}
        />

      </div>

      <SaveButton 
        onClick={onSubmit} 
        label="Save General Settings"
        disabled={!hasChanges()}
        loading={isSaving}
      />
    </div>
  );
}
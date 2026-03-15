// settings/tabs/AppearanceTab.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Type, MessageSquare, Sparkles, Clock } from 'lucide-react';
import { useChangeTracking } from '../../../hooks/useChangeTracking';
import usePreferencesStore from '../../../store/usePreferencesStore.js';
import SaveButton from '../components/shared/SaveButton.jsx';
import SettingItem from '../components/shared/SettingItem.jsx';

export default function AppearanceTab() {


  if(true) return <div className='text-secondary dark:text-secondary-dark text-center'>This section is currently being improved. Updates will be available soon.</div>


  const { preferences, fetchPreferences, updateAppearance } = usePreferencesStore();
  
  const formMethods = useForm({
    defaultValues: {
      theme: 'dark',
      fontSize: 'medium',
      messageBubbleStyle: 'rounded',
      accentColor: '#248f60',
      timeFormat: '12h',
    }
  });

  const { register, handleSubmit, watch, setValue } = formMethods;

  const { isSaving, hasChanges, handleSave } = useChangeTracking(
    formMethods,
    preferences ? {
      theme: preferences.appearance?.theme || 'dark',
      fontSize: preferences.appearance?.fontSize || 'medium',
      messageBubbleStyle: preferences.messageBubbleStyle || 'rounded',
      accentColor: preferences.accentColor || '#248f60',
      timeFormat: preferences.timeFormat || '12h',
    } : null
  );

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const onSubmit = handleSubmit(() => {
    handleSave(updateAppearance, {
      successMessage: 'Appearance settings updated successfully!',
      errorMessage: 'Failed to update appearance settings',
      noChangesMessage: 'No appearance changes to save'
    });
  });

  const bubbleStyles = ['rounded', 'sharp', 'minimal'];
  const timeFormats = [
    { value: '12h', label: '12h' },
    { value: '24h', label: '24h' }
  ];

    
  return (

    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Appearance</h2>

      <div className="space-y-4 md:space-y-6">
        <SettingItem
          title="Theme"
          description="Choose your preferred theme"
        >
          <select
            {...register('theme')}
            className="bg-[#404040] rounded-lg px-3 md:px-4 py-2 text-white 
              focus:outline-none focus:border-[#248f60] transition-colors"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Font Size"
          description="Adjust text size in chats"
          icon={Type}
        >
          <select
            {...register('fontSize')}
            className="bg-[#404040] rounded-lg px-3 md:px-4 py-2 text-white 
              focus:outline-none focus:border-[#248f60] transition-colors"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </SettingItem>

        <div className="bg-searchbar dark:bg-searchbar-dark rounded-lg p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-medium text-secondary dark:text-secondary-dark md:text-lg flex items-center gap-2">
                <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                Message Bubble Style
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">Choose message bubble appearance</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {bubbleStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setValue('messageBubbleStyle', style)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                    watch('messageBubbleStyle') === style
                      ? 'bg-accent text-secondary dark:text-secondary-dark'
                      : 'bg-zinc-400 dark:bg-zinc-600 text-secondary dark:select-secondary-dark hover:text-white hover:bg-muted dark:hover:bg-muted-dark'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SettingItem
          title="Accent Color"
          description="Customize app accent color"
          icon={Sparkles}
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('accentColor')}
              className="w-12 h-10 bg-transparent border-2 border-muted  cursor-pointer"
            />
            <span className="text-sm text-muted dark:text-muted-dark font-mono">{watch('accentColor')}</span>
          </div>
        </SettingItem>

        <SettingItem
          title="Time Format"
          description="Choose 12-hour or 24-hour format"
          icon={Clock}
        >
          <div className="flex border-2 border-muted dark:border-muted-dark rounded-lg p-1">
            {timeFormats.map((format) => (
              <button
                key={format.value}
                type="button"
                onClick={() => setValue('timeFormat', format.value)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-sm transition-colors ${
                  watch('timeFormat') === format.value
                    ? 'bg-accent text-secondary dark:text-secondary-dark'
                    : 'text-muted dark:text-muted-dark'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </SettingItem>
      </div>

      <SaveButton 
        onClick={onSubmit} 
        label="Save Appearance Changes"
        disabled={!hasChanges()}
        loading={isSaving}
      />
    </div>
  );
}
// hooks/useChangeTracking.js
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useChangeTracking(formMethods, initialValues) {
  const [originalValues, setOriginalValues] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialized = useRef(false);
  
  const { reset, getValues, watch } = formMethods;
  
  const watchedValues = watch();

  useEffect(() => {
    if (initialValues && !hasInitialized.current) {
      reset(initialValues);
      setOriginalValues(initialValues);
      hasInitialized.current = true;
    }
  }, [initialValues, reset]);

  const hasChanges = useCallback(() => {
    if (!originalValues) return false;
    
    return Object.keys(watchedValues).some(
      key => watchedValues[key] !== originalValues[key]
    );
  }, [watchedValues, originalValues]);

  // Get only changed fields
  const getChangedFields = (fieldMapping = null) => {
    const currentValues = getValues();
    const changes = {};
    
    if (!originalValues) return changes;
    
    Object.keys(currentValues).forEach(key => {
      if (currentValues[key] !== originalValues[key]) {
        const fieldName = fieldMapping?.[key] || key;
        changes[fieldName] = currentValues[key];
      }
    });
    
    return changes;
  };

  // Handle save with change detection
  const handleSave = async (saveFunction, options = {}) => {
    const { 
      fieldMapping = null,
      successMessage = 'Settings saved successfully!',
      errorMessage = 'Failed to save settings',
      noChangesMessage = 'No changes to save'
    } = options;

    try {
      const changes = getChangedFields(fieldMapping);
      
      if (Object.keys(changes).length === 0) {
        toast.info(noChangesMessage);
        return false;
      }

      setIsSaving(true);
      console.log('Saving changes:', changes);
      
      const success = await saveFunction(changes);
      
      if (success) {
        toast.success(successMessage);
        setOriginalValues(getValues());
        return true;
      } else {
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    originalValues,
    setOriginalValues,
    isSaving,
    setIsSaving,
    hasChanges,
    getChangedFields,
    handleSave
  };
}
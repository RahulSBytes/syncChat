// settings/modals/PasswordModal.jsx
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import usePreferencesStore from '../../../store/usePreferencesStore';
import toast from 'react-hot-toast';

export default function PasswordModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassShow, setOldPassShow] = useState(false);
  const [newPassShow, setNewPassShow] = useState(false);
  const [confPassShow, setConfPassShow] = useState(false);
  
  const { updatePassword } = usePreferencesStore();
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);
      const result = await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });

      if (result.success) {
        toast.success(result.message || 'Password changed successfully!');
        handleClose();
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  });

  const handleClose = () => {
    reset();
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface dark:bg-surface-dark rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Change Password</h3>
          <button
            onClick={handleClose}
            className="text-primary dark:text-primary-dark p-2 transition-colors rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium mb-2 text-secondary dark:text-secondary-dark">
              Current Password
            </label>
            <div className='rounded-lg p-4 bg-searchbar dark:bg-searchbar-dark flex'>
              <input
                id="oldPassword"
                type={oldPassShow ? "text" : "password"}
                {...register('oldPassword', { required: 'Current password is required' })}
                className="bg-transparent flex-1 h-full outline-none placeholder:text-muted dark:placeholder:text-muted-dark"
                placeholder="Enter current password"
                disabled={isLoading}
              />
              <span 
                onClick={() => setOldPassShow(!oldPassShow)}
                className="cursor-pointer"
              >
                {oldPassShow ? <EyeOff size={19} strokeWidth={1} /> : <Eye size={19} strokeWidth={1} />}
              </span>
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-secondary dark:text-secondary-dark">
              New Password
            </label>
            <div className='rounded-lg p-4 bg-searchbar dark:bg-searchbar-dark flex'>
              <input
                id="newPassword"
                type={newPassShow ? "text" : "password"}
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                    message: 'Must contain uppercase, lowercase and number'
                  }
                })}
                className="bg-transparent flex-1 h-full outline-none placeholder:text-muted dark:placeholder:text-muted-dark"
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <span 
                onClick={() => setNewPassShow(!newPassShow)}
                className="cursor-pointer"
              >
                {newPassShow ? <EyeOff size={19} strokeWidth={1} /> : <Eye size={19} strokeWidth={1} />}
              </span>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-secondary dark:text-secondary-dark">
              Confirm New Password
            </label>
            <div className='rounded-lg p-4 bg-searchbar dark:bg-searchbar-dark flex'>
              <input
                id="confirmPassword"
                type={confPassShow ? "text" : "password"}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
                className="bg-transparent flex-1 h-full outline-none placeholder:text-muted dark:placeholder:text-muted-dark"
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <span 
                onClick={() => setConfPassShow(!confPassShow)}
                className="cursor-pointer"
              >
                {confPassShow ? <EyeOff size={19} strokeWidth={1} /> : <Eye size={19} strokeWidth={1} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border border-muted dark:border-muted-dark text-primary dark:text-primary-dark py-3 px-4 rounded-lg 
                transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-accent hover:opacity-90 text-white py-3 px-4 rounded-lg 
                transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// settings/components/shared/SettingItem.jsx
export default function SettingItem({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-searchbar dark:bg-searchbar-dark rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-medium text-secondary dark:text-secondary-dark md:text-lg flex items-center gap-2">
            {Icon && <Icon size={16} className="md:w-[18px] md:h-[18px]" />}
            {title}
          </h3>
          {description && (
            <p className="text-xs md:text-sm text-muted dark:text-muted-dark mt-1">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
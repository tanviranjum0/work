import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemePreference } from '../../lib/theme';

const options: readonly { value: ThemePreference; Icon: typeof Sun }[] = [
  { value: 'system', Icon: Monitor },
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
];

/** A labelled radio group: three explicit states are clearer than a mystery toggle. */
export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className="flex items-center rounded-control border border-border p-0.5">
      <legend className="sr-only">{t('theme.label')}</legend>
      {options.map(({ value, Icon }) => (
        <label
          key={value}
          title={t(`theme.${value}`)}
          className="relative grid size-8 cursor-pointer place-items-center rounded-[4px] text-muted transition-colors duration-(--duration-fast) hover:text-fg has-checked:bg-surface-muted has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-primary"
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={preference === value}
            onChange={() => setPreference(value)}
            className="sr-only"
          />
          <Icon aria-hidden className="size-4" />
          <span className="sr-only">{t(`theme.${value}`)}</span>
        </label>
      ))}
    </fieldset>
  );
};

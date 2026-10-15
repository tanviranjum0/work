import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBookingEnabled } from '../../lib/use-client-config';
import { ChevronDown, UserRound } from 'lucide-react';
import { useAuth } from '../../features/auth/auth-context';

const item = 'block w-full rounded-control px-3 py-2 text-left text-body-sm hover:bg-surface-muted';

export const AccountMenu = () => {
  const { t } = useTranslation();
  const { user, isSignedIn, signOut } = useAuth();
  const bookingEnabled = useBookingEnabled();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  if (!isSignedIn) {
    return (
      <Link
        to="/signin"
        className="rounded-control border border-control-border px-3 py-2 text-body-sm font-semibold hover:bg-surface-muted"
      >
        {t('auth.signIn')}
      </Link>
    );
  }

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('auth.menu')}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-control border border-border px-2.5 py-2 text-body-sm font-semibold hover:bg-surface-muted"
      >
        <UserRound aria-hidden className="size-4" />
        <span className="max-w-24 truncate">{user?.displayName}</span>
        <ChevronDown
          aria-hidden
          className={`size-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        role="menu"
        hidden={!open}
        className="absolute top-full right-0 z-(--z-overlay) mt-1 w-52 rounded-panel border border-border bg-surface p-1 shadow-float"
      >
        <Link role="menuitem" to="/account" className={item} onClick={() => setOpen(false)}>
          {t('account.nav.profile')}
        </Link>
        <Link role="menuitem" to="/account/travelers" className={item} onClick={() => setOpen(false)}>
          {t('account.nav.travelers')}
        </Link>
        <Link role="menuitem" to="/account/searches" className={item} onClick={() => setOpen(false)}>
          {t('account.nav.searches')}
        </Link>
        {bookingEnabled !== false && (
          <Link role="menuitem" to="/trips" className={item} onClick={() => setOpen(false)}>
            {t('trips.title')}
          </Link>
        )}
        {user?.roles.includes('ADMIN') && (
          <Link role="menuitem" to="/admin" className={item} onClick={() => setOpen(false)}>
            {t('admin.title')}
          </Link>
        )}
        <button
          role="menuitem"
          type="button"
          className={`${item} border-t border-border text-danger`}
          onClick={() => {
            setOpen(false);
            signOut();
            void navigate('/');
          }}
        >
          {t('auth.signOut')}
        </button>
      </div>
    </div>
  );
};

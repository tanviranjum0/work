import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { useHealth } from '../../lib/use-health';
import { authErrorMessage, useAuth } from './auth-context';

const field =
  'mt-1 h-12 w-full rounded-control border border-control-border bg-surface px-3 text-body text-fg focus:outline-2 focus:outline-offset-0 focus:outline-primary';

/** Sign in and sign up: the same form with one extra field. */
export const AuthPage = ({ mode }: { mode: 'signin' | 'signup' }) => {
  const { t } = useTranslation();
  const { signIn, signUp, isSignedIn } = useAuth();
  const { data: health } = useHealth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get('next');
  const destination = next?.startsWith('/') && !next.startsWith('//') ? next : '/account';
  if (isSignedIn) return <Navigate to={destination} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(email, password, displayName.trim() || undefined);
      void navigate(destination, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, t(mode === 'signin' ? 'auth.signInFailed' : 'auth.signUpFailed')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="content-width flex flex-1 items-start justify-center py-12">
      <div className="w-full max-w-md rounded-sheet border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-headline font-semibold">
          {t(mode === 'signin' ? 'auth.signInTitle' : 'auth.signUpTitle')}
        </h1>
        <p className="mt-2 text-body-sm text-muted">{t('auth.signInLede')}</p>

        <form onSubmit={(e) => void onSubmit(e)} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-caption font-semibold text-muted">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label htmlFor="displayName" className="block text-caption font-semibold text-muted">
                {t('auth.displayName')}
              </label>
              <input
                id="displayName"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={field}
              />
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-caption font-semibold text-muted">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={mode === 'signup' ? 'password-hint' : undefined}
              className={field}
            />
            {mode === 'signup' && (
              <p id="password-hint" className="mt-1 text-caption text-muted">
                {t('auth.passwordHint')}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" busy={busy}>
            {busy ? t('auth.working') : t(mode === 'signin' ? 'auth.signIn' : 'auth.signUp')}
          </Button>
        </form>

        <p className="mt-6 text-body-sm text-muted">
          {t(mode === 'signin' ? 'auth.noAccount' : 'auth.haveAccount')}{' '}
          <Link
            to={mode === 'signin' ? `/signup${next ? `?next=${encodeURIComponent(next)}` : ''}` : '/signin'}
            className="font-semibold text-primary underline underline-offset-4"
          >
            {t(mode === 'signin' ? 'auth.signUp' : 'auth.signIn')}
          </Link>
        </p>
        {health?.mode === 'demo' && <p className="mt-3 text-caption text-muted">{t('auth.demoNote')}</p>}
      </div>
    </section>
  );
};

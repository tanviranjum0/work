import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <section className="content-width flex flex-1 flex-col justify-center gap-4 py-24">
      <p className="font-display text-headline text-course tabular [font-stretch:118%]">404</p>
      <h1 className="text-headline font-semibold">{t('errors.notFoundTitle')}</h1>
      <p className="measure text-muted">{t('errors.notFoundBody')}</p>
      <Link
        to="/"
        className="w-fit font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
      >
        {t('errors.backHome')}
      </Link>
    </section>
  );
};

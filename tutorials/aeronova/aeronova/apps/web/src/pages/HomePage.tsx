import { useTranslation } from 'react-i18next';
import { CourseLine } from '../components/brand/CourseLine';
import { SearchConsole } from '../features/search/components/SearchConsole';
import { emptyDraft } from '../features/search/search-url';

export const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col">
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <CourseLine className="absolute inset-x-0 bottom-0 -z-10 h-[168px] w-full sm:h-[230px] lg:h-full" />
        <div className="content-width pt-12 pb-[150px] sm:pt-16 sm:pb-[200px] lg:pt-28 lg:pb-40">
          <div className="max-w-[40rem] space-y-6">
            <h1 id="hero-title" className="text-display font-[600] tracking-[-0.01em]">
              {t('home.title')}
            </h1>
            <p className="text-title text-muted">{t('home.lede')}</p>
          </div>
        </div>
      </section>
      <div className="flex-1 bg-surface">
        <div className="content-width pt-2 pb-12">
          <h2 id="search-heading" className="sr-only">
            {t('home.searchHeading')}
          </h2>
          <div className="relative -mt-16 rounded-sheet border border-border bg-surface p-4 shadow-float sm:-mt-20 sm:p-6">
            <SearchConsole initial={emptyDraft()} />
          </div>
        </div>
      </div>
    </div>
  );
};

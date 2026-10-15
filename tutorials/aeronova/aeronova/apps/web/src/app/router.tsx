import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppShell } from '../components/layout/AppShell';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';

/**
 * Feature pages are lazy-loaded as they land (search, flight detail, booking,
 * trips, account, admin) so the landing page stays small.
 */
export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    // Shown only while a lazy route loads on a cold page load.
    hydrateFallbackElement: <div aria-busy="true" className="min-h-dvh bg-bg" />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'flights/:searchId/:offerId',
        lazy: async () => ({
          Component: (await import('../features/flight-detail/FlightDetailPage')).FlightDetailPage,
        }),
      },
      {
        path: 'search',
        lazy: async () => ({
          Component: (await import('../features/search/components/ResultsPage')).ResultsPage,
        }),
      },
      ...(import.meta.env.DEV
        ? [
            {
              path: '_system/design',
              lazy: async () => ({ Component: (await import('../pages/DesignSystemPage')).DesignSystemPage }),
            },
          ]
        : []),
      {
        path: 'signin',
        lazy: async () => {
          const { AuthPage } = await import('../features/auth/AuthPage');
          return { element: <AuthPage mode="signin" /> };
        },
      },
      {
        path: 'signup',
        lazy: async () => {
          const { AuthPage } = await import('../features/auth/AuthPage');
          return { element: <AuthPage mode="signup" /> };
        },
      },
      {
        path: 'book/:searchId/:offerId',
        lazy: async () => ({ Component: (await import('../features/auth/RequireAuth')).RequireAuth }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('../features/booking/CheckoutPage')).CheckoutPage,
            }),
          },
        ],
      },
      {
        path: 'bookings/:reference',
        lazy: async () => ({ Component: (await import('../features/auth/RequireAuth')).RequireAuth }),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('../features/booking/BookingPage')).BookingPage }),
          },
        ],
      },
      {
        path: 'trips',
        lazy: async () => ({ Component: (await import('../features/auth/RequireAuth')).RequireAuth }),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('../features/booking/TripsPage')).TripsPage }),
          },
        ],
      },
      {
        path: 'account',
        lazy: async () => ({ Component: (await import('../features/auth/RequireAuth')).RequireAuth }),
        children: [
          {
            lazy: async () => ({
              Component: (await import('../features/account/AccountLayout')).AccountLayout,
            }),
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('../features/account/ProfilePage')).ProfilePage,
                }),
              },
              {
                path: 'travelers',
                lazy: async () => ({
                  Component: (await import('../features/account/TravelersPage')).TravelersPage,
                }),
              },
              {
                path: 'searches',
                lazy: async () => ({
                  Component: (await import('../features/account/SavedSearchesPage')).SavedSearchesPage,
                }),
              },
            ],
          },
        ],
      },
      {
        path: 'admin',
        lazy: async () => ({ Component: (await import('../features/auth/RequireAuth')).RequireAuth }),
        children: [
          {
            lazy: async () => {
              const { RequireRole } = await import('../features/auth/RequireRole');
              return { Component: () => <RequireRole role="ADMIN" /> };
            },
            children: [
              {
                lazy: async () => ({
                  Component: (await import('../features/admin/AdminLayout')).AdminLayout,
                }),
                children: [
                  {
                    index: true,
                    lazy: async () => ({
                      Component: (await import('../features/admin/AdminOverviewPage')).AdminOverviewPage,
                    }),
                  },
                  {
                    path: 'users',
                    lazy: async () => ({
                      Component: (await import('../features/admin/AdminUsersPage')).AdminUsersPage,
                    }),
                  },
                  {
                    path: 'bookings',
                    lazy: async () => ({
                      Component: (await import('../features/admin/AdminBookingsPage')).AdminBookingsPage,
                    }),
                  },
                  {
                    path: 'bookings/:reference',
                    lazy: async () => ({
                      Component: (await import('../features/admin/AdminBookingDetailPage'))
                        .AdminBookingDetailPage,
                    }),
                  },
                  {
                    path: 'audit-log',
                    lazy: async () => ({
                      Component: (await import('../features/admin/AdminAuditLogPage')).AdminAuditLogPage,
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);

export const routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/tickets-list.component').then(m => m.TicketsListComponent)
    },
    {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-detail.component').then(m => m.TicketDetailComponent)
    },
    {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
    }
];
//# sourceMappingURL=app.routes.js.map
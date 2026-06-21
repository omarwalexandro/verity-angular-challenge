import { Routes } from '@angular/router';
import { stepGuard } from './step.guard';

export const profileRoutes: Routes = [
    {
        path: 'personal',
        loadComponent: () => import('./personal/personal'),
        title: 'Profile • Personal'
    },
    {
        path: 'residential',
        canActivate: [stepGuard(1)],
        loadComponent: () => import('./residential/residential'),
        title: 'Profile • Residential'
    },
    {
        path: 'professional',
        canActivate: [stepGuard(2)],
        loadComponent: () => import('./professional/professional'),
        title: 'Profile • Professional'
    },
    {
        path: 'review',
        canActivate: [stepGuard(3)],
        loadComponent: () => import('./review/review'),
        title: 'Profile • Review'
    },
    {
        path: 'feedback',
        loadComponent: () => import('./feedback/feedback'),
        title: 'Profile • Feedback'
    },
    {
        path: '',
        redirectTo: 'personal',
        pathMatch: 'full'
    }
];

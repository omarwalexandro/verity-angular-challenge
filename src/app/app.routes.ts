import { Routes } from '@angular/router';
import { ProfileStore } from './feat/profile/profile.store';
import { ProfileService } from './feat/profile/profile.service';
import { profileRoutes } from './feat/profile/profile.routes';

export const appRoutes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./feat/home/home'),
        title: 'Angular Challenge • Home'
    },
    {
        path: 'profile/:id',
        providers: [ProfileStore, ProfileService],
        loadComponent: () => import('./feat/profile/profile'),
        children: profileRoutes,
        title: 'Angular Challenge • Profile'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    },
];

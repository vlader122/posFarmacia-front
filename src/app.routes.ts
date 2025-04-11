import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { LoginComponent } from './app/login/login.component';
import { AccesorGuard } from './config/accesor.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'components', loadChildren: () => import('./app/components/components.routes') }
        ],
        canActivate: [AccesorGuard]
    },
    { path: 'notfound', component: Notfound },
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '/notfound' }
];

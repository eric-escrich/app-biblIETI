import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HomeComponent } from './modules/home/home.component';
import { JwtGuard } from './guards/jwt.guard';
import { SearchComponent } from './modules/search/search.component';
import { CreacioUsuariComponent } from './modules/creacio-usuari/creacio-usuari.component';
import { ResetPasswordComponent } from './modules/reset-password-component/reset-password-component.component';

// export const routes: Routes = [
//     {
//         path: 'landing',
//         component: HomeComponent,
//     },
//     { path: 'cercar-llibre', component: SearchComponent },
//     { path: 'itemDetails/:id', component: SearchComponent },
//     { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
//     {
//         path: '',
//         component: LayoutComponent,
//         canActivate: [JwtGuard],
//         children: [
//             { path: '', pathMatch: 'full', component: DashboardComponent },
//             { path: 'creacio-usuari', component: CreacioUsuariComponent },
//         ],
//     },
//     { path: '**', redirectTo: '' },
// ];

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [JwtGuard], // Protege la ruta con el guardia de autenticación
            },
            {
                path: 'creacio-usuari',
                component: CreacioUsuariComponent,
                canActivate: [JwtGuard], // Protege la ruta con el guardia de autenticación
            },
            { path: 'landing', component: HomeComponent },
            { path: 'cercar-llibre', component: SearchComponent },
            { path: 'itemDetails/:id', component: SearchComponent },
            { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
        ],
    },
    { path: '**', redirectTo: 'landing' },

    // Agrega aquí otras rutas que no desciendan de LayoutComponent
];

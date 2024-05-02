import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HomeComponent } from './modules/home/home.component';
import { JwtGuard } from './guards/jwt.guard';
import { SearchComponent } from './modules/search/search.component';
import { CreacioUsuariComponent } from './modules/creacio-usuari/creacio-usuari.component';
import { ResetPasswordComponent } from './modules/reset-password-component/reset-password-component.component';
import { ProfileDataComponent } from './modules/profile-data/profile-data.component';
import { DetallLlibresComponent } from './modules/search/libros/detall-llibres/detall-llibres.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'creacio-usuari',
                component: CreacioUsuariComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'perfil',
                component: ProfileDataComponent,
                canActivate: [JwtGuard],
            },

            { path: 'landing', component: HomeComponent },
            { path: 'cercar-llibre', component: SearchComponent },
            { path: 'itemDetails/:id', component: SearchComponent },
            { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
            { path: 'detall-llibre', component: DetallLlibresComponent },
        ],
    },
    { path: '**', redirectTo: 'landing' }
];

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
import { AdvancedSearchComponent } from './modules/search/advanced-search/advanced-search.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                title: "Panell de control - BIBLIOTECA MARI CARMEN BRITO",
                component: DashboardComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'creacio-usuari',
                title: "Creació d'usuari - BIBLIOTECA MARI CARMEN BRITO",
                component: CreacioUsuariComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'perfil',
                title: "Perfil",
                component: ProfileDataComponent,
                canActivate: [JwtGuard],
            },

            {
                path: 'landing',
                title: "Inici - BIBLIOTECA MARI CARMEN BRITO",
                component: HomeComponent
            },
            {
                path: 'cercar-llibre',
                title: "Cercar article - BIBLIOTECA MARI CARMEN BRITO",
                component: SearchComponent },
            {
                path: 'itemDetails/:id',
                title: "Detall de l'article - BIBLIOTECA MARI CARMEN BRITO",
                component: SearchComponent
            },
            {
                path: 'reset-password/:uid/:token',
                title: "Canviar contrasenya - BIBLIOTECA MARI CARMEN BRITO",
                component: ResetPasswordComponent
            },
            {
                path: 'detall-llibre',
                title: "Detall de l'article - BIBLIOTECA MARI CARMEN BRITO",
                component: DetallLlibresComponent
            },
            {
                path: 'cerca-avancada',
                title: "Cerca avançada - BIBLIOTECA MARI CARMEN BRITO",
                component: AdvancedSearchComponent },
        ],
    },
    { path: '**', redirectTo: 'landing' }
];

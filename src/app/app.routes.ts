import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HomeComponent } from './modules/home/home.component';
import { JwtGuard } from './guards/jwt.guard';
import { SearchComponent } from './modules/search/search.component';
import { CreacioUsuariComponent } from './modules/creacio-usuari/creacio-usuari.component';

export const routes: Routes = [
    {
        path: 'landing',
        component: HomeComponent,
    },
    { path: 'cercar-llibre', component: SearchComponent },
    { path: 'itemDetails/:id', component: SearchComponent },
    // { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [JwtGuard],
        children: [
            { path: '', pathMatch: 'full', component: DashboardComponent },
            { path: 'creacio-usuari', component: CreacioUsuariComponent },
        ],
    },
    { path: '**', redirectTo: '' },
];

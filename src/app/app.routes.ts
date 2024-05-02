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
import { UsersImportComponent } from './modules/users-import/users-import.component';
import { ListUsersComponent } from './modules/list-users/list-users.component';
import { EditUserComponent } from './modules/edit-user/edit-user.component';
import { PrestecComponent } from './modules/prestec/prestec.component';
import { DetallLlibresComponent } from './modules/search/libros/detall-llibres/detall-llibres.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },

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
            {
                path: 'importacio-usuaris',
                component: UsersImportComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'llista-usuaris',
                component: ListUsersComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'editar-usuari/:userID',
                component: EditUserComponent,
                canActivate: [JwtGuard],
            },
            {
                path: 'prestec',
                component: PrestecComponent,
                canActivate: [JwtGuard],
            },
            { path: 'cercar-llibre', component: SearchComponent },
            { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
            { path: 'detall-llibre/:id', component: DetallLlibresComponent },
        ],
    },
    { path: '**', redirectTo: '' },
];

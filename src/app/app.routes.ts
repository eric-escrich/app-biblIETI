import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HomeComponent } from './modules/home/home.component';
import { JwtGuard } from './guards/jwt.guard';
import { CreacioUsuariComponent } from './modules/creacio-usuari/creacio-usuari.component';
import { ResetPasswordComponent } from './modules/reset-password-component/reset-password-component.component';
import { ProfileDataComponent } from './modules/profile-data/profile-data.component';
import { UsersImportComponent } from './modules/users-import/users-import.component';
import { ListUsersComponent } from './modules/list-users/list-users.component';
import { EditUserComponent } from './modules/edit-user/edit-user.component';
import { ItemDetailsComponent } from './modules/item-details/item-details.component';
import { ItemSearchResultsComponent } from './modules/item-search-results/item-search-results.component';
import { AdvancedSearchComponent } from './modules/search/advanced-search/advanced-search.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },

            {
                path: 'dashboard',
                title: 'Panell de control - BIBLIOTECA MARI CARMEN BRITO',
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
                title: 'Perfil',
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
                path: 'editar-usuari/:userId',
                component: EditUserComponent,
                canActivate: [JwtGuard],
            },
            { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
            { path: 'detall-item/:id', component: ItemDetailsComponent },
            { path: 'resultats-cerca', component: ItemSearchResultsComponent },
            { path: 'cerca-avancada', component: AdvancedSearchComponent },
        ],
    },
    { path: '**', redirectTo: '' },
];

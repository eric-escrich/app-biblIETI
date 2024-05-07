import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { Role } from '../../constants/role.code';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { TableModule } from 'primeng/table';
import { RoleService } from '../../services/role.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-list-users',
    standalone: true,
    imports: [RouterModule, CommonModule, TableModule, PaginatorModule],
    templateUrl: './list-users.component.html',
    styleUrl: './list-users.component.css',
})
export class ListUsersComponent {
    private _profileService = inject(ProfileService);
    private _router = inject(Router);
    private _dialogService = inject(DialogService);

    private userId!: number;
    public role!: number;
    public Role = Role;

    allUsers: any = [];
    users: any = [];
    currentPage: number = 1;
    first: number = 0;
    rows: number = 10;

    async ngOnInit() {
        try {
            this.role = await this._profileService.getRole();
        } catch (error) {
            console.error('Error getting role', error);
        }

        if (this.role !== Role.ADMIN && this.role !== Role.BIBLIO) {
            this._router.navigate(['/dashboard']);
            this._dialogService.showDialog('ERROR', 'No tens permisos per accedir a aquesta pàgina');
        } else {
            try {
                this.userId = await this._profileService.getUserID();
                console.log('userId -> ', this.userId);
            } catch (error) {
                console.error('Error getting admin email', error);
            }
            try {
                this.users = await this._profileService.getUsersByUserId(this.userId);
            } catch (error) {
                console.error('Error getting users', error);
            }
        }
    }
}
// async loadPage(page: number) {
//     let customersLastPage = [];
//     let customersNextPage = [];
//     // al pulsar sobre la misma página no se hace nada
//     if (page != 1 && page == this.currentPage) return;
//     // al pulsar sobre la primera página
//     if (page == 1) {
//         // al pulsar sobre la primera página viniendo de una pagina que no es la pagina 2 se almacena la pagina 2
//         if (page != this.currentPage - 1 && page != this.currentPage) {
//             this.allUsers = [];
//             this.users = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page, this.rows);
//             customersNextPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page + 1, this.rows);
//             this.allUsers.push(...customersNextPage);
//             this.currentPage = page;
//             return;
//         }

//         // al volver a la primera página, se almacena la pagina 2
//         if (this.allUsers.length > 0) {
//             this.allUsers.splice(this.rows, this.allUsers.length);
//             this.allUsers.push(...this.users);
//             this.users = this.allUsers.splice(0, this.rows);
//             return;
//         }
//         // al cargar la primera página la primera vez, se almacena la p2
//         this.users = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page, this.rows);
//         customersNextPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page + 1, this.rows);
//         this.allUsers = customersNextPage;
//         this.currentPage = page;
//         return;
//     }
//     // al cargar cualquier pagina sin ser la contigua (excepto la p1) se almacena la pagina anterior, la actual y la siguiente
//     if (page != this.currentPage - 1 && page != this.currentPage && page != this.currentPage + 1) {
//         this.allUsers = [];
//         this.users = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page, this.rows);
//         customersLastPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page - 1, this.rows);
//         customersNextPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page + 1, this.rows);
//         this.allUsers.push(...customersLastPage, ...customersNextPage);

//         // al cargar la pagina contigua (excepto la p1) se almacena la pagina anterior y la siguiente
//     } else {
//         // al cargar la pagina anterior
//         if (page == this.currentPage - 1) {
//             this.allUsers.splice(this.rows, this.allUsers.length);
//             this.allUsers.push(...this.users);
//             this.users = this.allUsers.splice(0, this.rows);
//             customersLastPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page - 1, this.rows);
//             this.allUsers.unshift(...customersLastPage);
//             // al cargar la pagina siguiente se almacena la pagina anterior y la siguiente
//         } else if (page == this.currentPage + 1) {
//             // al cargar la pagina 2 viniendo de la 1 se almacena la p1 y la p3
//             if (page == 2) {
//                 this.allUsers.unshift(...this.users);
//                 this.users = this.allUsers.splice(this.rows, this.allUsers.length);
//                 // al cargar cualquier pagina siguiente se almacena la pagina anterior y la siguiente
//             } else {
//                 this.allUsers.splice(0, this.rows);
//                 this.allUsers.unshift(...this.users);
//                 this.users = this.allUsers.splice(this.rows, this.allUsers.length);
//             }
//             customersNextPage = await this._profileService.getUsersByAdminEmailPaginator(this.userId, page + 1, this.rows);
//             this.allUsers.push(...customersNextPage);
//         }
//     }
//     console.log('usersActualPage -> ', this.users);
//     console.log('allUsers -> ', this.allUsers);
// }

// onPageChange(event: any) {
//     console.log('fwefdsf');

//     this.first = event.first;
//     this.rows = event.rows;

//     let newPage = Math.floor(this.first / this.rows) + 1;

//     this.loadPage(newPage);
//     this.currentPage = newPage;
// }
// }

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { Role } from '../../constants/role.code';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-list-users',
    standalone: true,
    imports: [RouterModule, CommonModule, TableModule],
    templateUrl: './list-users.component.html',
    styleUrl: './list-users.component.css',
})
export class ListUsersComponent {
    private _profileService = inject(ProfileService);
    private _router = inject(Router);
    private _dialogService = inject(DialogService);

    users: any[] = [];
    private adminEmail: string = '';
    public role!: number;
    public Role = Role;

    async ngOnInit() {
        console.log('ListUsersComponent');

        try {
            this.role = await this._profileService.getRole();
        } catch (error) {
            console.error('Error getting role', error);
        }
        console.log('role', this.role);

        if (this.role !== Role.ADMIN && this.role !== Role.BIBLIO) {
            this._router.navigate(['/dashboard']);
            this._dialogService.showDialog('ERROR', 'No tens permisos per accedir a aquesta pàgina');
        } else {
            try {
                this.adminEmail = await this._profileService.getEmail();
                console.log('adminEmail', this.adminEmail);
            } catch (error) {
                console.error('Error getting admin email', error);
            }
            try {
                const usersData = await this._profileService.getUsersByAdminEmail(this.adminEmail);
                this.users = usersData;
                console.log('users----------->', this.users);
            } catch (error) {
                console.error('Error getting users', error);
            }
        }
    }
}

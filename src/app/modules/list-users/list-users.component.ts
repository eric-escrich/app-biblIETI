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
        this.role = await this._profileService.getRole();

        if (this.role !== Role.ADMIN && this.role !== Role.BIBLIO) {
            this._router.navigate(['/dashboard']);
            this._dialogService.showDialog('ERROR', 'No tens permisos per accedir a aquesta pàgina');
        } else {
            this.adminEmail = await this._profileService.getEmail();
            const usersData = await this._profileService.getUsersByAdminEmail(this.adminEmail);

            this.users = usersData.user_profiles;
        }
    }
}

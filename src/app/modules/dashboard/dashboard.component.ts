import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../services/profile.service';
import { DialogService } from '../../services/dialog.service';
import { AuthService } from '../../core/auth/auth.service';
import { PasswordModule } from 'primeng/password';
import { LogService } from '../../services/log.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
                ButtonModule,
                AvatarModule,
                AvatarGroupModule,
                InputTextModule,
                PasswordModule,
                FormsModule,
                FileUploadModule,
                RouterLink
            ],
    providers: [MessageService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    _profileService = inject(ProfileService);
    _dialogService = inject(DialogService);
    _authService = inject(AuthService);
    _logService = inject(LogService);

    profileData: any;
    originalProfileData: any;
    role: any;
    roleName: string = '';
    initials: string = '';

    isEditingName = false;
    isEditingEmail = false;
    isEditingPassword = false;

    newName!: string;
    newSurname!: string;
    newSurname2!: string;
    newEmail!: string;
    lastPassword!: string;
    password!: string;
    repeatPassword!: string;

    async ngOnInit() {
        this._logService.logInfo('Inicialitzant DashboardComponent', 'DashboardComponent - ngOnInit() | Inicialitzant DashboardComponent');
        this.profileData = await this._profileService.getSelfProfileDataWithoutLoading();
        this._logService.logInfo(
            'Dades de perfil',
            `DashboardComponent - ngOnInit() | Dades de perfil obtinguts: ${JSON.stringify(this.profileData)}`,
        );

        await this.setDefaultData();

        this.role = await this._profileService.getRole();
        this._logService.logInfo('Rol obtingut', `DashboardComponent - ngOnInit() | Rol obtingut: ${this.role}`);
        this.roleName = this.getRoleName();
        this.initials = this.getInitials();
    }

    getRoleName() {
        if (this.role === 1) return 'Administrador';
        if (this.role === 2) return 'Professor';
        if (this.role === 3) return 'Alumne';
        if (this.role === 4) return 'Bibliotecària';
        this._logService.logWarning('Rol desconegut', `DashboardComponent - getRoleName | Rol desconegut: ${this.role}`);
        return '';
    }

    getInitials() {
        if (this.profileData && this.profileData.name && this.profileData.surname) {
            let initials = this.profileData.name[0].toUpperCase() + this.profileData.surname[0].toUpperCase();
            this._logService.logInfo('Inicials obtingudes', `DashboardComponent - getInitials() | Inicials obtingudes: ${initials}`);
            return initials;
        }
        this._logService.logWarning(
            'Faltan datos de perfil',
            "DashboardComponent - getInitials() | No s'ha pogut obtenir les inicials, falten dades de perfil.",
        );
        return '';
    }

    async cancelChanges() {
        await this.setDefaultData();
        this.isEditingName = false;
        this.isEditingEmail = false;
        this.isEditingPassword = false;
        this._logService.logInfo(
            'Cancel·lant canvis',
            "DashboardComponent - cancelChanges() | L'usuari ha cancel·lat la modificació de dades o s'han actualizat les dades correctament.",
        );
    }

    async setDefaultData() {
        if (!this.profileData) await this._profileService.getSelfProfileDataWithoutLoading();
        this.newName = this.profileData.name;
        this.newSurname = this.profileData.surname;
        this.newSurname2 = this.profileData.surname2;
        this.newEmail = this.profileData.username;
        this.lastPassword = '';
        this.password = '';
        this.repeatPassword = '';
    }

    async saveChanges() {
        if (this.lastPassword || this.password || this.repeatPassword) {
            await this.updatePassword();
            this._logService.logInfo("Modificació contrasenya", "DashboardComponent - saveChanges() | L'usuari ha actualizat la contrasenya.");
        }

        let updateData: any = {};
        updateData['username'] = this.profileData.username;

        if (this.newName != this.profileData.name) {
            updateData['first_name'] = this.newName;
        }
        if (this.newSurname != this.profileData.surname) {
            updateData['last_name'] = this.newSurname;
        }
        if (this.newSurname2 != this.profileData.surname2) {
            updateData['second_last_name'] = this.newSurname2;
        }
        if (this.newEmail != this.profileData.username) {
            updateData['email'] = this.newEmail;
        }

        if (Object.keys(updateData).length > 0) {
            try {
                await this._profileService.updateProfile(updateData);
                this._logService.logInfo(
                    "Modificació dades d'usuari",
                    "DashboardComponent - saveChanges() | L'usuari ha editat les seves dades de perfil: ${JSON.stringify(updateData)}",
                );

                // Actualizar la interfaz de usuario con los nuevos valores
                this.profileData = {
                    ...this.profileData,
                    name: this.newName,
                    surname: this.newSurname,
                    surname2: this.newSurname2,
                    username: this.newEmail,
                };

                await this.cancelChanges();

                this._dialogService.showDialog('INFORMACIÓ', 'Perfil actualitzat correctament');
            } catch (error: any) {
                this._logService.logError(
                    "ERROR: modificació dades d'usuari",
                    "DashboardComponent - saveChanges | Error a l'actualizar el perfil: ${error}",
                );
                console.error('Error updating profile:', error);
                this._dialogService.showDialog('ERROR', 'Error actualitzant el perfil');
            }
        }
    }

    async updatePassword() {
        this._logService.logInfo("Actualitzant contrasenya", "DashboardComponent - updatePassword() | L'usuari va a modificar la seva contrasenya.");
        try {
            const response = await this._authService.isValidPassword(this.profileData.username, this.lastPassword);
            if (response) {
                if (this.password.length < 8 || this.repeatPassword.length < 8) {
                    this._logService.logWarning(
                        'Llargària contrasenya',
                        'DashboardComponent - updatePassword() | La contrasenya ha de tenir al menys 8 caràcters.',
                    );
                    this._dialogService.showDialog('ERROR', 'La contrasenya ha de tenir com a mínim 8 caràcters');
                } else if (this.password === this.repeatPassword) {
                    await this._authService.saveNewPassword(this.profileData.username, this.password);
                    this._dialogService.showDialog('INFORMACIÓ', "S'ha actualitzat la contrasenya correctament");
                } else {
                    this._logService.logWarning('Contrasenyes no coincideixen', 'DashboardComponent - updatePassword() | Les contrasenyes no coincideixen.');
                    this._dialogService.showDialog('ERROR', 'Les contrasenyes no coincideixen');
                }
            } else {
                this._logService.logError(
                    'Contrasenya incorrecta',
                    "DashboardComponent - updatePassword() | L'usuari ha introduït incorrectament la seva contrasenya actual.",
                );
                throw new Error('Contrasenya incorrecta');
            }
        } catch (error: any) {
            this._logService.logFatal(
                "Error a l'actualizar la contrasenya",
                "DashboardComponent - updatePassword() | Error a l'actualizar la contrasenya: ${error.message}",
            );
            this._dialogService.showDialog('ERROR', error.message);
        }
    }

    logout() {
        this._logService.logInfo('Tancant sessió', "DashboardComponent - logout() | L'usuari ${this.profileData.username} ha tancat sessió.");
        this._profileService.logout();
    }

    // FILE UPLOAD
    constructor(private messageService: MessageService) {}
}
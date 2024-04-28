import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';

import { ProfileService } from '../../services/profile.service';
import { DialogService } from '../../services/dialog.service';
import { AuthService } from '../../core/auth/auth.service';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../services/log.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ButtonModule, AvatarModule, AvatarGroupModule, InputTextModule, PasswordModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    _profileService = inject(ProfileService);
    _dialogService = inject(DialogService);
    _authService = inject(AuthService);
    _logService = inject(LogService);

    profileData: any;
    email: string = '';
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
        this._logService.logInfo('Initializing DashboardComponent', 'Inicializando DashboardComponent', 'DashboardComponent - ngOnInit()');
        this.profileData = await this._profileService.getSelfProfileDataWithoutLoading();
        this.email = this.profileData.username;

        this._logService.logInfo('Profile data', `Datos de perfil obtenidos`, 'DashboardComponent - ngOnInit()', this.email);

        await this.setDefaultData();

        this.role = await this._profileService.getRole();
        this._logService.logInfo('Rol get', `Rol obtenido: ${this.role}`, 'DashboardComponent - ngOnInit()', this.email);
        this.roleName = this.getRoleName();
        this.initials = this.getInitials();
    }

    getRoleName() {
        if (this.role === 1) return 'Administrador';
        if (this.role === 2) return 'Professor';
        if (this.role === 3) return 'Alumne';
        if (this.role === 4) return 'Bibliotecària';
        this._logService.logWarning('Rol ', `Unknown role: ${this.role}`, 'DashboardComponent - getRoleName()', this.email);
        return '';
    }

    getInitials() {
        if (this.profileData && this.profileData.name && this.profileData.surname) {
            let initials = this.profileData.name[0].toUpperCase() + this.profileData.surname[0].toUpperCase();
            this._logService.logInfo('Initials get', `Iniciales obtenidas: ${initials}`, 'DashboardComponent - getInitials()', this.email);
            return initials;
        }
        this._logService.logWarning(
            'Profile data missing',
            'No se pudieron obtener las iniciales, faltan datos de perfil',
            'DashboardComponent - getInitials()',
            this.email,
        );
        return '';
    }

    async cancelChanges() {
        await this.setDefaultData();
        this.isEditingName = false;
        this.isEditingEmail = false;
        this.isEditingPassword = false;
        this._logService.logInfo(
            'Canceling changes',
            'El usuario ha cancelado la modificación de datos o se han actualizado los datos correctamente',
            'DashboardComponent - cancelChanges()',
            this.email,
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
            this._logService.logInfo(
                'Updating password',
                'El usuario ha actualizado la contraseña',
                'DashboardComponent - saveChanges()',
                this.email,
            );
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
                    'Updating profile',
                    `El usuario ha editado sus datos de perfil`,
                    'DashboardComponent - saveChanges()',
                    this.email,
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
                    'Error updating profile',
                    `Error al actualizar el perfil: ${error}`,
                    'DashboardComponent - saveChanges()',
                    this.email,
                );
                console.error('Error updating profile:', error);
                this._dialogService.showDialog('ERROR', 'Error actualitzant el perfil');
            }
        }
    }

    async updatePassword() {
        this._logService.logInfo('Updating password', 'El usuario va a modificar su contraseña', 'DashboardComponent - updatePassword()', this.email);
        try {
            const response = await this._authService.isValidPassword(this.profileData.username, this.lastPassword);
            if (response) {
                if (this.password.length < 8 || this.repeatPassword.length < 8) {
                    this._logService.logWarning(
                        'Wrong password length',
                        'La contraseña debe tener al menos 8 caracteres',
                        'DashboardComponent - updatePassword()',
                        this.email,
                    );
                    this._dialogService.showDialog('ERROR', 'La contrasenya ha de tenir com a mínim 8 caràcters');
                } else if (this.password === this.repeatPassword) {
                    await this._authService.saveNewPassword(this.profileData.username, this.password);
                    this._dialogService.showDialog('INFORMACIÓ', "S'ha actualitzat la contrasenya correctament");
                } else {
                    this._logService.logWarning(
                        'Passwords do not match',
                        'Las contraseñas no coinciden',
                        'DashboardComponent - updatePassword()',
                        this.email,
                    );
                    this._dialogService.showDialog('ERROR', 'Les contrasenyes no coincideixen');
                }
            } else {
                this._logService.logError(
                    'Incorrect password',
                    'El usuario ha introducido incorrectamente su contraseña actual',
                    'DashboardComponent - updatePassword()',
                    this.email,
                );
                throw new Error('Contrasenya incorrecta');
            }
        } catch (error: any) {
            this._logService.logFatal(
                'Error updating password',
                `Error al actualizar la contraseña: ${error.message}`,
                'DashboardComponent - updatePassword()',
                this.email,
            );
            this._dialogService.showDialog('ERROR', error.message);
        }
    }

    logout() {
        this._profileService.logout();
    }
}

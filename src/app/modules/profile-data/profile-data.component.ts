import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { LogService } from '../../services/log.service';
import { DialogService } from '../../services/dialog.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/auth/auth.service';
import { PasswordModule } from 'primeng/password';
import { environment } from '../../../environments/environment';
import { Role } from '../../constants/role.code';

@Component({
    selector: 'app-profile-data',
    standalone: true,
    imports: [
        CommonModule,
        GalleriaModule,
        FileUploadModule,
        ButtonModule,
        AvatarModule,
        AvatarGroupModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        FileUploadModule,
        RouterLink,
    ],
    templateUrl: './profile-data.component.html',
    styleUrl: './profile-data.component.css',
})
export class ProfileDataComponent {
    _profileService = inject(ProfileService);
    _logService = inject(LogService);
    _dialogService = inject(DialogService);
    _authService = inject(AuthService);

    public profileData: any;
    private email!: string;
    public file!: any;
    profileImage = '';
    public role!: any;

    Role = Role;

    async ngOnInit() {
        this._logService.logInfo('Initializing DashboardComponent', 'Inicializando DashboardComponent', 'DashboardComponent - ngOnInit()');
        this.profileData = await this._profileService.getSelfProfileDataWithoutLoading();
        this._logService.logInfo('Profile data', `Datos de perfil obtenidos`, 'ProfileDataComponent - ngOnInit()', this.profileData.email);

        this.role = await this._profileService.getRole();
        console.log('Role:', this.role);

        this.email = this.profileData.email;

        this._logService.logInfo('Profile data', `Datos de perfil obtenidos`, 'DashboardComponent - ngOnInit()', this.email);

        await this.setDefaultData();

        this.role = await this._profileService.getRole();
        this._logService.logInfo('Rol get', `Rol obtenido: ${this.role}`, 'DashboardComponent - ngOnInit()', this.email);
        this.roleName = this.getRoleName();

        await this.getProfileImage();
    }

    async getProfileImage() {
        try {
            const response = await this._profileService.getUserImage(this.profileData.id);
            console.log('Response:', response);

            const imageBlob = response.body;

            if (imageBlob instanceof Blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.file = reader.result;
                    this.profileImage = this.file;
                };
                reader.readAsDataURL(imageBlob);
                this._logService.logInfo(
                    'Profile image obtained',
                    'Imatge de perfil obtinguda',
                    'ProfileDataComponent - getProfileImage()',
                    this.profileData.email,
                );
            } else {
                throw new Error('La respuesta no es un blob');
            }
        } catch (error: any) {
            console.log('Error getting profile image:', error.message);

            this._logService.logError(
                'Error getting profile image',
                `Error obtenint la imatge de perfil: ${error.message}`,
                'ProfileDataComponent - getProfileImage()',
                this.profileData.email,
            );
            this._dialogService.showDialog('ERROR', 'Error obtenint la imatge de perfil');
        }
    }

    async uploadProfileImage(file: File) {
        try {
            const response = await this._profileService.updateImage(this.email, file);
            console.log('Response:', response);

            this._dialogService.showDialog('INFORMACIÓ', 'Imatge de perfil actualitzada correctament');
        } catch (error: any) {
            this._dialogService.showDialog('ERROR', 'Error actualitzant la imatge de perfil');
        }
    }

    async onFileSelected(event: any) {
        const file: File = event.target.files[0];

        // Comprobar el tamaño del archivo
        const fileSizeInMB = file.size / (1024 * 1024);
        const maxSizeInMB = 10;

        if (fileSizeInMB > maxSizeInMB) {
            this._dialogService.showDialog('AVÍS', `L'arxiu es massa gran. La mida màxima permesa és de ${maxSizeInMB}MB.`);
            this._logService.logWarning(
                'File too big',
                `L'arxiu es massa gran. La mida màxima permesa és de ${maxSizeInMB}MB.`,
                'ProfileDataComponent - onFileSelected()',
                this.email,
            );
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.profileImage = e.target.result;
        };

        reader.readAsDataURL(file);

        await this.uploadProfileImage(file);
    }

    environment = environment;
    originalProfileData: any;
    // role: any;
    roleName: string = '';
    initials: string = '';

    isEditing = false;

    newName!: string;
    newSurname!: string;
    newSurname2!: string;
    newEmail!: string;
    lastPassword!: string;
    password!: string;
    repeatPassword!: string;

    getRoleName() {
        if (this.role === 1) return 'Administrador';
        if (this.role === 2) return 'Bibliotecari';
        if (this.role === 3) return 'Usuari';
        this._logService.logWarning('Rol ', `Unknown role: ${this.role}`, 'DashboardComponent - getRoleName()', this.email);
        return '';
    }

    async cancelChanges() {
        await this.setDefaultData();
        this.isEditing = false;
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
        this.newEmail = this.profileData.email;
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

        updateData['email_user'] = this.profileData.email;

        if (this.newName != this.profileData.name) {
            updateData['first_name'] = this.newName;
        }
        if (this.newSurname != this.profileData.surname) {
            updateData['last_name'] = this.newSurname;
        }
        if (this.newSurname2 != this.profileData.surname2) {
            updateData['second_last_name'] = this.newSurname2;
        }
        if (this.newEmail != this.profileData.email) {
            updateData['email_change'] = this.newEmail;
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

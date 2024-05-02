import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { LogService } from '../../services/log.service';
import { DialogService } from '../../services/dialog.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-profile-data',
    standalone: true,
    imports: [CommonModule, GalleriaModule, FileUploadModule],
    templateUrl: './profile-data.component.html',
    styleUrl: './profile-data.component.css',
})
export class ProfileDataComponent {
    _profileService = inject(ProfileService);
    _logService = inject(LogService);
    _dialogService = inject(DialogService);

    public profileData: any;
    private email!: string;
    public file!: any;
    profileImage = '';
    public role!: any;

    async ngOnInit() {
        this._logService.logInfo('Initializing ProfileDataComponent', 'Inicializando ProfileDataComponent', 'ProfileDataComponent - ngOnInit()');

        this.profileData = await this._profileService.getSelfProfileDataWithoutLoading();
        this._logService.logInfo('Profile data', `Datos de perfil obtenidos`, 'ProfileDataComponent - ngOnInit()', this.profileData.email);

        this.role = await this._profileService.getRole();
        console.log('Role:', this.role);

        this.email = this.profileData.email;
        console.log('Profile data:', this.profileData);

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
}

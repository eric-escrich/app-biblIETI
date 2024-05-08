import { Injectable, inject } from '@angular/core';
import { Role } from '../constants/role.code';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { LogService } from './log.service';
import { DialogService } from './dialog.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private _router = inject(Router);
    private _storageService = inject(StorageService);
    private _logService = inject(LogService);
    private _dialogService = inject(DialogService);

    private baseUrl: string = environment.apiUrl;
    selfProfileData: any;

    constructor(private http: HttpClient) {}

    async getSelfProfileData() {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/user/userDetails/`, {
                    observe: 'response',
                }),
            );

            if (response.status === 200) {
                this.selfProfileData = response.body;
                return this.selfProfileData;
            }
        } catch (error: any) {
            console.log('Error al obtener el profileData: ', error);
            this._logService.logError(
                'Error getting profileData',
                `Error al obtener el profileData, Error: ${error.error.error}`,
                'ProfileService - getSelfProfileData',
            );
            this.logout();
            throw error;
        }
    }

    async getSelfProfileDataWithoutLoading() {
        if (this.selfProfileData) return this.selfProfileData;
        else if (this._storageService.getItem('profile')) {
            this.selfProfileData = JSON.parse(this._storageService.getItem('profile')!);
            return this.selfProfileData;
        } else {
            return await this.getSelfProfileData();
        }
    }

    getSelfProfileDataFromCache() {
        if (this.selfProfileData) return this.selfProfileData;
        else if (this._storageService.getItem('profile')) {
            this.selfProfileData = JSON.parse(this._storageService.getItem('profile')!);
            return this.selfProfileData;
        } else {
            return null;
        }
    }

    async getRole() {
        if (!this.selfProfileData) await this.getSelfProfileData();
        return this.selfProfileData.role;
    }

    async getEmail() {
        if (!this.selfProfileData) await this.getSelfProfileData();
        return this.selfProfileData.email;
    }

    async getUserID() {
        if (!this.selfProfileData) await this.getSelfProfileData();
        return this.selfProfileData.id;
    }

    async updateProfile(data: any) {
        try {
            const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/user/update/`, data));

            return response;
        } catch (error: any) {
            console.error('Error updating profile data', error);
            throw error;
        }
    }

    async getUsername() {
        if (!this.selfProfileData) await this.getSelfProfileData();
        return this.selfProfileData.username;
    }

    async getUserImage(id: number) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/user/get_image/${id}`, { observe: 'response', responseType: 'blob' }),
            );
            this._logService.logInfo('Getting user image', `Obteniendo la imagen del usuario con id: ${id}`, 'ProfileService - getUserImage');
            return response;
        } catch (error: any) {
            console.error('Error getting user image', error);
            this._logService.logError(
                'Error getting user image',
                `Error al obtener la imagen del usuario con id: ${id}, Error: ${error.error.error}`,
                'ProfileService - getUserImage',
            );
            throw error;
        }
    }

    async updateImage(email: string, file: File) {
        try {
            const imageData = await this.fileToBase64(file);
            const response: any = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}/user/change-photo/`,
                    {
                        email: email,
                        image_data: imageData,
                    },
                    { observe: 'response' },
                ),
            );
            this._logService.logInfo(
                'Updating profile image',
                'El usuario ha actualizado su imagen de perfil',
                'ProfileService - updateImage',
                email,
            );
            return response;
        } catch (error: any) {
            console.error('Error updating profile image', error);
            this._logService.logError(
                'Error updating profile image',
                `Error al actualizar la imagen de perfil: ${error}`,
                'ProfileService - updateImage',
                email,
            );
            throw error;
        }
    }

    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    async logout() {
        let mail = '';
        if (this._storageService.getItem('token') != null && this.selfProfileData != null) {
            mail = await this.getEmail();
        }
        this._storageService.removeItem('token');
        this._logService.logInfo('Token delete', 'Se ha eliminado el token del localStorage', 'ProfileService - logout', mail);

        this._storageService.removeItem('refresh');
        this._logService.logInfo('Token refresh delete', 'Se ha eliminado el token refresh del localStorage', 'ProfileService - logout', mail);

        this.selfProfileData = null;
        this._logService.logInfo('User data delete', 'Se ha seteado la variable selfProfileData en null', 'ProfileService - logout', mail);

        this._storageService.removeItem('profile');
        this._logService.logInfo('Profile cache delete', 'Se ha eliminado el profile del localstorage', 'ProfileService - logout', mail);

        this._logService.logInfo('Redirect landing', 'Redirigiendo a la página de inicio', 'ProfileService - logout');

        this._dialogService.showDialog('INFORMACIÓ', 'Sesió tancada correctament');
        this._router.navigateByUrl('/');
    }

    async getUsersByAdminEmail(adminEmail: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}/user/show-users/`,
                    { email_admin: adminEmail },
                    {
                        observe: 'response',
                    },
                ),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error getting users by center id', error);
            throw error;
        }
    }

    async getUserProfileDataById(userId: number) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/user/get-data/${userId}`, {
                    observe: 'response',
                }),
            );
            console.log(response);

            if (response.status === 200) {
                this._logService.logInfo(
                    'Getting user data',
                    `Se han obtenido los datos del usuario con id: ${userId}`,
                    'ProfileService - getUserProfileDataById',
                    this.selfProfileData.email,
                );
                return response.body;
            } else {
                this._logService.logError(
                    'Error getting user data',
                    `Error al obtener los datos del usuario con id: ${userId}`,
                    'ProfileService - getUserProfileDataById',
                    this.selfProfileData.email,
                );
                throw new Error('Error fetching user data');
            }
        } catch (error: any) {
            console.log('Error getting user data', error);

            this._logService.logError(
                'ERROR getting user DataTransfer',
                `Error al obtener los datos del usuario con id: ${userId}, Error: ${error.error.error}`,
                'ProfileService - getUserProfileDataById',
                this.selfProfileData.email,
            );
            this.logout();
            throw error;
        }
    }

    async updateUserDataByAdmin(adminEmail: string, userEmail: string, data: any) {
        try {
            console.log('data', data);

            const response: any = await firstValueFrom(
                this.http.post(`${this.baseUrl}/user/change-data-admin/`, {
                    email_admin: adminEmail,
                    email_user: userEmail,
                    user_change: data,
                }),
            );
            this._logService.logInfo(
                'Updating user data by admin',
                `Se han actualizado los datos del usuario con email ${userEmail}`,
                'ProfileService - updateUserDataByAdmin',
                adminEmail,
            );
            return response;
        } catch (error: any) {
            this._logService.logError(
                'Error updating user data by admin',
                `Error al actualizar los datos del usuario con email ${userEmail}. Error: ${error.error.error}`,
                'ProfileService - updateUserDataByAdmin',
                adminEmail,
            );
            console.error('Error updating profile data', error);
            throw error;
        }
    }

    async searchUsers(email: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/user/search/${email}`, {
                    observe: 'response',
                }),
            );
            console.log('emails --->', response.body);

            return response.body;
        } catch (error: any) {
            console.error('Error fetching items', error);
            throw error;
        }
    }
}

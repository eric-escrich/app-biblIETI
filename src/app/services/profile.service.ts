import { Injectable, inject } from '@angular/core';
import { Role } from '../constants/role.code';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { LogService } from './log.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private _router = inject(Router);
    private _storageService = inject(StorageService);
    private _logService = inject(LogService);

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

            this.selfProfileData = response.body;
            return this.selfProfileData;
        } catch (error: any) {
            this.logout();
            throw error;
        }
    }

    async getSelfProfileDataWithoutLoading() {
        if (!this.selfProfileData) await this.getSelfProfileData();
        return this.selfProfileData;
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
            const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/user/update/`, { data: data }));

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

    async logout() {
        if (this._storageService.getItem('token') != null && this.selfProfileData != null) {
            let mail = await this.getEmail();
            this._storageService.removeItem('token');
            this._logService.logInfo('Token delete', 'Se ha eliminado el token del localStorage', 'ProfileService - logout', mail);
            this._storageService.removeItem('refresh');
            this._logService.logInfo('Token refresh delete', 'Se ha eliminado el token refresh del localStorage', 'ProfileService - logout', mail);
            this.selfProfileData = null;
            this._logService.logInfo('User data delete', 'Se ha seteado la variable selfProfileData en null', 'ProfileService - logout', mail);
            this._logService.logInfo('Redirect landing', 'Redirigiendo a la página de inicio', 'ProfileService - logout');
            this._router.navigateByUrl('/landing');
        } else {
            this._storageService.removeItem('token');
            this._logService.logInfo('Token delete', 'Se ha eliminado el token del localStorage', 'ProfileService - logout');
            this._storageService.removeItem('refresh');
            this._logService.logInfo('Token refresh delete', 'Se ha eliminado el token refresh del localStorage', 'ProfileService - logout');
            this.selfProfileData = null;
            this._logService.logInfo('User data delete', 'Se ha seteado la variable selfProfileData en null', 'ProfileService - logout');
            this._logService.logInfo('Redirect landing', 'Redirigiendo a la página de inicio', 'ProfileService - logout');
            this._router.navigateByUrl('/landing');
        }
    }
}

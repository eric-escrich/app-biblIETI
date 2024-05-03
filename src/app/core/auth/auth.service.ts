import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { LogService } from '../../services/log.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _http = inject(HttpClient);
    private _storage = inject(StorageService);
    private _router = inject(Router);
    private _profileService = inject(ProfileService);
    private _logService = inject(LogService);

    private baseUrl: string = environment.apiUrl;

    async login(username: string, password: string) {
        const body = { username: username, password: password };

        try {
            let response: any = await firstValueFrom(
                this._http.post(`${this.baseUrl}/auth/login/`, body, {
                    observe: 'response',
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );

            this._storage.setItem('token', response.body.token.access);
            this._storage.setItem('refresh', response.body.token.refresh);
            return response;
        } catch (error: any) {
            if (error.status === 401) {
                throw new Error('Contrasenya incorrecta');
            } else {
                console.error('Error during password validation', error);
                throw error;
            }
        }
    }

    async validateToken(): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this._http.get(`${this.baseUrl}/auth/verify/`, {
                    observe: 'response',
                }),
            );
            return response ? true : false;
        } catch (error: any) {
            console.error('Error during token validation', error);
            return false;
        }
    }

    getToken() {
        return this._storage.getItem('token') || '';
    }

    async refreshToken() {
        const refreshToken = this._storage.getItem('refresh');
        if (!refreshToken) {
            this._router.navigate(['/login']);
            return;
        }
        try {
            let response: any = await firstValueFrom(this._http.post(`${this.baseUrl}/auth/refresh/`, { refreshToken: refreshToken }));
            if (!response.token) {
                throw new Error('Token is undefined or null');
            }
            this._storage.setItem('token', response.token);
        } catch (error: any) {
            console.error('Error during token refresh', error);
            throw error;
        }
    }

    async isValidPassword(email: string, password: string) {
        try {
            let response: any = await firstValueFrom(this._http.post(`${this.baseUrl}/auth/verify-password/`, { email: email, password: password }));
            return response.isValid;
        } catch (error: any) {
            if (error.status === 401) {
                throw new Error('Contrasenya incorrecta');
            } else {
                console.error('Error during password validation', error);
                throw error;
            }
        }
    }

    async saveNewPassword(email: string, password: string) {
        try {
            let response: any = await firstValueFrom(this._http.post(`${this.baseUrl}/auth/save-password/`, { email: email, password: password }));
            return response;
        } catch (error: any) {
            console.error('Error during password saving', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email: string) {
        try {
            let response: any = await firstValueFrom(this._http.post(`${this.baseUrl}/auth/send-mail/`, { email: email }, { observe: 'response' }));
            console.log('Response', response);

            return response;
        } catch (error: any) {
            console.error('Error sending password reset email', error);
            throw error;
        }
    }

    async resetPassword(newPassword: string, uid: string, token: string) {
        let response: any = await firstValueFrom(
            this._http.post(`${this.baseUrl}/auth/reset-password/`, { newPassword: newPassword, uid: uid, token: token }, { observe: 'response' }),
        );
        return response;
    }

    async registerUser(
        email_admin: string,
        username: string,
        name: string,
        surname: string,
        surname2: string,
        dni: string,
        phone: string,
        birth: string,
        cycle: string,
        email: string,
        password: string,
    ) {
        try {
            const response: any = await firstValueFrom(
                this._http.post(
                    `${this.baseUrl}/auth/create-user/`,
                    { email_admin, username, name, surname, surname2, dni, phone, birth, cycle, email, password },
                    { observe: 'response' },
                ),
            );

            console.log('response --> ', response);

            if (response.status === 201) {
                return response.body;
            } else {
                throw new Error("Error al registrar l'usuari");
            }
        } catch (error: any) {
            console.error('Error registering user', error);
            if (
                error.error &&
                error.error.error &&
                error.error.error.includes('Duplicate entry') &&
                error.error.error.includes('auth_user.username')
            ) {
                this._logService.logError(
                    'Error creating user',
                    'El nombre de usuario ya existe. Por favor, elige otro',
                    'AuthService - registerUser',
                    email_admin,
                );
                throw new Error("El nom d'usuari ja existeix. Si us plau, escull un altre.");
            }
            throw error;
        }
    }

    async checkUserExists(username: string, email: string): Promise<{ username_exists: boolean; email_exists: boolean }> {
        try {
            const response: any = await firstValueFrom(
                this._http.get(`${this.baseUrl}/auth/check-user-exists/`, {
                    params: {
                        username: username,
                        email: email,
                    },
                }),
            );
            this._logService.logInfo(
                'checkUserExists results',
                `Los resultados de la comprovacion de si el usuario existe son: ${JSON.stringify(response)}`,
                'AuthService - checkUserExists',
            );
            return response;
        } catch (error: any) {
            this._logService.logInfo(
                'Error checkin if user exists',
                `Ha ocurrido un error mientras se comprobaba si el usuario existe: ${error.message}`,
                'AuthService - checkUserExists',
            );
            console.error('Error checking if user exists', error);
            throw error;
        }
    }

    async uploadUsers(users: any) {
        try {
            const response: any = await firstValueFrom(
                this._http.post(`${this.baseUrl}/user/save-users-csv/`, users, {
                    observe: 'response',
                }),
            );
            return response;
        } catch (error: any) {
            console.error('Error uploading users', error);
            throw error;
        }
    }
}

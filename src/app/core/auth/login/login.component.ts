import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';

import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../auth.service';
import { ProfileService } from '../../../services/profile.service';
import { DialogService } from '../../../services/dialog.service';
import { DialogModule } from 'primeng/dialog';
import { LogService } from '../../../services/log.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, PasswordModule, ButtonModule, InputTextModule, ReactiveFormsModule, DialogModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    private _authService = inject(AuthService);
    private _router = inject(Router);
    private _profileService = inject(ProfileService);
    private _logService = inject(LogService);
    private _dialogService = inject(DialogService);

    public username: string = '';
    public password: string = '';

    public invalidLogin: boolean = false;
    public loginErrorMessage: string = "L'usuari o la contrasenya són incorrectes.";

    // Forget password
    public email: string = '';
    @Input() popupVisible: boolean = false;

    public invalidEmail = false;
    public mailErrorMessage: string = '';

    passwordValidator(password: string) {
        if (password.length < 8) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password too short',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy corta',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (password.length > 16) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password too long',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy larga',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password missing uppercase',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin mayúsculas',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[a-z]/.test(password)) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password missing lowercase',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin minúsculas',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/\d/.test(password)) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password missing number',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin números',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[!@#$%^&*()-_=+[\]{};:'",.<>/?\\|~]/.test(password)) {
            this.invalidLogin = true;
            this._logService.logWarning(
                'Password missing special character',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin caracteres especiales',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        this.invalidLogin = false;
        return true;
    }

    async handleLoginResponse(response: any) {
        if (response.body.token.access) {
            const profile = await this._profileService.getSelfProfileDataWithoutLoading();
            this._profileService.selfProfileData = profile;
            console.log('profile', profile);

            this._logService.logInfo(
                'Profile data',
                `Se han obtenido los datos de perfil del usuario`,
                'LoginComponent - handleLoginResponse',
                profile.username,
            );
            this._logService.logInfo(
                'Login OK',
                `El usuario: ${JSON.stringify(profile.username)} ha iniciado sesión correctamente`,
                'LoginComponent - handleLoginResponse',
                profile.username,
            );

            this._logService.logInfo('Redirect', `Redirección a la página de dashboard`, 'LoginComponent - handleLoginResponse', profile.username);
            this._router.navigateByUrl('/dashboard');
        } else {
            this._logService.logError('Error de inicio de sesión', 'CIF o contraseña incorrectos', 'LoginComponent - handleLoginResponse');
            throw new Error('CIF or password are incorrect');
        }
    }

    async handleError(error: any) {
        switch (error.status) {
            case 401:
                this.invalidLogin = true;
                break;
            case 500:
                this.invalidLogin = true;
                this._logService.logFatal('Error del servidor', `Error 500 del servidor: ${error.message}`, 'LoginComponent - handleError');
                this._dialogService.showDialog('ERROR', 'Error del servidor');
                break;
            default:
                this.invalidLogin = true;
                break;
        }
    }

    async onLogin() {
        const passwordValid = this.passwordValidator(this.password);
        if (passwordValid) {
            try {
                const response = await this._authService.login(this.username, this.password);
                this._logService.logInfo('Respuesta de inicio de sesión', `Token recibido`, 'LoginComponent - onLogin', response.body.token.email);

                await this.handleLoginResponse(response);
            } catch (error: any) {
                this.handleError(error);
            }
        }
    }

    togglePopup() {
        this.popupVisible = !this.popupVisible;
        this.invalidEmail = false;
        this.email = '';
    }

    async sendMail() {
        if (this.email.length > 0 && this.isValidEmail(this.email)) {
            try {
                let response = await this._authService.sendPasswordResetEmail(this.email);
                console.log('Response', response);
                console.log('Response status', response.status);

                if (response.status === 200) {
                    this.togglePopup();
                    this._dialogService.showDialog('INFORMACIÓ', "S'ha enviat un correu electrònic amb un codi de verificació");
                }
            } catch (error: any) {
                switch (error.status) {
                    case 404:
                        this.mailErrorMessage = `No existeix cap usuari amb el correu electrònic ${this.email}`;
                        this.invalidEmail = true;
                        break;
                    case 500:
                        this.togglePopup();
                        this._dialogService.showDialog('ERROR', 'Hi ha hagut un error intern del servidor. Si us plau, torna-ho a provar més tard');
                        break;
                    default:
                        this.togglePopup();
                        this._dialogService.showDialog('ERROR', 'Hi ha hagut un error desconegut. Si us plau, torna-ho a provar més tard');
                        break;
                }
            }
        } else {
            this.mailErrorMessage = 'El correu electrònic no és vàlid';
            this.invalidEmail = true;
        }
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

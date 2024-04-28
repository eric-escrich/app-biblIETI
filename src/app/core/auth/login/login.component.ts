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

    username: string = '';
    password: string = '';
    email = new FormControl('', [Validators.required, Validators.email]);
    mailError = false;
    mailErrorMessage = '';

    loginError: boolean = false;
    errorMessage: string = "L'usuari o la contrasenya són incorrectes.";
    loginForm!: FormGroup;

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    async validateLoginForm() {
        if (this.loginForm.status == 'INVALID') {
            this._logService.logWarning(
                'Username or password incorrect',
                `Un usuario ha intentado acceder con el usuario ${this.loginForm.get(
                    'username',
                )} pero ha introducido incorrectamente o el username o la contraseña`,
                'LoginComponent - validateLoginForm',
            );
            const keys = Object.keys(this.loginForm.controls);

            console.log(keys);

            for (const key of keys) {
                const controlErrors: ValidationErrors | null = this.loginForm.get(key)!.errors;
                if (!controlErrors) continue;
                const error = Object.keys(controlErrors)[0];
                // TO DO, REPLACE DEFAULT ALERT WHEN CUSTOM ALERTS ARE AVAILABLE
                if (error) {
                    this.loginError = true;
                    this.errorMessage = "L'usuari o la contrasenya són incorrectes.";

                    return false;
                }
            }
        }

        return true;
    }

    async handleLoginResponse(response: any) {
        if (response.body.token.access) {
            const profile = await this._profileService.getSelfProfileDataWithoutLoading();
            this._profileService.selfProfileData = profile;
            console.log('profile', profile);

            this._logService.logInfo(
                'Perfil de usuario',
                `Se han obtenido los datos de perfil del usuario`,
                'LoginComponent - handleLoginResponse',
                profile.username,
            );
            this._logService.logInfo(
                'Login exitoso',
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
                this.loginError = true;
                break;
            case 500:
                this._logService.logFatal('Error del servidor', `Error 500 del servidor: ${error.message}`, 'LoginComponent - handleError');
                this._dialogService.showDialog('ERROR', 'Error del servidor');
                break;
            default:
                this.loginError = true;
                break;
        }
    }

    async onLogin() {
        console.log('LoginComponent | onLogin - loginForm -> ');

        const isValid = await this.validateLoginForm();
        if (!isValid) return;

        try {
            const response = await this._authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
            this._logService.logInfo('Respuesta de inicio de sesión', `Token recibido`, 'LoginComponent - onLogin', response.body.token.email);

            await this.handleLoginResponse(response);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    // ENVIAR CODI
    value: any;
    @Input() popupVisible: boolean;

    constructor() {
        this.popupVisible = false;
    }
    togglePopup() {
        this.popupVisible = !this.popupVisible;
        this.mailError = false;
        this.email.reset();
    }

    async sendMail() {
        if (this.email.valid && this.email.value !== null) {
            try {
                let response = await this._authService.sendPasswordResetEmail(this.email.value);
                console.log('Response', response);
                console.log('Response status', response.status);

                if (response.status === 200) {
                    this.togglePopup();
                    this._dialogService.showDialog('INFO', "S'ha enviat un correu electrònic amb un codi de verificació");
                }
            } catch (error: any) {
                switch (error.status) {
                    case 404:
                        this.mailErrorMessage = `No existeix cap usuari amb el correu electrònic ${this.email.value}`;
                        this.mailError = true;
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
        }
    }
}

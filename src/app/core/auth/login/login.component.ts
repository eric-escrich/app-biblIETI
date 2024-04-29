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

    loginError: boolean = false;
    errorMessage: string = "L'usuari o la contrasenya són incorrectes.";
    loginForm!: FormGroup;

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    async onLogin() {
        if (this.loginForm.status == 'INVALID') {
            this._logService.logWarning(
                'Usuari o contrasenya incorrectes',
                `LoginComponent - onLogin | Un usuari ha tratat d'accedir amb l'usuari ${this.loginForm.get(
                    'username',
                )}, però ha introduït incorrectament l'usuari o la contrasenya: ${this.errorMessage}.`,
            );
            const keys = Object.keys(this.loginForm.controls);

            for (const key of keys) {
                const controlErrors: ValidationErrors | null = this.loginForm.get(key)!.errors;
                if (!controlErrors) continue;
                const error = Object.keys(controlErrors)[0];
                // TO DO, REPLACE DEFAULT ALERT WHEN CUSTOM ALERTS ARE AVAILABLE
                if (error) {
                    this.loginError = true;
                    this.errorMessage = "L'usuari o la contrasenya són incorrectes.";

                    return;
                }
            }
        }

        try {
            const response = await this._authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
            this._logService.logInfo(
                "Resposta d'inici de sessió",
                `LoginComponent - onLogin | Respoesta d'inici de sessió rebuda: ${JSON.stringify(response)}.`,
            );

            if (response.body.token.access) {
                const profile = await this._profileService.getSelfProfileData();
                this._profileService.selfProfileData = profile;
                console.log('login.component | onLogin - profile -> ', profile);
                this._logService.logInfo("Perfil d'usuari", "S'han obtingut les dades de perfil de l'usuari: ${JSON.stringify(profile)}");
                this._logService.logInfo(
                    'Inici de sessió exitós',
                    `LoginComponent - onLogin | L'usuari: ${JSON.stringify(profile.username)} ha iniciat sessió correctament.`,
                );

                this._logService.logInfo('Redirect', `LoginComponent - onLogin | Redirecció a la pàgina de Dashboard.`);
                this._router.navigateByUrl('/dashboard');
            } else {
                this._logService.logError("Error d'inici de sessió", 'LoginComponent - onLogin | CIF o contrasenya incorrectes.');
                throw new Error('CIF o contrasenya incorrectes.');
            }
        } catch (error: any) {
            switch (error.status) {
                case 401:
                    this.loginError = true;
                    break;
                case 500:
                    this._logService.logFatal('Error del servidor', 'LoginComponent - onLogin | Error 500 del servidor');
                    this._dialogService.showDialog('ERROR', 'Error del servidor');
                    break;
                default:
                    this.loginError = true;
                    break;
            }
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
    }
}

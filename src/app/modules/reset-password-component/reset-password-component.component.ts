import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { LogService } from '../../services/log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/dialog.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-reset-password-component',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, PasswordModule, DividerModule, ButtonModule, RouterLink],
    templateUrl: './reset-password-component.component.html',
    styleUrl: './reset-password-component.component.css',
})
export class ResetPasswordComponent {
    private _authService: AuthService;
    private _logService: LogService;
    private _dialogService: DialogService;
    private _router: Router;

    constructor(
        private route: ActivatedRoute,
        @Inject(AuthService) authService: AuthService,
        @Inject(LogService) logService: LogService,
        @Inject(DialogService) dialogService: DialogService,
        @Inject(Router) router: Router,
    ) {
        this._authService = authService;
        this._logService = logService;
        this._dialogService = dialogService;
        this._router = router;

        this.uid = this.route.snapshot.paramMap.get('uid')!;
        this.token = this.route.snapshot.paramMap.get('token')!;
    }

    private uid!: string;
    private token!: string;
    public invalidPassword: boolean = false;
    public errorMessage: string = '';

    public password: string = '';
    public confirmPassword: string = '';

    passwordValidator(password: string) {
        if (password.length < 8) {
            this.invalidPassword = true;
            this.errorMessage = `La contrasenya és massa curta (${password.length})`;
            this._logService.logWarning(
                'Password too short',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy corta',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (password.length > 16) {
            this.invalidPassword = true;
            this.errorMessage = 'La contrasenya és massa llarga (${password.length})';
            this._logService.logWarning(
                'Password too long',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy larga',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            this.invalidPassword = true;
            this.errorMessage = 'La contrasenya ha de contenir almenys una lletra majúscula.';
            this._logService.logWarning(
                'Password missing uppercase',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin mayúsculas',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[a-z]/.test(password)) {
            this.invalidPassword = true;
            this.errorMessage = 'La contrasenya ha de contenir almenys una lletra minúscula.';
            this._logService.logWarning(
                'Password missing lowercase',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin minúsculas',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/\d/.test(password)) {
            this.invalidPassword = true;
            this.errorMessage = 'La contrasenya ha de contenir almenys un número.';
            this._logService.logWarning(
                'Password missing number',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin números',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        if (!/[!@#$%^&*()-_=+[\]{};:'",.<>/?\\|~]/.test(password)) {
            this.invalidPassword = true;
            this.errorMessage = 'La contrasenya ha de contenir almenys un caràcter especial.';
            this._logService.logWarning(
                'Password missing special character',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin caracteres especiales',
                'ResetPasswordComponent - passwordValidator',
            );
            return false;
        }
        this.invalidPassword = false;
        this.errorMessage = '';
        return true;
    }

    onSubmit() {
        if (this.password != this.confirmPassword) {
            this.invalidPassword = true;
            this.errorMessage = 'Les contrasenyes no coincideixen';
            this._logService.logWarning(
                'Passwords do not match',
                'No se ha podido modificar la contraseña del usuario porque las contraseñas no coinciden',
                'ResetPasswordComponent - onSubmit',
            );
            return;
        }

        const passwordValid = this.passwordValidator(this.password);
        const confirmPasswordValid = this.passwordValidator(this.confirmPassword);

        if (passwordValid && confirmPasswordValid) {
            this.resetPassword(this.password);
        }
    }

    async resetPassword(password: string) {
        try {
            await this._authService.resetPassword(password, this.uid, this.token);
            this._dialogService.showDialog('INFORMACIÓ', 'Contrasenya modificada correctament. Ja pots iniciar sessió amb la nova contrasenya.');

            this._logService.logInfo('Password reset', "La contrasenya s'ha modificat correctament", 'ResetPasswordComponent - resetPassword');
            this._logService.logInfo('Redirect landing', 'Redirigiendo a la página de inicio', 'ResetPasswordComponent - resetPassword');
            this._router.navigateByUrl('/landing');
        } catch (error: any) {
            console.error('Error during password reset', error);
            switch (error.status) {
                case 401:
                    console.log('Invalid token', error.error.error);

                    this._logService.logError('Invalid token', error.error.error, 'ResetPasswordComponent - resetPassword');
                    this._dialogService.showDialog('ERROR', error.error.error);
                    break;
                case 402:
                    console.log('No new password provided', error.error.error);
                    console.log(typeof error.error.error);

                    this._logService.logError('No new password provided', error.error.error, 'ResetPasswordComponent - resetPassword');
                    this._dialogService.showDialog('ERROR', error.error.error.toString());
                    break;
                case 403:
                    console.log('Invalid password reset link', error.error.error);
                    console.log(typeof error.error.error);

                    this._logService.logError('Invalid password reset link', error.error.error, 'ResetPasswordComponent - resetPassword');
                    this._dialogService.showDialog('ERROR', error.error.error.toString());
                    break;
                default:
                    console.log('ERROR UNDEFINED', error.error.error);

                    this._logService.logError('ERROR UNDEFINED', error.error.error, 'ResetPasswordComponent - resetPassword');
                    this._dialogService.showDialog('ERROR', error.error.error || 'Error desconocido');
                    break;
            }
        }
    }

    goToLanding() {
        this._logService.logInfo('Redirect landing', 'Redirigiendo a la página de inicio', 'ProfileService - logout');
        this._router.navigateByUrl('/landing');
    }
}

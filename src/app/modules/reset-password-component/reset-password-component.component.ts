import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { LogService } from '../../services/log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-reset-password-component',
    standalone: true,
    imports: [ReactiveFormsModule, PasswordModule, DividerModule, ButtonModule],
    templateUrl: './reset-password-component.component.html',
    styleUrl: './reset-password-component.component.css',
})
export class ResetPasswordComponent {
    private _authService = Inject(AuthService);
    private _logService = Inject(LogService);
    private _dialog_Service = Inject(DialogService);
    resetPasswordForm!: FormGroup;

    private uid!: string;
    private token!: string;
    public invalidPassword: boolean = false;
    public errorMessage: string = '';

    constructor(private fb: FormBuilder, private route: ActivatedRoute) {
        const formOptions: AbstractControlOptions = {
            validators: this.checkPasswords,
        };

        this.resetPasswordForm = this.fb.group(
            {
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required],
            },
            { validator: this.checkPasswords },
        );

        this.uid = this.route.snapshot.paramMap.get('uid')!;
        this.token = this.route.snapshot.paramMap.get('token')!;
    }

    passwordValidator(component: ResetPasswordComponent) {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.value;
            if (password.length < 8) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya és massa curta.';
                this._logService.logWarning(
                    'Password too short',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy corta',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            if (password.length > 16) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya és massa llarga.';
                this._logService.logWarning(
                    'Password too long',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña muy larga',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            if (!/[A-Z]/.test(password)) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya ha de contenir almenys una lletra majúscula.';
                this._logService.logWarning(
                    'Password missing uppercase',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin mayúsculas',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            if (!/[a-z]/.test(password)) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya ha de contenir almenys una lletra minúscula.';
                this._logService.logWarning(
                    'Password missing lowercase',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin minúsculas',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            if (!/\d/.test(password)) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya ha de contenir almenys un número.';
                this._logService.logWarning(
                    'Password missing number',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin números',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            if (!/[!@#$%^&*()-_=+[\]{};:'",.<>/?\\|~]/.test(password)) {
                component.invalidPassword = true;
                component.errorMessage = 'La contrasenya ha de contenir almenys un caràcter especial.';
                this._logService.logWarning(
                    'Password missing special character',
                    'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña sin caracteres especiales',
                    'ResetPasswordComponent - passwordValidator',
                );
                return { invalidPassword: true };
            }
            component.invalidPassword = false;
            component.errorMessage = '';
            return null;
        };
    }

    checkPasswords(group: AbstractControl): ValidationErrors | null {
        let pass = group.get('password')?.value;
        let confirmPass = group.get('confirmPassword')?.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    onSubmit() {
        const passwordControl = this.resetPasswordForm.get('password');
        const confirmPasswordControl = this.resetPasswordForm.get('confirmPassword');

        if (passwordControl && confirmPasswordControl) {
            const passwordValidator = this.passwordValidator(this);
            const passwordErrors = passwordValidator(passwordControl);
            const confirmPasswordErrors = passwordValidator(confirmPasswordControl);

            if (passwordErrors || confirmPasswordErrors) {
                passwordControl.setErrors(passwordErrors);
                confirmPasswordControl.setErrors(confirmPasswordErrors);
            } else if (this.resetPasswordForm.valid) {
                const password = passwordControl.value;
                this.resetPassword(password);
            }
        }
    }

    async resetPassword(password: string) {
        try {
            await this._authService.resetPassword(this.uid, this.token, password);
        } catch (error: any) {
            console.error('Error during password reset', error);

            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 401:
                        this._logService.logError('Invalid token', error.error, 'ResetPasswordComponent - resetPassword');
                        this._dialog_Service.showDialog('ERROR', error.error);
                        break;
                    case 402:
                        this._logService.logError('No new password provided', error.error, 'ResetPasswordComponent - resetPassword');
                        this._dialog_Service.showDialog('ERROR', error.error);
                        break;
                    case 403:
                        this._logService.logError('Invalid password reset link', error.error, 'ResetPasswordComponent - resetPassword');
                        this._dialog_Service.showDialog('ERROR', error.error);
                        break;
                    default:
                        this._logService.logError('ERROR UNDEFINED', error.error, 'ResetPasswordComponent - resetPassword');
                        this._dialog_Service.showDialog('ERROR', error.error);
                        break;
                }
            }
        }
    }
}

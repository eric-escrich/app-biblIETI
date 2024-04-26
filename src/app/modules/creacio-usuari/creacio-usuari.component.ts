import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { DialogService } from '../../services/dialog.service';
import { DialogModule } from 'primeng/dialog';
import { LogService } from '../../services/log.service';


@Component({
  selector: 'app-creacio-usuari',
  standalone: true,
  imports: [
            CommonModule,
            InputTextModule,
            ButtonModule,
            PasswordModule,
            DialogModule,
            RouterLink,
            FormsModule,
            ReactiveFormsModule,
            DividerModule
          ],
  templateUrl: './creacio-usuari.component.html',
  styleUrl: './creacio-usuari.component.css'
})
export class CreacioUsuariComponent implements OnInit{
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _profileService = inject(ProfileService);
  private _logService = inject(LogService);
  private _dialogService = inject(DialogService);

  formGroup: FormGroup | undefined;

  ngOnInit() {
      this.loginForm = new FormGroup({
        text: new FormControl<string | null>(null),
        password: new FormControl('', [Validators.required]),
        repeatPassword: new FormControl('', [Validators.required]),
    });
  }

  password: string = '';
  repeatPassword: string = '';

  loginError: boolean = false;
  errorMessage: string = "L'usuari o la contrasenya són incorrectes.";
  loginForm!: FormGroup;


  async onConfirm() {
    if (this.loginForm.status == 'INVALID') {
        this._logService.logWarning(
            'password o repeatPassword incorrectas',
            `LoginComponent - onConfirm | Un usuario ha intentado acceder con el usuario ${this.loginForm.get(
                'password',
            )} pero ha introducido incorrectamente o el password o la contraseña: ${this.errorMessage}`,
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
  }
}
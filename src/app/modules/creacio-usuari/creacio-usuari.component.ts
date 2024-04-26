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
  errorMessage: string = 'Les contrasenyes no coincideixen.';
  loginForm!: FormGroup;


  // TODO: Que funcione al comprar la contraseña y repetir contraseña.
  async onConfirm() {
    if (this.loginForm.status === 'INVALID') {
      const passwordControl = this.loginForm.get('password');
      const repeatPasswordControl = this.loginForm.get('repeatPassword');
  
      if (passwordControl && repeatPasswordControl && passwordControl.value !== repeatPasswordControl.value) {
        this._logService.logWarning(
          'Les contrasenyes no coincideixen.',
          `CreacioUsuariComponent - onConfirm | Un bibliotecari ha intenta crear un usuari, però ha introduït incorrectamente la contraseña: ${this.errorMessage}`,
        );
        this.loginError = true;
        this.errorMessage = 'Les contrasenyes no coincideixen.';
        return;
      }
    }
  }
}
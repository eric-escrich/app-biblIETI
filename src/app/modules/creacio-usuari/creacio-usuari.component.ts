import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FormValidationService } from '../../services/validations-service.service';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';

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
        DividerModule,
        CalendarModule,
    ],
    templateUrl: './creacio-usuari.component.html',
    styleUrl: './creacio-usuari.component.css',
})
export class CreacioUsuariComponent {
    private _authService = inject(AuthService);
    private _router = inject(Router);
    private _profileService = inject(ProfileService);
    private _logService = inject(LogService);
    private _dialogService = inject(DialogService);
    private _formValidationService = inject(FormValidationService);
    private config = inject(PrimeNGConfig);

    public username: string = '';
    public name: string = '';
    public lastName: string = '';
    public secndLastName: string = '';
    public birthDate: Date = new Date();
    public course: string = '';
    public rol: number = 2;
    public dni: string = '';
    public tlfn: string = '';
    public email: string = '';
    public password: string = '';
    public confirmPassword: string = '';

    public invalidForm: boolean = false;
    public invalidUsername: boolean = false;
    public invalidName: boolean = false;
    public invalidLastName: boolean = false;
    public invalidBirthDate: boolean = false;
    public invalidCourse: boolean = false;
    public invalidDni: boolean = false;
    public invalidTlfn: boolean = false;
    public invalidEmail: boolean = false;
    public invalidPassword: boolean = false;

    public errorMessage: string = '';

    private adminEmail!: string;

    async ngOnInit() {
        this.adminEmail = await this._profileService.getEmail();
        this._logService.logInfo(
            'Initializing CreacioUsuarisComponent',
            'Inicializando CreacioUsuarisComponent',
            'CreacioUsuariComponent - ngOnInit',
            this.adminEmail,
        );

        this.config.setTranslation({
            dayNames: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
            dayNamesShort: ['dil', 'dmt', 'dmc', 'djs', 'div', 'dis', 'dug'],
            dayNamesMin: ['Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
            monthNames: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
            monthNamesShort: ['gen', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'des'],
            today: 'Avui',
            clear: 'Netejar',
        });
    }

    async onSubmit() {
        this._logService.logInfo(
            'Verifying user creation form',
            'Se va a revisar el formulario de creación de usuario',
            'CreacioUsuariComponent - onSubmit',
            this.adminEmail,
        );

        this.invalidUsername = this._formValidationService.isEmpty(this.username);
        if (this.invalidUsername) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid username',
                'No se ha podido crear el usuario porque ha introducido un nombre de usuario inválido',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = "El nom d'usuari es obligatori";
            this._dialogService.showDialog('ERROR', "El nom d'usuari es obligatori");
            return;
        }

        this.invalidName = this._formValidationService.isEmpty(this.name);
        if (this.invalidName) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid name',
                'No se ha podido crear el usuario porque ha introducido un nombre inválido',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = 'No has introduit el nom';
            this._dialogService.showDialog('ERROR', 'El nom es obligatori');
            return;
        }

        this.invalidLastName = this._formValidationService.isEmpty(this.lastName);
        if (this.invalidLastName) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid last name',
                'No se ha podido crear el usuario porque ha introducido un apellido inválido',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = 'No has introduit el cognom';
            this._dialogService.showDialog('ERROR', 'El cognom és obligatori');
            return;
        }

        this.invalidBirthDate = this._formValidationService.isEmpty(this.birthDate.toString());
        if (this.invalidBirthDate) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid birth date',
                'No se ha podido crear el usuario porque ha introducido una fecha de nacimiento inválida',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = 'No has introduit la data de naixement';
            this._dialogService.showDialog('ERROR', 'La data de naixement es obligatoria');
            return;
        }

        this.invalidCourse = this._formValidationService.isEmpty(this.course);
        if (this.invalidCourse) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid cycle',
                'No se ha podido crear el usuario porque ha introducido un ciclo inválido',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = 'No has introduit el curs';
            this._dialogService.showDialog('ERROR', 'El curs es obligatori');
            return;
        }

        this.invalidEmail = this._formValidationService.isEmpty(this.email);
        if (!this.invalidEmail) {
            this.invalidEmail = !this._formValidationService.isValidEmail(this.email);
            if (this.invalidEmail) {
                this.invalidForm = true;
                this._logService.logWarning(
                    'Invalid email',
                    'No se ha podido crear el usuario porque ha introducido un email inválido',
                    'CreacioUsuariComponent - onSubmit',
                    this.adminEmail,
                );
                this.errorMessage = 'El correu electronic es invalid';
                this._dialogService.showDialog('ERROR', 'El correu electronic es invalid');
                return;
            }
        } else {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid email',
                'No se ha podido crear el usuario porque no ha introducido un email',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = 'No has introduit el correu electronic';
            this._dialogService.showDialog('ERROR', 'El correu electronic es obligatori');
            return;
        }

        if (this.dni.length > 0) {
            this.invalidDni = this._formValidationService.isValidDni(this.dni);
            if (!this.invalidDni) {
                this.invalidForm = true;
                this._logService.logWarning(
                    'Invalid DNI',
                    'No se ha podido crear el usuario porque ha introducido un DNI inválido',
                    'CreacioUsuariComponent - onSubmit',
                    this.adminEmail,
                );
                this.errorMessage = 'El DNI es invalid';
                this._dialogService.showDialog('ERROR', 'El DNI es invalid');
                return;
            }
        }

        if (this.tlfn.length > 0) {
            this.invalidTlfn = this._formValidationService.isValidTlfn(this.tlfn);
            if (!this.invalidTlfn) {
                this.invalidForm = true;
                this._logService.logWarning(
                    'Invalid phone number',
                    'No se ha podido crear el usuario porque ha introducido un número de teléfono inválido',
                    'CreacioUsuariComponent - onSubmit',
                    this.adminEmail,
                );
                this.errorMessage = 'El numero de telefon es invalid';
                this._dialogService.showDialog('ERROR', 'El numero de telefon es invàlid');
                return;
            }
        }

        if (!this.verifyPassword()) return;

        let existsUser = await this._authService.checkUserExists(this.username, this.email);
        if (existsUser.username_exists || existsUser.email_exists) {
            this.invalidForm = true;
            let errorMessage = 'Ja existeix un usuari amb aquest ';
            if (existsUser.username_exists) {
                errorMessage += "nom d'usuari";
                this.invalidUsername = true;
            } else if (existsUser.email_exists) {
                errorMessage += 'correu electronic';
                this.invalidEmail = true;
            }
            this._logService.logWarning(
                'User already exists',
                'No se ha podido crear el usuario porque ya existe un usuario con ese nombre o email',
                'CreacioUsuariComponent - onSubmit',
                this.adminEmail,
            );
            this.errorMessage = errorMessage;
            this._dialogService.showDialog('ERROR', errorMessage);
            return;
        }

        await this.register();
    }

    verifyPassword() {
        if (this.password != this.confirmPassword) {
            this.invalidPassword = true;
            this.invalidForm = true;
            this.errorMessage = 'Les contrasenyes no coincideixen';
            this._logService.logWarning(
                'Passwords do not match',
                'No se ha podido modificar la contraseña del usuario porque las contraseñas no coinciden',
                'ResetPasswordComponent - onSubmit',
                this.adminEmail,
            );
            this._dialogService.showDialog('ERROR', 'Les contrasenyes no coincideixen');
            return false;
        }

        const passwordValidation = this._formValidationService.validatePassword(this.password);
        if (!passwordValidation.isValid) {
            this.invalidForm = true;
            this.invalidPassword = true;
            this.errorMessage = passwordValidation.errorMessage;
            this._logService.logWarning(
                'Invalid password',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña inválida: ' +
                    passwordValidation.errorMessage,
                'ResetPasswordComponent - onSubmit',
                this.adminEmail,
            );
            this._dialogService.showDialog('ERROR', passwordValidation.errorMessage);
            return false;
        }
        const confirmPasswordValidation = this._formValidationService.validatePassword(this.confirmPassword);
        if (!confirmPasswordValidation.isValid) {
            this.invalidForm = true;
            this.invalidPassword = true;
            this.errorMessage = passwordValidation.errorMessage;
            this.errorMessage = passwordValidation.errorMessage;
            this._logService.logWarning(
                'Invalid password',
                'No se ha podido modificar la contraseña del usuario porque ha introducido una contraseña inválida',
                'ResetPasswordComponent - onSubmit',
                this.adminEmail,
            );
            this._dialogService.showDialog('ERROR', passwordValidation.errorMessage);
            return false;
        }
        return true;
    }

    async register() {
        console.log('register - invalidForm', this.invalidForm);

        if (this.invalidForm) return;
        try {
            let formattedBirthDate = formatDate(this.birthDate, 'dd-MM-yyyy', 'en-US');

            const response = await this._authService.registerUser(
                this.adminEmail,
                this.username,
                this.name,
                this.lastName,
                this.secndLastName,
                this.dni,
                this.tlfn,
                formattedBirthDate,
                this.course,
                this.email,
                this.password,
            );
            console.log('response --> ', response);
            console.log('response.status --> ', response.status);

            if (response.status === 201) {
                this._dialogService.showDialog('INFO', 'Usuari creat correctament');
                this._logService.logInfo('Redirect', `Redirecció a la pàgina de Dashboard`, 'LoginComponent - handleLoginResponse', this.adminEmail);
                this._router.navigateByUrl('/dashboard');
            } else {
                this._dialogService.showDialog('ERROR', 'Error al crear el usuari');
            }
        } catch (error: any) {
            console.error('Error creating user', error.message);
            this._logService.logError(
                'Error creating user',
                `Error al crear el usuario: ${error.message}`,
                'CreacioUsuariComponent - register',
                this.adminEmail,
            );
            this._dialogService.showDialog('ERROR', "No s'ha pogut crear l'usauri. Torni a intentar-ho més tard.");
        }
    }
}

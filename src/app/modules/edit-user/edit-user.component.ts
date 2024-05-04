import { Component, Input, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Role } from '../../constants/role.code';
import { DialogService } from '../../services/dialog.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DialogModule } from 'primeng/dialog';
import { LogService } from '../../services/log.service';
import { FormValidationService } from '../../services/validations-service.service';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-edit-user',
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
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
    private route = inject(ActivatedRoute);
    private _authService = inject(AuthService);
    private _router = inject(Router);
    private _profileService = inject(ProfileService);
    private _logService = inject(LogService);
    private _dialogService = inject(DialogService);
    private _formValidationService = inject(FormValidationService);
    private config = inject(PrimeNGConfig);

    public adminRole!: number;
    public Role = Role;

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
    public originalUserData: any;
    public userId: any;
    public roleName: any;

    async ngOnInit() {
        this.adminRole = await this._profileService.getRole();

        if (this.adminRole !== Role.ADMIN && this.adminRole !== Role.BIBLIO) {
            this._router.navigate(['/dashboard']);
            this._dialogService.showDialog('ERROR', 'No tens permisos per accedir a aquesta pàgina');
        } else {
            try {
                this.adminEmail = await this._profileService.getEmail();
            } catch (error: any) {
                this._dialogService.showDialog('ERROR', "No s'ha pogut obtenir l'email de l'usuari administrador o bibliotecari");
                this._profileService.logout();
            }

            try {
                this.userId = this.route.snapshot.paramMap.get('userId')!;
                this.originalUserData = await this._profileService.getUserProfileDataById(this.userId);
                await this.setDefaultData();
            } catch (error: any) {
                this._dialogService.showDialog('ERROR', "No s'ha pogut obtenir la informació de l'usuari");
                this._router.navigate(['/list-users']);
            }

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
    }

    async setDefaultData() {
        if (!this.originalUserData) this.originalUserData = await this._profileService.getUserProfileDataById(this.userId);

        this.invalidForm = false;
        this.invalidUsername = false;
        this.invalidName = false;
        this.invalidLastName = false;
        this.invalidCourse = false;
        this.invalidDni = false;
        this.invalidTlfn = false;
        this.invalidEmail = false;
        this.invalidPassword = false;
        this.invalidBirthDate = false;

        this.username = this.originalUserData.username;
        this.name = this.originalUserData.name;
        this.lastName = this.originalUserData.surname;
        this.secndLastName = this.originalUserData.surname2;
        this.birthDate = new Date(this.originalUserData.date_of_birth);
        this.course = this.originalUserData.cycle;
        this.rol = this.originalUserData.role;
        this.dni = this.originalUserData.dni;
        this.tlfn = this.originalUserData.phone;
        this.email = this.originalUserData.email;
    }

    getRoleName() {
        switch (this.rol) {
            case Role.ADMIN:
                return 'ADMIN';
            case Role.BIBLIO:
                return 'BIBLIOTECARI';
            case Role.USER:
                return 'USUARI';
            default:
                return 'USUARI';
        }
    }

    async onSubmit() {
        this._logService.logInfo(
            'Verifying user edition form',
            'Se va a revisar el formulario de edición del usuario con id: ' + this.userId,
            'CreacioUsuariComponent - onSubmit',
            this.adminEmail,
        );

        let updatedFields: any = {};

        if (this.originalUserData) {
            if (this.username !== this.originalUserData.username) {
                this.invalidUsername = this._formValidationService.isEmpty(this.username);
                if (this.invalidUsername) {
                    this.invalidForm = true;
                    this._logService.logWarning(
                        'Invalid username',
                        `No se ha podido crear el usuario con id ${this.userId} porque ha introducido un nombre de usuario inválido`,
                        'CreacioUsuariComponent - onSubmit',
                        this.adminEmail,
                    );
                    this.errorMessage = "El nom d'usuari es obligatori";
                    this._dialogService.showDialog('ERROR', "El nom d'usuari es obligatori");
                    return;
                }
                updatedFields.username = this.username;
            }

            if (this.name !== this.originalUserData.name) {
                this.invalidName = this._formValidationService.isEmpty(this.name);
                if (this.invalidName) {
                    this.invalidForm = true;
                    this._logService.logWarning(
                        'Invalid name',
                        `No se ha podido modificar el usuario con id ${this.userId} porque no se ha introducido un nombre`,
                        'CreacioUsuariComponent - onSubmit',
                    );
                    this.errorMessage = 'No has introduit el nom';
                    this._dialogService.showDialog('ERROR', 'El nom es obligatori');
                    return;
                }
                updatedFields.name = this.name;
            }

            if (this.lastName !== this.originalUserData.surname) {
                this.invalidLastName = this._formValidationService.isEmpty(this.lastName);
                if (this.invalidLastName) {
                    this.invalidForm = true;
                    this._logService.logWarning(
                        'Invalid last name',
                        `No se ha podido modificar el usuario con id ${this.userId} porque no se ha introducido un apellido`,
                        'CreacioUsuariComponent - onSubmit',
                        this.adminEmail,
                    );
                    this.errorMessage = 'No has introduit el cognom';
                    this._dialogService.showDialog('ERROR', 'El cognom és obligatori');
                    return;
                }
                updatedFields.surname = this.lastName;
            }

            if (this.secndLastName !== this.originalUserData.surname2) {
                updatedFields.surname2 = this.secndLastName;
            }

            if (this.birthDate instanceof Date && !isNaN(this.birthDate.getTime())) {
                const formattedBirthDate = formatDate(this.birthDate, 'dd-MM-yyyy', 'en-US');
                const formattedOriginalBirthDate = formatDate(this.originalUserData.date_of_birth, 'dd-MM-yyyy', 'en-US');

                if (formattedBirthDate !== formattedOriginalBirthDate) {
                    this.invalidBirthDate = this._formValidationService.isEmpty(this.birthDate.toString());
                    if (this.invalidBirthDate) {
                        this.invalidForm = true;
                        this._logService.logWarning(
                            'Invalid birth date',
                            `No se ha podido modificar el usuario con id ${this.userId} porque no se ha introducido una fecha de nacimiento`,
                            'CreacioUsuariComponent - onSubmit',
                            this.adminEmail,
                        );
                        this.errorMessage = 'No has introduit la data de naixement';
                        this._dialogService.showDialog('ERROR', 'La data de naixement es obligatoria');
                        return;
                    }
                    updatedFields.date_of_birth = this.birthDate;
                }
            } else {
                this.invalidForm = true;
                this.invalidBirthDate = true;
                this._logService.logWarning(
                    'Invalid birth date',
                    `No se ha podido modificar el usuario con id ${this.userId} porque la fecha de nacimiento no es válida`,
                    'CreacioUsuariComponent - onSubmit',
                    this.adminEmail,
                );
                this.errorMessage = 'La data de neixament no és válida';
                this._dialogService.showDialog('ERROR', 'La data de neixament no és válida');
                this.birthDate = this.originalUserData.date_of_birth;
                return;
            }

            if (this.course !== this.originalUserData.cycle) {
                this.invalidCourse = this._formValidationService.isEmpty(this.course);
                if (this.invalidCourse) {
                    this.invalidForm = true;
                    this._logService.logWarning(
                        'Invalid cycle',
                        `No se ha podido modificar el usuario con id ${this.userId} porque no se ha introducido un cycle`,
                        'CreacioUsuariComponent - onSubmit',
                        this.adminEmail,
                    );
                    this.errorMessage = 'No has introduit el curs';
                    this._dialogService.showDialog('ERROR', 'El curs es obligatori');
                    return;
                }
                updatedFields.cycle = this.course;
            }

            if (this.dni !== this.originalUserData.dni) {
                if (this.dni.length > 0) {
                    this.invalidDni = this._formValidationService.isValidDni(this.dni);
                    console.log('this.invalidDni', this.invalidDni);

                    if (!this.invalidDni) {
                        this.invalidForm = true;
                        this._logService.logWarning(
                            'Invalid DNI',
                            `No se ha podido modificar el usuario con id ${this.userId} porque se ha introducido un DNI inválido`,
                            'CreacioUsuariComponent - onSubmit',
                            this.adminEmail,
                        );
                        this.invalidDni = true;
                        this.errorMessage = 'El DNI es invalid';
                        this._dialogService.showDialog('ERROR', 'El DNI es invalid');
                        return;
                    }
                }
                updatedFields.dni = this.dni;
            }

            if (this.tlfn !== this.originalUserData.phone) {
                updatedFields.phone = this.tlfn;
            }

            if (this.email !== this.originalUserData.email) {
                this.invalidEmail = this._formValidationService.isEmpty(this.email);
                if (!this.invalidEmail) {
                    this.invalidEmail = !this._formValidationService.isValidEmail(this.email);
                    if (this.invalidEmail) {
                        this.invalidForm = true;
                        this._logService.logWarning(
                            'Invalid email',
                            `No se ha podido modificar el usuario con id ${this.userId} porque se ha introducido un email inválido`,
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
                        `No se ha podido modificar el usuario con id ${this.userId} porque no se ha introducido un email`,
                        'CreacioUsuariComponent - onSubmit',
                        this.adminEmail,
                    );
                    this.errorMessage = 'No has introduit el correu electronic';
                    this._dialogService.showDialog('ERROR', 'El correu electronic es obligatori');
                    return;
                }
                updatedFields.email = this.email;
            }

            if (this.password.length > 0) {
                if (!this.verifyPassword()) return;
                updatedFields.password = this.password;
            }

            if (Object.keys(updatedFields).length > 0 && this.invalidForm === false) {
                this.errorMessage = '';
                this.invalidForm = false;
                try {
                    await this.saveUser(updatedFields);
                    this._dialogService.showDialog('INFORMACIÓ', 'Usuari modificat correctament');
                    this._logService.logInfo(
                        'User data updated',
                        "S'ha modificat la informació de l'usuari",
                        'ResetPasswordComponent - onSubmit',
                        this.adminEmail,
                    );
                } catch (error: any) {
                    this._dialogService.showDialog('ERROR', "No s'ha pogut modificar l'usuari");
                    this._logService.logError(
                        'Error updating user data',
                        'No se ha podido modificar la información del usuario',
                        'ResetPasswordComponent - onSubmit',
                        this.adminEmail,
                    );
                }
            } else {
                this._dialogService.showDialog('INFORMACIÓ', "No s'ha modificat cap camp");
            }
        }
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

    async saveUser(newUserData: any) {
        try {
            console.log('this.originalUserData', this.originalUserData);
            const response = await this._profileService.updateUserDataByAdmin(this.adminEmail, this.originalUserData.email, newUserData);
            try {
                this.originalUserData = await this._profileService.getUserProfileDataById(this.userId);
                await this.setDefaultData();
            } catch (error: any) {
                this._dialogService.showDialog('ERROR', "No s'ha pogut obtenir la informació de l'usuari");
                this._router.navigate(['/list-users']);
            }
            console.log('User data updated successfully:', response);
            // Manejar la respuesta según sea necesario
        } catch (error: any) {
            console.error('Error updating user data:', error);
            // Manejar el error según sea necesario
        }
    }

    resetForm() {}
}

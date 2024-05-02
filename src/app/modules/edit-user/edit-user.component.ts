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
import { Router, RouterLink } from '@angular/router';
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
    private _profileService = inject(ProfileService);
    private _router = inject(Router);
    private _dialogService = inject(DialogService);
    private _authService = inject(AuthService);
    private _logService = inject(LogService);
    private _formValidationService = inject(FormValidationService);

    private config = inject(PrimeNGConfig);

    public invalidForm: boolean = false;
    public invalidName: boolean = false;
    public invalidLastName: boolean = false;
    public invalidBirthDate: boolean = false;
    public invalidCourse: boolean = false;
    public invalidDni: boolean = false;
    public invalidTlfn: boolean = false;

    public errorMessage: string = '';

    @Input('userID') userId!: number;
    private adminEmail: string = '';
    private originalUserData: any;
    public newUserData: any;
    public role!: number;
    public Role = Role;

    async ngOnInit() {
        this.role = await this._profileService.getRole();

        if (this.role !== Role.ADMIN && this.role !== Role.BIBLIO) {
            this._router.navigate(['/dashboard']);
            this._dialogService.showDialog('ERROR', 'No tens permisos per accedir a aquesta pàgina');
        } else {
            try {
                this.adminEmail = await this._profileService.getEmail();
            } catch (error: any) {
                this._dialogService.showDialog('ERROR', "No s'ha pogut obtenir el teu email");
                this._profileService.logout();
            }

            try {
                this.originalUserData = await this._profileService.getUserProfileDataById(this.userId);
                this.newUserData = this.originalUserData.user_profile;
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

    async onSubmit() {
        console.log('name', this.newUserData.name);
        console.log('surname', this.newUserData.surname);
        console.log('dni', this.newUserData.dni);
        console.log('phone', this.newUserData.phone);
        console.log('cycle', this.newUserData.cycle);
        console.log('birth', this.newUserData.date_of_birth);

        this._logService.logInfo(
            'Verifying user creation form',
            'Se va a revisar el formulario de creación de usuario',
            'CreacioUsuariComponent - onSubmit',
            this.adminEmail,
        );

        this.invalidName = this._formValidationService.isEmpty(this.newUserData.name);
        if (this.invalidName) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid name',
                'No se ha podido crear el usuario porque ha introducido un nombre inválido',
                'CreacioUsuariComponent - onSubmit',
            );
            this.errorMessage = 'No has introduit el nom';
            this._dialogService.showDialog('ERROR', 'El nom es obligatori');
            return;
        }

        this.invalidLastName = this._formValidationService.isEmpty(this.newUserData.surname);
        if (this.invalidLastName) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid last name',
                'No se ha podido crear el usuario porque ha introducido un apellido inválido',
                'CreacioUsuariComponent - onSubmit',
            );
            this.errorMessage = 'No has introduit el cognom';
            this._dialogService.showDialog('ERROR', 'El cognom és obligatori');
            return;
        }

        this.invalidBirthDate = this._formValidationService.isEmpty(this.newUserData.date_of_birth);
        if (this.invalidBirthDate) {
            const birthDate: Date = this.newUserData.date_of_birth;
            const formattedBirthDate: string = `${('0' + birthDate.getDate()).slice(-2)}-${('0' + (birthDate.getMonth() + 1)).slice(
                -2,
            )}-${birthDate.getFullYear()}`;
            this.newUserData.date_of_birth = formattedBirthDate;
            return;
        }

        this.invalidCourse = this._formValidationService.isEmpty(this.newUserData.cycle);
        if (this.invalidCourse) {
            this.invalidForm = true;
            this._logService.logWarning(
                'Invalid cycle',
                'No se ha podido crear el usuario porque ha introducido un ciclo inválido',
                'CreacioUsuariComponent - onSubmit',
            );
            this.errorMessage = 'No has introduit el curs';
            this._dialogService.showDialog('ERROR', 'El curs es obligatori');
            return;
        }

        await this.saveUser();
    }

    reset() {
        this.newUserData = this.originalUserData.user_profile;
    }

    async saveUser() {
        try {
            const response = await this._profileService.updateUserDataByAdmin(
                this.adminEmail,
                this.originalUserData.user_profile.email,
                this.newUserData,
            );
            console.log('User data updated successfully:', response);
            // Manejar la respuesta según sea necesario
        } catch (error: any) {
            console.error('Error updating user data:', error);
            // Manejar el error según sea necesario
        }
    }
}

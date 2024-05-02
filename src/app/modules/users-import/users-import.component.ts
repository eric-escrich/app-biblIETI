import { Component, OnInit, EventEmitter, Output, inject } from '@angular/core';
import { LogService } from '../../services/log.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-users-import',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users-import.component.html',
    styleUrl: './users-import.component.css',
})
export class UsersImportComponent {
    private _authService = inject(AuthService);
    private _profileService = inject(ProfileService);
    private _router = inject(Router);
    private _logService = inject(LogService);

    csvContent: any;
    convertedArray: Array<any> = [];
    properties: any = '';
    adminEmail: string = '';
    role!: number;
    errors!: any;
    message!: string;

    @Output()
    onConvert = new EventEmitter<any>();

    @Output()
    onFail = new EventEmitter<String>();

    async ngOnInit() {
        this.adminEmail = await this._profileService.getEmail();
        this.role = await this._profileService.getRole();
    }

    //Click Action for Input File Control
    onFileSelect(input: any) {
        const files = input.files;
        var fileTypes = ['csv']; //acceptable file types

        if (files && files.length) {
            var extension = input.files[0].name.split('.').pop().toLowerCase(), //file extension from input file
                //Validating type of File Uploaded
                isSuccess = fileTypes.indexOf(extension) > -1; //is extension in acceptable types
            //console.log(isSuccess);
            //console.log("Filename: " + files[0].name);
            // console.log("Type: " + files[0].type);
            //  console.log("Size: " + files[0].size + " bytes");
            var that = this;
            //Flag to check the Validation Result
            if (isSuccess) {
                const fileToRead = files[0];

                const fileReader = new FileReader();

                fileReader.onload = async function (fileLoadedEvent) {
                    if (fileLoadedEvent && fileLoadedEvent.target) {
                        const textFromFileLoaded = fileLoadedEvent.target.result;
                        that.csvContent = textFromFileLoaded;

                        //Flag is for extracting first line
                        let flag = false;
                        // Main Data
                        let objarray: Array<any> = [];
                        //Properties
                        let prop: Array<any> = [];
                        //Total Length
                        let size: any = 0;

                        let id_register = 1;

                        for (const line of that.csvContent.split(/[\r\n]+/)) {
                            if (flag) {
                                let obj: any = {};
                                for (let k = 0; k < size; k++) {
                                    //Dynamic Object Properties
                                    obj[prop[k]] = line.split(',')[k];
                                }
                                obj.id_register = id_register++;
                                objarray.push(obj);
                            } else {
                                //First Line of CSV will be having Properties
                                for (let k = 0; k < line.split(',').length; k++) {
                                    size = line.split(',').length;
                                    //Removing all the spaces to make them usefull
                                    prop.push(line.split(',')[k].replace(/ /g, ''));
                                }
                                prop.push('id_register');
                                flag = true;
                            }
                        }
                        //All the values converted from CSV to JSON Array
                        that.convertedArray = objarray;
                        that.properties = [];
                        //Object Keys of Converted JSON Array
                        that.properties = prop;

                        let finalResult = {
                            email_admin: that.adminEmail,
                            user_profiles_csv: that.convertedArray,
                        };
                        //On Convert Success
                        that.onConvert.emit(finalResult);
                        console.log(finalResult);

                        await that.uploadUsers(finalResult);
                    }
                };

                fileReader.readAsText(fileToRead, 'UTF-8');
            } else {
                that.onFail.emit('Invalid File Format!');
            }
        }
    }

    async uploadUsers(users: any) {
        try {
            let response = await this._authService.uploadUsers(users);
            console.log('Response', response);
            console.log('Response status', response.status);

            this.errors = response.body.errors;
            this.message = response.body.message;

            if (response.status === 200) {
                this._logService.logInfo('Users uploaded', 'Users uploaded successfully', 'UsersImportComponent - uploadUsers');
                this._router.navigate(['/dashboard']);
            } else if (response.status === 201) {
                throw new Error('El valor de email_admin no es correcto');
            }
        } catch (error: any) {
            switch (error.status) {
                case 500:
                    this._logService.logFatal('Error del servidor', `Error 500 del servidor: ${error.message}`, 'UsersImportComponent - uploadUsers');
                    break;
                default:
                    if (error.message === 'El valor de email_admin no es correcto') {
                        this._logService.logError(
                            'Error uploading users',
                            `Error uploading users: ${error.message}`,
                            'UsersImportComponent - uploadUsers',
                        );
                    } else {
                        const errors = error.errors;
                        for (let i = 0; i < errors.length; i++) {
                            this._logService.logError(`Error en el registro ${i + 1}`, errors[i].error, 'UsersImportComponent - uploadUsers');
                        }
                    }
                    break;
            }
        }
    }
}

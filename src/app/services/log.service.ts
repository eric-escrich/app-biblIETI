import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    private _profileService = inject(ProfileService);

    private baseUrl: string = environment.apiUrl;
    private logsKey = 'logs';

    constructor(private http: HttpClient) {}

    logInfo(title: string, description: string) {
        let log = { level: 'INFO', title, description };
        this.saveLogInStorage(log);
    }

    logWarning(title: string, description: string) {
        let log = { level: 'WARNING', title, description };
        this.saveLogInStorage(log);
    }

    logError(title: string, description: string) {
        let log = { level: 'ERROR', title, description };
        this.saveLogInStorage(log);
    }

    logFatal(title: string, description: string) {
        let log = { level: 'FATAL', title, description };
        this.saveLogInStorage(log);
    }

    // Método para guardar un nuevo log en el localStorage
    async saveLogInStorage(log: any) {
        try {
            let userID;
            if (this._profileService.selfProfileData) {
                userID = await this._profileService.getUserID();
            } else {
                userID = null;
            }
            const date = new Date().toISOString();
            log = { ...log, userID, date };
            let logs: any[] = JSON.parse(localStorage.getItem(this.logsKey) || '[]');
            logs.push(log);
            localStorage.setItem(this.logsKey, JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving log in storage', error);
        }
    }

    // Método para obtener todos los logs guardados en el localStorage
    getLogs(): any[] {
        return JSON.parse(localStorage.getItem(this.logsKey) || '[]');
    }

    // Método para limpiar todos los logs del localStorage
    clearLogs() {
        localStorage.removeItem(this.logsKey);
    }

    async sendLogs() {
        const logs = this.getLogs();
        if (logs.length > 0) {
            try {
                await firstValueFrom(this.http.post(`${this.baseUrl}/logs/save/`, logs, { observe: 'response' }));
                this.logInfo('Data sent successfully', 'The data was sent to the API successfully');
                this.clearLogs();
                return;
            } catch (error: any) {}
        }
    }
}

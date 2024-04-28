import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    private baseUrl: string = environment.apiUrl;
    private logsKey = 'logs';

    constructor(private http: HttpClient) {}

    logInfo(title: string, description: string, route: string, user?: string) {
        let log = { level: 'INFO', title, description, route, user };
        this.saveLogInStorage(log);
    }

    logWarning(title: string, description: string, route: string, user?: string) {
        let log = { level: 'WARNING', title, description, route, user };
        this.saveLogInStorage(log);
    }

    logError(title: string, description: string, route: string, user?: string) {
        let log = { level: 'ERROR', title, description, route, user };
        this.saveLogInStorage(log);
    }

    logFatal(title: string, description: string, route: string, user?: string) {
        let log = { level: 'FATAL', title, description, route, user };
        this.saveLogInStorage(log);
    }

    // Método para guardar un nuevo log en el localStorage
    async saveLogInStorage(log: any) {
        try {
            if (log.user === undefined) log.user = '';
            const date = new Date().toISOString();
            log = { ...log, date };
            let logs: any[] = JSON.parse(localStorage.getItem(this.logsKey) || '[]');
            logs.push(log);

            localStorage.setItem(this.logsKey, JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving log in storage', error);
        }
    }

    getLogs(): any[] {
        const logs = JSON.parse(localStorage.getItem(this.logsKey) || '[]');
        return logs;
    }

    clearLogs() {
        localStorage.removeItem(this.logsKey);
    }

    async sendLogs() {
        const logs = this.getLogs();
        if (logs.length > 0) {
            try {
                await firstValueFrom(this.http.post(`${this.baseUrl}/logs/save/`, logs, { observe: 'response' }));
                this.logInfo('Data sent successfully', 'The data was sent to the API successfully', 'LogService - sendLogs');
                this.clearLogs();
                return;
            } catch (error: any) {
                this.logError('Error sending logs', error.message, 'LogService - sendLogs');
                return;
            }
        }
    }
}

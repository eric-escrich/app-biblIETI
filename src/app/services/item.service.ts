import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LogService } from './log.service';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    private _router = inject(Router);
    private _logService = inject(LogService);

    private baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    async searchQuery(item: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search/`, {
                    params: { item: item },
                    observe: 'response',
                }),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error fetching items', error);
            throw error;
        }
    }
}

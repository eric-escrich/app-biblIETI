import { HttpClient, HttpParams } from '@angular/common/http';
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

    async makeLoan(email: string, itemCopyId: number, returnDate: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.post(`${this.baseUrl}/items/make-loan/`, {
                    email,
                    item_copy_id: itemCopyId,
                    return_date: returnDate,
                }),
            );

            return response;
        } catch (error: any) {
            console.error('Error making loan', error);
            throw error;
        }
    }
}

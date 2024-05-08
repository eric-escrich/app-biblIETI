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

    async autocompleatQuery(query: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/autocompleat-search/${query}`, {
                    observe: 'response',
                }),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error fetching items', error);
            throw error;
        }
    }

    async makeLoan(email: string, itemCopyId: number, returnDate: Date) {
        try {
            const response: any = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}/items/make-loan/`,
                    {
                        email,
                        item_copy_id: itemCopyId,
                        return_date: returnDate.toISOString().split('T')[0],
                    },
                    { observe: 'response' },
                ),
            );

            return response;
        } catch (error: any) {
            console.error('Error making loan', error);
            throw error;
        }
    }

    async getInfoItemById(itemId: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search/${itemId}`, {
                    observe: 'response',
                }),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error fetching item info', error);
            throw error;
        }
    }

    async getItemsCopis(itemId: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search-item-copies/${itemId}`, {
                    observe: 'response',
                }),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error fetching item copies', error);
            throw error;
        }
    }

    async searchQueryPaginator(query: string, page: number, pageSize: number) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search-items/${query}/${page}/${pageSize}/`, {
                    observe: 'response',
                }),
            );

            if (response) {
                this._logService.logInfo(
                    'Returned Items',
                    `La consulta ${query} devolvió ${response.body.length} resultados`,
                    'ItemService - searchQuery',
                );
                return response;
            } else {
                this._logService.logError('Returned Items', `La consulta ${query} devolvió un error`, 'ItemService - searchQueryPaginator');
                return response;
            }
        } catch (error: any) {
            this._logService.logError('UNDEFINED ERROR', `Error: ${error.me}`, 'ItemService - searchQueryOnlyAvailable');
            console.error('Error fetching items', error);
            throw error;
        }
    }

    async searchQueryOnlyAvailablePagination(query: string, page: number, pageSize: number) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search-availables/${query}/${page}/${pageSize}/`, {
                    observe: 'response',
                }),
            );

            if (response) {
                this._logService.logInfo(
                    'Returned Items',
                    `La consulta ${query} devolvió ${response.body.length} resultados`,
                    'ItemService - searchQueryOnlyAvailable',
                );
                return response;
            } else {
                this._logService.logError(
                    'Returned Items',
                    `La consulta ${query} devolvió un error`,
                    'ItemService - searchQueryOnlyAvailablePagination',
                );
                return response;
            }
        } catch (error: any) {
            this._logService.logError('UNDEFINED ERROR', `Error: ${error}`, 'ItemService - searchQueryOnlyAvailable');
            console.error('Error fetching items', error);
            throw error;
        }
    }

    async createItem(
        item_type: string,
        title: string,
        author: string,
        loan_available: boolean,
        edition_date: Date,
        CDU: string,
        ISBN: string,
        publisher: string,
        collection: string,
        pages: number,
        language: string,
    ) {
        try {
            const response: any = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}/items/create-item/`,
                    {
                        item_type,
                        title,
                        author,
                        loan_available,
                        edition_date: edition_date.toISOString().split('T')[0],
                        CDU,
                        ISBN,
                        publisher,
                        collection,
                        pages,
                        language,
                    },
                    { observe: 'response' },
                ),
            );

            return response;
        } catch (error: any) {
            console.error('Error creating item', error);
            throw error;
        }
    }
}

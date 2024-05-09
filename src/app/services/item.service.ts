import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LogService } from './log.service';
import { SelectItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    private _router = inject(Router);
    private _logService = inject(LogService);

    private baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    booksImages: string[] = [
        'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg',
        'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG',
        'https://pictures.abebooks.com/inventory/30813148918.jpg',
        'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg',
        'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG',
        'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg',
        'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
        'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg',
        'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp',
        'https://planetalibro.net/biblioteca/e/s/esquilo/esquilo-los-siete-contra-tebas/esquilo-los-siete-contra-tebas.webp',
        'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG',
        'https://pictures.abebooks.com/inventory/30813148918.jpg',
        'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg',
        'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG',
        'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg',
        'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
        'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg',
        'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp',
        'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg',
        'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG',
        'https://pictures.abebooks.com/inventory/30813148918.jpg',
        'https://m.media-amazon.com/images/I/511ZSAP8PlL.jpg',
        'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG',
        'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg',
        'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
        'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg',
        'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp',
    ];

    cdsImages: string[] = [
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/the-velvet-underground-nico-the-velvet-underground-1967/4247777-1-esl-ES/the-velvet-underground-nico-the-velvet-underground-1967.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/abbey-road-the-beatles-1969/4248779-1-esl-ES/abbey-road-the-beatles-1969.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/aladdin-sane-david-bowie-1973/4247647-1-esl-ES/aladdin-sane-david-bowie-1973.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/the-dark-side-of-the-moon-pink-floyd-1973/4247827-1-esl-ES/the-dark-side-of-the-moon-pink-floyd-1973.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/unkown-pleasures-joy-division-1979/4247687-1-esl-ES/unkown-pleasures-joy-division-1979.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/back-in-black-ac-dc-1980/4247697-1-esl-ES/back-in-black-ac-dc-1980.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/power-corruption-lies-new-order-1983/4247837-1-esl-ES/power-corruption-lies-new-order-1983.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/born-in-the-u.s.a.-bruce-sprinsteen-1984/4247767-1-esl-ES/born-in-the-u.s.a.-bruce-sprinsteen-1984.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/slave-to-the-rhythm-grace-jones-1985/4247747-1-esl-ES/slave-to-the-rhythm-grace-jones-1985.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/live-after-death-iron-maiden-1985/4247657-1-esl-ES/live-after-death-iron-maiden-1985.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/true-blue-madonna-1986/4247817-1-esl-ES/true-blue-madonna-1986.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/nevermind-nirvana-1991/4247807-1-esl-ES/nevermind-nirvana-1991.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/tragic-kingdom-no-doubt-1995/4247797-1-esl-ES/tragic-kingdom-no-doubt-1995.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/homogenic-bjoerk-1997/4247717-1-esl-ES/homogenic-bjoerk-1997.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/is-this-it-the-strokes-2001/4247757-1-esl-ES/is-this-it-the-strokes-2001.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/american-idiot-green-day-2004/4247727-1-esl-ES/american-idiot-green-day-2004.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/graduation-kanye-west-2007/4247677-1-esl-ES/graduation-kanye-west-2007.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/yes-pet-shop-boys-2009/4247707-1-esl-ES/yes-pet-shop-boys-2009.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/beyonce-beyonce-2013/4247737-1-esl-ES/beyonce-beyonce-2013.jpg?resize=980:*',
        'https://hips.hearstapps.com/es.h-cdn.co/hares/images/cultura/ocio/portadas-de-discos-y-de-albums-de-musica-mas-importantes-del-s.xx/lp1-fka-twings-2014/4247787-1-esl-ES/lp1-fka-twings-2014.jpg?resize=980:*',
    ];

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

    async getItemsByQuery(query: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search-items/${query}`, {
                    observe: 'response',
                }),
            );

            if (response.status === 200) {
                const items = response.body;
                items.forEach((item: any) => {
                    if (item.item_type === 'Book') {
                        const randomIndex = Math.floor(Math.random() * this.booksImages.length);
                        item.image = this.booksImages[randomIndex];
                    } else if (item.item_type === 'CD') {
                        const randomIndex = Math.floor(Math.random() * this.cdsImages.length);
                        item.image = this.cdsImages[randomIndex];
                    } else {
                        // Handle other item types if needed
                    }
                });
                return items;
            }
        } catch (error: any) {
            console.error('Error fetching items', error);
            throw error;
        }
    }

    async getItemsAvailablesByQuery(query: string) {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/items/search-availables/${query}`, {
                    observe: 'response',
                }),
            );

            if (response.status === 200) {
                const items = response.body;
                items.forEach((item: any) => {
                    if (item.item_type === 'Book') {
                        const randomIndex = Math.floor(Math.random() * this.booksImages.length);
                        item.image = this.booksImages[randomIndex];
                    } else if (item.item_type === 'CD') {
                        const randomIndex = Math.floor(Math.random() * this.cdsImages.length);
                        item.image = this.cdsImages[randomIndex];
                    } else {
                        // Handle other item types if needed
                    }
                });
                return items;
            }
        } catch (error: any) {
            console.error('Error fetching items', error);
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

    async getCenters() {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/centers/get-centers/`, {
                    observe: 'response',
                }),
            );

            const centersObject = response.body;

            // Convertir el objeto a un array de objetos SelectItem
            const centersArray: SelectItem[] = Object.keys(centersObject).map((key) => ({
                label: centersObject[key],
                value: key,
            }));

            return centersArray;
        } catch (error: any) {
            console.error('Error fetching centers', error);
            throw error;
        }
    }

    async getCentersObject() {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/centers/get-centers/`, {
                    observe: 'response',
                }),
            );

            return response.body;
        } catch (error: any) {
            console.error('Error fetching center', error);
            throw error;
        }
    }

    async getPublishers() {
        try {
            const response: any = await firstValueFrom(
                this.http.get(`${this.baseUrl}/books/get-publishers/`, {
                    observe: 'response',
                }),
            );

            const publishersObject = response.body;

            // Convertir el objeto a un array de objetos SelectItem
            const publishersArray: SelectItem[] = Object.keys(publishersObject).map((key) => ({
                label: publishersObject[key],
                value: key,
            }));

            return publishersArray;
        } catch (error: any) {
            console.error('Error fetching publishers', error);
            throw error;
        }
    }

    async getItemsByAdvancedQuery(
        item_type: string = '',
        search: string = '',
        status: string = '',
        center: string = '',
        edition_date_start: string = '',
        edition_date_end: string = '',
        publisher: string = '',
        language: string = '',
    ) {
        try {
            const response: any = await firstValueFrom(
                this.http.post(
                    `${this.baseUrl}/items/search-advanced/`,
                    {
                        item_type,
                        search,
                        status,
                        center,
                        edition_date_start,
                        edition_date_end,
                        publisher,
                        language,
                    },
                    {
                        observe: 'response',
                    },
                ),
            );

            if (response.status === 200) {
                const items = response.body.item_copies;
                items.forEach((item: any) => {
                    if (item.item_type === 'llibre') {
                        const randomIndex = Math.floor(Math.random() * this.booksImages.length);
                        item.image = this.booksImages[randomIndex];
                    } else if (item.item_type === 'cd') {
                        const randomIndex = Math.floor(Math.random() * this.cdsImages.length);
                        item.image = this.cdsImages[randomIndex];
                    } else {
                        console.log('ItemService - getItemsByAdvancedQuery - item_type', item.item_type);
                    }
                });

                return items;
            } else {
                this._logService.logError('Returned Items', `La consulta avanzada devolvió un error`, 'ItemService - searchQueryPaginator');
                return response;
            }
        } catch (error: any) {
            this._logService.logError('UNDEFINED ERROR', `Error: ${error.me}`, 'ItemService - searchQueryOnlyAvailable');
            console.error('Error fetching items', error);
            throw error;
        }
    }
}

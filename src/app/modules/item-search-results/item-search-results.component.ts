import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { SelectItemGroup } from 'primeng/api';
import { LibrosComponent } from '../libros/libros.component';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { LogService } from '../../services/log.service';

interface onUpload {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'app-item-search-results',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        LibrosComponent,
        CommonModule,
        DropdownModule,
        ButtonModule,
        AutoCompleteModule,
        FormsModule,
        PanelModule,
        CalendarModule,
        InputTextModule,
        SelectButtonModule,
        RouterLink,
        PaginatorModule,
    ],
    templateUrl: './item-search-results.component.html',
    styleUrl: './item-search-results.component.css',
})
export class ItemSearchResultsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private _router = inject(Router);
    private _logService = inject(LogService);
    private _itemService = inject(ItemService);
    private _dialogService = inject(DialogService);

    public booksImages: string[] = [
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

    public cdsImages: string[] = [
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

    fb: FormBuilder = inject(FormBuilder);
    public areSettingsVisible = false;

    private filterChangeTimeout: any;
    public value: string | undefined;
    inputTitol: string = '';

    public selectedItem: string = '';
    public checked: boolean = false;
    private query: string = '';
    private onlyAvailable!: string;

    public items!: any[];
    public totalItems!: number;
    public actualPage: number = 1;
    public first: number = 0;
    public rows: number = 10;

    async ngOnInit() {
        this._logService.logInfo('Initializing SearchComponent', 'Inicializando SearchComponent', 'SearchComponent - ngOnInit()');

        this.route.queryParams.subscribe((params) => {
            this.query = params['cerca'];

            this.onlyAvailable = params['disponibles'];
        });

        if (this.query) {
            await this.loadPage(this.actualPage);
            console.log('SearchComponent | ngOnInit - items -> ', this.items);
        }

        this.formGroup = new FormGroup({
            value: new FormControl('Títol'),
        });
    }

    async loadPage(page: number) {
        if (this.onlyAvailable) {
            this.items = await this.searchItemsOnlyAvailable(this.query, page, this.rows);
        } else {
            this.items = await this.searchItems(this.query, page, this.rows);
        }
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        let newPage = this.first / this.rows + 1;
        this.loadPage(newPage);
    }

    getRandomImage(array: string[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    toggleSettings() {
        this.areSettingsVisible = !this.areSettingsVisible;
    }

    // async searchItems(item: string) {
    //     try {
    //         const response: any = await this._itemService.autocompleatQuery(item);
    //         console.log('HomeComponent | searchItems - response -> ', response);

    //         this.items = response;
    //         suggestions: [] = this.items.map((item) => item.name);
    //     } catch (error: any) {
    //         console.error('Error fetching items', error);
    //         this._dialogService.showDialog('ERROR', "No s'han pogut carregar els resultats de la cerca. Si us plau, torna-ho a provar més tard.");
    //     }
    // }

    async searchItemsOnlyAvailable(query: string, page: number, pageSize: number) {
        try {
            const response: any = await this._itemService.searchQueryOnlyAvailablePagination(query, page, pageSize);
            console.log('SearchComponent | searchItemsOnlyAvailable - response -> ', response);

            if (response.status === 200) {
                return response.body;
            } else if (response.status === 404) {
                this._dialogService.showDialog('INFO', 'No hi ha cap element disponible amb aquesta cerca.');
                return response.body;
            }
        } catch (error: any) {
            console.error('Error fetching items', error);
            this._dialogService.showDialog('ERROR', "No s'han pogut carregar els resultats de la cerca. Si us plau, torna-ho a provar més tard.");
            throw error;
        }
    }

    async searchItems(query: string, page: number, pageSize: number) {
        try {
            const response: any = await this._itemService.searchQueryPaginator(query, page, pageSize);
            console.log('SearchComponent | searchItems - response -> ', response);

            if (response.status === 200) {
                return response.body;
            } else if (response.status === 404) {
                this._dialogService.showDialog('INFO', 'No hi ha cap element amb aquesta cerca.');
                return response.body;
            }
        } catch (error: any) {
            console.error('Error fetching items', error);
            this._dialogService.showDialog('ERROR', "No s'han pogut carregar els resultats de la cerca. Si us plau, torna-ho a provar més tard.");
            throw error;
        }
    }

    onSelectItem(item: any) {
        console.log('Item selected', item);

        this._logService.logInfo('Item selected', `Item with id ${item.id} has been selected ('${item.name}')`, 'HomeComponent - onItemSelect');

        this._logService.logInfo('Redirect', `Redirecció a la pàgina de /itemDetails`, 'HomeComponent - viewItemDetails');
        this._router.navigate(['/detall-item/', item.id]);
    }

    // // ACORDEÓN
    panelsGeneralState = 0;

    detectPanelChanges(a: boolean, index: string) {
        this.panels[index] = a;
        this.panelsGeneralState = Object.values(this.panels).every((value) => value)
            ? 0
            : Object.values(this.panels).every((value) => !value)
            ? 1
            : 2;
    }

    panels: { [key: string]: boolean } = {
        cercaAvancadaAcordeon: true,
    };

    configuracionAcordeon: FormGroup = this.fb.group({
        cercaAvancadaAcordeon: this.fb.group({
            inputTitol: [null],
            inputAutorArtista: [null],
            materiaInput: [null],
            tipusDeMaterial: [null],
            inputLlengua: [null],
            inputAny: [null],
            dropdownEditorial: [null],
            selectOrdenarPer: [null],
        }),
    });

    getCompleteconfiguracionAcordeon() {
        if (!this.configuracionAcordeon.valid) return null;
        const configuracionAcordeon: any = this.configuracionAcordeon.value;
        return configuracionAcordeon;
    }

    sendconfiguracionAcordeon() {
        const configuracionAcordeon = this.getCompleteconfiguracionAcordeon();
        if (!configuracionAcordeon) return;
    }

    // SELECT BUTTON
    formGroup!: FormGroup;

    stateOptions: any[] = [
        { label: 'Títol', value: 'Títol' },
        { label: 'Data', value: 'Data' },
    ];
}

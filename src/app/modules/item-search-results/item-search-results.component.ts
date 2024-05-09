import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
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
        SliderModule,
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
    private router = inject(Router);

    fb: FormBuilder = inject(FormBuilder);
    areSettingsVisible = false;

    private query: string = '';
    private onlyAvailable!: string;
    private filterChangeTimeout: any;

    value: string | undefined;
    inputTitol: string = '';

    selectedItem: any;
    checked: boolean = false;

    isAdvancedOptions: boolean = false;
    items!: any[];
    currentItems!: any[];
    totalItems!: number;
    actualPage: number = 1;
    first: number = 0;
    rows: number = 25;

    typesItemsArray = [
        { name: 'Llibres', value: 'llibre' },
        { name: 'CDs', value: 'cd' },
        { name: 'DVDs', value: 'cd' },
        { name: 'Revistes', value: 'llibre' },
        { name: 'Dispositus', value: 'dispositiu' },
    ];
    typeItem!: any;

    statusArray = [
        { name: 'Lliure', value: 'Available' },
        { name: 'Indiferent', value: 'Indiferent' },
        { name: 'En préstec', value: 'Loaned' },
    ];
    status!: any;

    centersArray!: any;
    center!: any;
    centersObject: any;

    publishDateMin!: Date;
    publishDateMax!: Date;

    publisherArray!: any;
    publisher!: any;

    languagesArray = [
        { name: 'Català', value: 'ca' },
        { name: 'Espanyol', value: 'es' },
        { name: 'Anglès', value: 'en' },
    ];
    language!: any;

    searchQuery: string = '';

    async ngOnInit() {
        this._logService.logInfo('Initializing SearchComponent', 'Inicializando SearchComponent', 'SearchComponent - ngOnInit()');

        this.route.queryParams.subscribe((params) => {
            this.query = params['cerca'];

            this.onlyAvailable = params['disponibles'];
        });

        this.centersArray = await this._itemService.getCenters();
        console.log('Centers-------------------------------', this.centersArray);

        this.publisherArray = await this._itemService.getPublishers();

        if (this.query) {
            if (this.onlyAvailable) {
                this.items = await this._itemService.getItemsAvailablesByQuery(this.query);
            } else {
                this.items = await this._itemService.getItemsByQuery(this.query);
            }
            this.updateDisplayItems();
        }

        this.formGroup = new FormGroup({
            value: new FormControl('Títol'),
        });
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.updateDisplayItems();
    }

    updateDisplayItems() {
        this.currentItems = this.items.slice(this.first, this.first + this.rows);
        console.log('currentItems ---> ', this.currentItems);
    }

    toggleSettings() {
        this.areSettingsVisible = !this.areSettingsVisible;
    }

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

    async searchItems(query: string) {
        try {
            this._logService.logInfo('Search query', `Consulta de búsqueda: "${this.searchQuery}"`, 'HomeComponent - searchItems');
            const response: any = await this._itemService.autocompleatQuery(query);

            this.items = response;
            suggestions: [] = this.items.map((item) => item.name);
        } catch (error: any) {
            console.error('Error fetching items', error);
            this._dialogService.showDialog('ERROR', "No s'han pogut carregar els resultats de la cerca. Si us plau, torna-ho a provar més tard.");
        }
    }

    onFilterChange() {
        clearTimeout(this.filterChangeTimeout);
        this.filterChangeTimeout = setTimeout(() => {
            if (this.searchQuery.length >= 3) {
                this.searchItems(this.searchQuery);
            } else {
                this.items = [];
            }
        }, 500);
    }

    onItemSelect(event: any) {
        this.selectedItem = event.value;
        console.log('Item selected', this.selectedItem);

        this._logService.logInfo(
            'Item selected',
            `Item with id ${this.selectedItem.id} has been selected ('${this.selectedItem.name}')`,
            'HomeComponent - onItemSelect',
        );

        this.viewItemDetails();
    }

    viewItemDetails() {
        console.log('View item details');
        if (this.selectedItem) {
            this._logService.logInfo('Redirect', `Redirecció a la pàgina de /itemDetails`, 'HomeComponent - viewItemDetails');
            this.router.navigate(['/detall-item/', this.selectedItem.id]);
        } else {
            this._dialogService.showDialog('ERROR', "No s'ha seleccionat cap element");
            this._logService.logWarning(
                'View item details',
                'It was not possible to view the details of the items because no items were selected.',
                'HomeComponent - viewItemDetails',
            );
        }
    }

    onSelectItem(item: any) {
        console.log('Item selected', item);

        this._logService.logInfo('Item selected', `Item with id ${item.id} has been selected ('${item.name}')`, 'HomeComponent - onItemSelect');

        this._logService.logInfo('Redirect', `Redirecció a la pàgina de /itemDetails`, 'HomeComponent - viewItemDetails');
        this._router.navigate(['/detall-item/', item.id]);
    }

    onSelectItemFilter(item: any) {
        console.log('Item selected', item);

        this._logService.logInfo(
            'Item selected',
            `Item with id ${item.item_id} has been selected ('${item.item_name}')`,
            'HomeComponent - onItemSelect',
        );

        this._logService.logInfo('Redirect', `Redirecció a la pàgina de /itemDetails`, 'HomeComponent - viewItemDetails');
        this._router.navigate(['/detall-item/', item.item_id]);
    }

    async advancedSearch() {
        try {
            let query = '';
            let type = '';
            let status = '';
            let center = '';
            let publishDateMin = '';
            let publishDateMax = '';
            let publisher = '';
            let language = '';

            if (this.searchQuery) {
                query = this.searchQuery;
            }
            if (this.typeItem && this.typeItem.value) {
                type = this.typeItem.value;
            }
            if (this.status && this.status.value) {
                status = this.status.value;
            }
            if (this.center && this.center.value) {
                center = this.center.value;
            }
            if (this.publishDateMin) {
                publishDateMin = this.publishDateMin.toISOString();
            }
            if (this.publishDateMax) {
                publishDateMax = this.publishDateMax.toISOString();
            }
            if (this.publisher && this.publisher.value) {
                publisher = this.publisher.value;
            }
            if (this.language && this.language.value) {
                language = this.language.value;
            }
            if (query || type || status || center || publishDateMin || publishDateMax || publisher || language) {
                const response: any = await this._itemService.getItemsByAdvancedQuery(
                    type,
                    query,
                    status,
                    center,
                    publishDateMin,
                    publishDateMax,
                    publisher,
                    language,
                );
                // console.log('Advanced search results', response);

                if (response) {
                    this.isAdvancedOptions = true;
                    this.items = response;
                    this.updateDisplayItems();
                    this.centersObject = await this._itemService.getCentersObject();
                    console.log('CentersObject-------------------------------', this.centersObject);
                }

                suggestions: [] = this.items.map((item) => item.name);
            }
        } catch (error: any) {
            console.error('Error fetching items', error);
            this._dialogService.showDialog('ERROR', "No s'han pogut carregar els resultats de la cerca. Si us plau, torna-ho a provar més tard.");
        }
    }
}

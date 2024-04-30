import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { SelectItemGroup } from 'primeng/api';
import { LibrosComponent } from './libros/libros.component';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';

interface onUpload {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'app-search',
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
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);

    filterChangeTimeout: any;
    value: string | undefined;

    // INPUT
    inputTitol: string = '';

    books: {
        image: string;
    }[] = [];

    fb: FormBuilder = inject(FormBuilder);

    // DROPDOWN
    groupedCities: SelectItemGroup[];
    selectedCity: string | undefined;

    constructor() {
        this.books.push(
            { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
            { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
            { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
            { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
            { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
            { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
            {
                image: 'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
            },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
            { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
            { image: 'https://planetalibro.net/biblioteca/e/s/esquilo/esquilo-los-siete-contra-tebas/esquilo-los-siete-contra-tebas.webp' },
            { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
            { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
            { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
            { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
            { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
            {
                image: 'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
            },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
            { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
            { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
            { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
            { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
            { image: 'https://m.media-amazon.com/images/I/511ZSAP8PlL.jpg' },
            { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
            { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
            {
                image: 'https://museusdesitges.cat/sites/default/files/styles/img700/public/lalegria_que_passa_de_s._rusinol_30.771.jpg?itok=X2FoltJg',
            },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
            { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
        ),
            (this.groupedCities = [
                {
                    label: 'Tipus',
                    value: 'TI',
                    items: [
                        { label: 'Llibre', value: 'LLIB' },
                        { label: 'Revista', value: 'REVI' },
                        { label: 'CD', value: 'CD' },
                        { label: 'Dispositiu', value: 'DISP' },
                    ],
                },
                {
                    label: "Any d'edició",
                    value: 'ADE1',
                    items: [{ label: "Any d'edició", value: 'ADE2' }],
                },
                {
                    label: 'Editorial',
                    value: 'ED1',
                    items: [{ label: 'Editorial', value: 'ED2' }],
                },
                {
                    label: 'Llengua',
                    value: 'LLE1',
                    items: [{ label: 'Llengua', value: 'LLE2' }],
                },
                {
                    label: 'Centre',
                    value: 'CE',
                    items: [{ label: 'Biblioteca', value: 'BI' }],
                },
                {
                    label: 'Préstec',
                    value: 'jp',
                    items: [
                        { label: 'En préstec', value: 'EP' },
                        { label: 'Lliure', value: 'LLI' },
                        { label: 'Indiferent', value: 'IN' },
                    ],
                },
            ]);
    }

    // AUTOCOMPLETE
    items: any[] = [];

    selectedItem: string = '';

    checked: boolean = false;

    async searchItems(item: string) {
        try {
            const response: any = await this._itemService.searchQuery(item);
            console.log('HomeComponent | searchItems - response -> ', response);

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
            if (this.selectedItem.length >= 3) {
                this.searchItems(this.selectedItem);
            } else {
                this.items = [];
            }
        }, 1000);
    }

    getItemName(item: any) {
        return item.name;
    }

    onItemSelect(event: any) {
        const itemId = event.value.id;
        console.log('HomeComponent | onItemSelect - itemId -> ', itemId);
    }

    // ACORDEÓN
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

    ngOnInit() {
        this.formGroup = new FormGroup({
            value: new FormControl('Títol'),
        });
    }
}
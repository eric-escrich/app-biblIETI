import { Component, inject } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FormValidationService } from '../../services/validations-service.service';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-create-item',
    standalone: true,
    imports: [RouterLink, FormsModule, InputTextModule, ButtonModule, CalendarModule, CheckboxModule],
    templateUrl: './create-item.component.html',
    styleUrl: './create-item.component.css',
})
export class CreateItemComponent {
    private config = inject(PrimeNGConfig);
    private _itemService = inject(ItemService);
    private _formValidationService = inject(FormValidationService);
    private _dialogService = inject(DialogService);
    private _router = inject(Router);

    selectedType: string = 'Book';
    book!: any;

    // isbn = '9788498382662';
    searchIsbn = '';
    title = '';
    material = '';
    author = '';
    editionDate: Date = new Date();
    cdu = '';
    isbn = '';
    publisher = '';
    collection = '';
    pages!: number;
    language = '';
    loanAvailable = true;

    invalidForm = false;
    invalidTitle = false;
    invalidMaterial = false;
    invalidAuthor = false;
    invalidEditionDate = false;
    invalidCdu = false;
    invalidIsbn = false;
    invalidPublisher = false;
    invalidCollection = false;
    invalidPages = false;
    invalidLanguage = false;

    titleValid = false;
    materialValid = false;
    authorValid = false;
    dateValid = false;
    cduValid = false;
    isbnValid = false;
    publisherValid = false;
    collectionValid = false;
    pagesValid = false;
    languageValid = false;

    errorMessage = '';

    async ngOnInit() {
        await this.searchBookByISBN(this.isbn);

        this.config.setTranslation({
            dayNames: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
            dayNamesShort: ['dil', 'dmt', 'dmc', 'djs', 'div', 'dis', 'dug'],
            dayNamesMin: ['Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
            monthNames: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
            monthNamesShort: ['gen', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'des'],
            today: 'Avui',
            clear: 'Netejar',
        });
    }

    async searchBookByISBN(isbn: string) {
        try {
            if (isbn.length > 0) {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
                const data = await response.json();

                console.log('Book:', data);

                this.book = data['items'][0];
                if (this.book) {
                    const volumeInfo = this.book.volumeInfo;

                    this.title = volumeInfo.title || '';
                    this.material = '';
                    this.author = volumeInfo.authors ? volumeInfo.authors.join(', ') : '';
                    this.editionDate = new Date(volumeInfo.publishedDate) || new Date();
                    this.isbn = this.searchIsbn;
                    this.publisher = volumeInfo.publisher || '';
                    this.collection = volumeInfo.categories ? volumeInfo.categories[0] : '';
                    this.pages = volumeInfo.pageCount || 0;
                    this.language = volumeInfo.language || '';
                } else {
                    console.log('No se encontró ningún libro con ese ISBN.');
                }
            }
        } catch (error) {
            console.error('Error al buscar el libro:', error);
        }
    }

    nextStep(field: string) {
        switch (field) {
            case 'material':
                if (this.title.length > 0) {
                    this.invalidTitle = false;
                    this.titleValid = true;
                    this.errorMessage = '';
                    // Lógica adicional de validación si es necesario
                } else {
                    this.invalidForm = true;
                    this.invalidTitle = true;
                    this.errorMessage = 'El títol és obligatori';
                }
                break;

            case 'author':
                this.invalidMaterial = false;
                this.materialValid = true;
                this.errorMessage = '';
                break;

            case 'date':
                if (this.author.length > 0) {
                    this.invalidAuthor = false;
                    this.authorValid = true;
                    this.errorMessage = '';
                    // Lógica adicional de validación si es necesario
                } else {
                    this.invalidForm = true;
                    this.invalidAuthor = true;
                    this.errorMessage = "L'autor és obligatori";
                }
                break;

            case 'cdu':
                try {
                    const fecha = new Date(this.editionDate);
                    if (!isNaN(Number(fecha)) && fecha instanceof Date && !isNaN(fecha.getTime())) {
                        this.invalidEditionDate = false;
                        this.dateValid = true;
                        this.errorMessage = '';
                    } else {
                        throw new Error('Invalid date');
                    }
                } catch (error) {
                    this.invalidForm = true;
                    this.invalidEditionDate = true;
                    this.dateValid = false;
                    this.errorMessage = 'Introdueix una data vàlida';
                }
                break;

            case 'isbn':
                if (this.cdu !== undefined && this.cdu.toString().length > 0) {
                    if (this.cdu.toString().length >= 2 && Number.isInteger(+this.cdu)) {
                        this.invalidCdu = false;
                        this.cduValid = true;
                        this.errorMessage = '';
                        // Lógica adicional de validación si es necesario
                    } else {
                        this.invalidForm = true;
                        this.invalidCdu = true;
                        this.errorMessage = 'El codi CDU és invàlid';
                    }
                } else {
                    this.invalidForm = true;
                    this.invalidCdu = true;
                    this.errorMessage = 'El codi CDU és obligatori';
                }
                break;

            case 'publisher':
                if (this.isbn !== undefined && this.isbn.toString().length > 0) {
                    this.invalidIsbn = this._formValidationService.isValidIsbn(this.isbn);
                    if (!this.invalidIsbn) {
                        this.invalidForm = true;
                        this.errorMessage = 'El codi ISBN és invàlid';
                        return;
                    }
                    this.invalidIsbn = false;
                    this.isbnValid = true;
                    this.errorMessage = '';
                } else {
                    this.invalidForm = true;
                    this.invalidIsbn = true;
                    this.errorMessage = 'El codi ISBN és obligatori';
                }

                break;

            case 'collection':
                this.invalidPublisher = false;
                this.publisherValid = true;
                this.errorMessage = '';
                break;

            case 'pages':
                this.invalidCollection = false;
                this.collectionValid = true;
                this.errorMessage = '';
                break;

            case 'language':
                if (this.pages !== undefined) {
                    if (Number.isInteger(+this.pages)) {
                        this.invalidPages = false;
                        this.pagesValid = true;
                        this.errorMessage = '';
                        // Lógica adicional de validación si es necesario
                    } else {
                        this.invalidForm = true;
                        this.invalidPages = true;
                        this.errorMessage = 'El número de pàgines és invàlid';
                    }
                } else {
                    this.invalidForm = true;
                    this.invalidPages = true;
                    this.errorMessage = 'El número de pàgines són obligatòries';
                }

                break;

            case 'loanAvailable':
                if (this.language.length > 0) {
                    this.invalidLanguage = false;
                    this.languageValid = true;
                    this.errorMessage = '';
                    // Lógica adicional de validación si es necesario
                } else {
                    this.invalidForm = true;
                    this.invalidLanguage = true;
                    this.errorMessage = "L'idioma és obligatori";
                }
                break;

            default:
                break;
        }
    }

    reset(field: string) {
        switch (field) {
            case 'title':
                this.invalidTitle = false;
                this.errorMessage = '';

                this.titleValid = false;
                this.materialValid = false;
                this.authorValid = false;
                this.dateValid = false;
                this.cduValid = false;
                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'material':
                this.invalidMaterial = false;
                this.errorMessage = '';

                this.materialValid = false;
                this.authorValid = false;
                this.dateValid = false;
                this.cduValid = false;
                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'author':
                this.invalidAuthor = false;
                this.errorMessage = '';

                this.authorValid = false;
                this.dateValid = false;
                this.cduValid = false;
                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'date':
                this.invalidEditionDate = false;
                this.errorMessage = '';

                this.dateValid = false;
                this.cduValid = false;
                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'cdu':
                this.invalidCdu = false;
                this.errorMessage = '';

                this.cduValid = false;
                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'isbn':
                this.invalidIsbn = false;
                this.errorMessage = '';

                this.isbnValid = false;
                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'publisher':
                this.invalidPublisher = false;
                this.errorMessage = '';

                this.publisherValid = false;
                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'collection':
                this.invalidCollection = false;
                this.errorMessage = '';

                this.collectionValid = false;
                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'pages':
                this.invalidPages = false;
                this.errorMessage = '';

                this.pagesValid = false;
                this.languageValid = false;
                break;

            case 'language':
                this.invalidLanguage = false;
                this.errorMessage = '';

                this.languageValid = false;
                break;
        }
    }

    async onSubmit() {
        this.invalidTitle = this._formValidationService.isEmpty(this.title);
        if (this.invalidTitle) {
            this.invalidForm = true;
            this.errorMessage = "El nom d'usuari es obligatori";
            this._dialogService.showDialog('ERROR', 'El titol es obligatori');
            return;
        }

        this.invalidAuthor = this._formValidationService.isEmpty(this.author);
        if (this.invalidAuthor) {
            this.invalidForm = true;
            this.errorMessage = "No has introduit l'autor";
            this._dialogService.showDialog('ERROR', 'Llautor és obligatori');
            return;
        }

        if (this.editionDate.toDateString().length > 0) {
        }

        if (this.cdu !== undefined) {
            this.invalidCdu = this.cdu.toString().length < 2;
            if (this.invalidCdu) {
                this.invalidForm = true;
                this.errorMessage = 'El codi CDU ha de contenir com a mímim 2 xifres';
                this._dialogService.showDialog('ERROR', 'El codi CDU es invàlid');
                return;
            }
        }

        this.invalidIsbn = this._formValidationService.isEmpty(this.isbn);
        if (!this.invalidIsbn) {
            this.invalidIsbn = !this._formValidationService.isValidIsbn(this.isbn);
            if (this.invalidIsbn) {
                this.invalidForm = true;
                this.errorMessage = 'El codi ISBN és invalid';
                this._dialogService.showDialog('ERROR', 'El codi ISBN és invalid');
                return;
            }
        } else {
            this.invalidForm = true;
            this.errorMessage = 'No has introduït el codi ISBN';
            this._dialogService.showDialog('ERROR', 'El codi ISBN és obligatori');
            return;
        }

        this.invalidPages = this.pages.toString().length === 0;
        if (this.invalidPages) {
            this.invalidForm = true;
            this.errorMessage = 'El nùmero de pàgines són obligatòries';
            this._dialogService.showDialog('ERROR', 'El nùmero de pàgines són obligatòries');
            return;
        }

        this.invalidLanguage = this._formValidationService.isEmpty(this.language);
        if (this.invalidLanguage) {
            this.invalidForm = true;
            this.errorMessage = "L'idioma és obligatori";
            this._dialogService.showDialog('ERROR', "L'idioma és obligatori");
            return;
        }

        await this.saveItem();
    }

    async saveItem() {
        try {
            await this._itemService.createItem(
                this.selectedType,
                this.title,
                this.author,
                this.loanAvailable,
                this.editionDate,
                this.cdu.toString(),
                this.isbn,
                this.publisher,
                this.collection,
                this.pages,
                this.language,
            );

            this._dialogService.showDialog('INFORMACIÓ', 'Llibre creat correctament');
            this._router.navigate(['/dashboard']);
        } catch (error) {
            console.error('Error al crear el llibre:', error);
            this._dialogService.showDialog('ERROR', 'Error al crear el llibre');
        }
    }
}

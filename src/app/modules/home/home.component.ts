import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { LoginComponent } from '../../core/auth/login/login.component';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { LogService } from '../../services/log.service';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, AutoCompleteModule, FormsModule, MenuModule, RouterLink, ToastModule, LoginComponent, CheckboxModule],
    providers: [MessageService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);
    _logService = inject(LogService);

    filterChangeTimeout: any;

    // POP UP OLVIDAR CONTRASEÑA
    popupVisible = false;
    showPopup() {
        this.popupVisible = true;
    }

    onlyAvailable: boolean = false;
    checked: boolean = false;

    items: any[] = [];

    selectedItem: any;

    searchQuery: string = '';

    ngOnInit() {
        this._logService.logInfo('Initializing HomeComponent', 'Inicializando HomeComponent', 'HomeComponent - ngOnInit()');
    }

    async searchItems(query: string) {
        try {
            this._logService.logInfo('Search query', `Consulta de búsqueda: "${this.searchQuery}"`, 'HomeComponent - searchItems');
            const response: any = await this._itemService.searchQuery(query);

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
        }, 1000);
    }

    getItemName(item: any) {
        return item.name;
    }

    onItemSelect(event: any) {
        this.selectedItem = event.value;
        console.log('Item selected', this.selectedItem);

        this._logService.logInfo(
            'Item selected',
            `Item with id ${this.selectedItem.id} has been selected ('${this.selectedItem.name}')`,
            'HomeComponent - onItemSelect',
        );
    }

    viewItemDetails() {
        console.log('View item details');

        if (this.selectedItem) {
            this._logService.logInfo(
                'View item details',
                `Viewing details of item with id = ${this.selectedItem.id} ('${this.selectedItem.name}')`,
                'HomeComponent - viewItemDetails',
            );
            this._logService.logInfo('Redirect', `Redirecció a la pàgina de /itemDetails`, 'HomeComponent - viewItemDetails');
            this.router.navigate(['/itemDetails', this.selectedItem.id]);
        } else {
            this._dialogService.showDialog('ERROR', "No s'ha seleccionat cap element");
            this._logService.logWarning(
                'View item details',
                'It was not possible to view the details of the items because no items were selected.',
                'HomeComponent - viewItemDetails',
            );
        }
    }

    filterAvailableItems() {
        if (this.onlyAvailable) {
            this.items = this.items.filter(item => item.available);
        } else {
            this.searchItems(this.selectedItem);
        }
    }
    
}
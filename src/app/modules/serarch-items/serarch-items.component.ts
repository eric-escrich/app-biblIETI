import { Component, inject } from '@angular/core';
import { LogService } from '../../services/log.service';
import { DialogService } from '../../services/dialog.service';
import { ItemService } from '../../services/item.service';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from '../../core/auth/login/login.component';
import { CheckboxModule } from 'primeng/checkbox';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-serarch-items',
    standalone: true,
    imports: [ButtonModule, AutoCompleteModule, FormsModule, MenuModule, RouterLink, ToastModule, LoginComponent, CheckboxModule],
    templateUrl: './serarch-items.component.html',
    styleUrl: './serarch-items.component.css',
})
export class SerarchItemsComponent {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);
    _logService = inject(LogService);

    onlyAvailable: boolean = false;
    checked: boolean = false;

    items: any[] = [];

    selectedItem: any;

    searchQuery: string = '';

    filterChangeTimeout: any;

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
            this.router.navigate(['/detall-llibre/', this.selectedItem.id]);
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
            this.items = this.items.filter((item) => item.available);
        } else {
            this.searchItems(this.selectedItem);
        }
    }
}

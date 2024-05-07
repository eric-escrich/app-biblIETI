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
    selector: 'app-item-searcher',
    standalone: true,
    imports: [ButtonModule, AutoCompleteModule, FormsModule, MenuModule, RouterLink, ToastModule, LoginComponent, CheckboxModule],
    templateUrl: './item-searcher.component.html',
    styleUrl: './item-searcher.component.css',
})
export class ItemSearcherComponent {
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

    filterAvailableItems() {
        if (this.onlyAvailable) {
            this.items = this.items.filter((item) => item.available);
        } else {
            this.searchItems(this.selectedItem);
        }
    }

    onSearch() {
        if (this.searchQuery) {
            this._logService.logInfo('Redirect', `Redirecció a la pàgina de /resultats-cerca`, 'HomeComponent - onSearch');
            if (this.onlyAvailable) {
                this.router.navigate(['resultats-cerca'], { queryParams: { cerca: this.searchQuery, disponibles: this.onlyAvailable } });
            } else {
                this.router.navigate(['resultats-cerca'], { queryParams: { cerca: this.searchQuery } });
            }
        }
    }
}

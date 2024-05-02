import { Component, inject } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LogService } from '../../services/log.service';

@Component({
    selector: 'app-prestec',
    standalone: true,
    imports: [FormsModule, AutoCompleteModule],
    templateUrl: './prestec.component.html',
    styleUrl: './prestec.component.css',
})
export class PrestecComponent {
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);
    _logService = inject(LogService);

    email: string = '';
    itemCopyId: number = 0;
    returnDate: string = '';

    items: any[] = [];
    selectedItem: any;
    searchQuery: string = '';
    filterChangeTimeout: any;

    ngOnInit(): void {}

    async makeLoan() {
        if (!this.email || !this.itemCopyId || !this.returnDate) {
            this._dialogService.showDialog('ALERTA', 'Si us plau, ompli tots els camps.');
            return;
        }

        try {
            const response = await this._itemService.searchQuery(this.itemCopyId.toString());
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this._dialogService.showDialog('ERROR', "No s'ha trobat cap llibre amb aquest identificador.");
                    return;
                }
            } else {
                this._dialogService.showDialog('ERROR', "No s'ha trobat cap llibre amb aquest identificador.");
                return;
            }
        } catch (error: any) {
            this._dialogService.showDialog('ERROR', "No s'ha trobat cap llibre amb aquest identificador.");
            return;
        }
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

    onItemSelect(event: any) {
        this.selectedItem = event.value;
        console.log('Item selected', this.selectedItem);

        this._logService.logInfo(
            'Item selected',
            `Item with id ${this.selectedItem.id} has been selected ('${this.selectedItem.name}')`,
            'HomeComponent - onItemSelect',
        );
    }
}

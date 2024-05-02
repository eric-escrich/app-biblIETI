import { Component, inject } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-prestec',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './prestec.component.html',
    styleUrl: './prestec.component.css',
})
export class PrestecComponent {
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);

    email: string = '';
    itemCopyId: number = 0;
    returnDate: string = '';

    query: string = '';

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
}

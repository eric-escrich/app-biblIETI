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

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
                ButtonModule,
                AutoCompleteModule,
                FormsModule,
                MenuModule,
                RouterLink,
                ToastModule,
                LoginComponent,
                CheckboxModule
            ],
    providers: [MessageService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);

    filterChangeTimeout: any;

    // POP UP OLVIDAR CONTRASEÑA
    popupVisible = false;
    showPopup() {
        this.popupVisible = true;
    }

    items: any[] = [];

    selectedItem: string = '';
    onlyAvailable: boolean = false;

    checked: boolean = false;

    async searchItems(item: string) {
        try {
            const response: any = await this._itemService.searchItems(item);
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
}
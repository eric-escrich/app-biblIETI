import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ItemService } from '../../services/item.service';
import { ProfileService } from '../../services/profile.service';
import { Role } from '../../constants/role.code';
import { DropdownModule } from 'primeng/dropdown';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-item-details',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, TableModule, CalendarModule, FormsModule, DropdownModule, AutoCompleteModule],
    templateUrl: './item-details.component.html',
    styleUrl: './item-details.component.css',
})
export class ItemDetailsComponent implements OnInit {
    route = inject(ActivatedRoute);
    _profileService = inject(ProfileService);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);

    item: any;
    role!: any;
    Role = Role;

    itemId: any;

    itemCopis: any;
    availableItems: any = [];
    selectedItem: any;

    searchEmail: any;

    filterChangeTimeout: any;

    users: any;

    datosTabla = [
        { id: 18, estado: 'Disponible' },
        { id: 40, estado: 'No disponible' },
    ];

    fechaReserva: Date = new Date();

    async ngOnInit() {
        this.itemId = this.route.snapshot.paramMap.get('id')!;

        this.item = await this._itemService.getInfoItemById(this.itemId);
        console.log(this.item);

        this.itemCopis = await this.getItemsCopis();

        const profileData = await this._profileService.getSelfProfileDataFromCache();
        console.log(profileData);

        if (profileData) {
            this.role = await this._profileService.getRole();
            this.availableItems = this.itemCopis.filter((item: any) => item.status === 'Available');
        }
    }

    mostrarFormulario = false;

    toggleFormulario() {
        this.mostrarFormulario = !this.mostrarFormulario;
    }

    async getItemsCopis() {
        try {
            const response = await this._itemService.getItemsCopis(this.itemId);
            return response.copies;
        } catch (error: any) {
            console.error('Error fetching items', error);
            throw error;
        }
    }

    async searchUser(query: string) {
        try {
            console.log('searching users');

            const response: any = await this._profileService.searchUsers(query);

            this.users = response;
            suggestions: [] = this.users.map((user: any) => user.email);
        } catch (error: any) {
            console.error('Error fetching items', error);
        }
    }

    onFilterChange() {
        console.log('filter');
        clearTimeout(this.filterChangeTimeout);
        this.filterChangeTimeout = setTimeout(() => {
            if (this.searchEmail.length >= 3) {
                console.log('search user');
                this.searchUser(this.searchEmail);
            } else {
                this.users = [];
            }
        }, 1000);
    }

    async sendForm() {
        try {
            const response = await this._itemService.makeLoan(this.searchEmail.email, this.selectedItem.id, this.fechaReserva);
            console.log(response);
            if (response.status === 200) {
                this._dialogService.showDialog('INFORMACIÓ', 'Item prestat correctament');
                this.itemCopis = await this.getItemsCopis();
            }
        } catch (error: any) {
            this._dialogService.showDialog('ERROR', "No s'ha pogut realizar el prestec");
            throw error;
        }
    }
}

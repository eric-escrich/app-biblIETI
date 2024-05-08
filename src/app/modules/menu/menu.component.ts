import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { LogService } from '../../services/log.service';
import { ProfileService } from '../../services/profile.service';
import { Role } from '../../constants/role.code';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, MenubarModule, InputTextModule, ButtonModule, AutoCompleteModule, FormsModule, RouterLink, ToastModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
})
export class MenuComponent {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);
    _logService = inject(LogService);
    _profileService = inject(ProfileService);

    filterChangeTimeout: any;

    // POP UP OLVIDAR CONTRASEÑA
    popupVisible = false;
    showPopup() {
        this.popupVisible = true;
    }

    profileData!: any;
    role = computed(() => {
        const profileData: any = this._profileService.profileDataChanges();
        if (profileData) {
            switch (profileData.role) {
                case 1:
                    return 'ADMIN';
                case 2:
                    return 'BIBLIOTECÀRIA';
                case 3:
                    return 'USUARI';
                default:
                    return 'USUARI';
            }
        } else {
            return null;
        }
    });
    Role = Role;

    onlyAvailable: boolean = false;
    checked: boolean = false;

    itemsArray: any[] = []; // Renombrada a itemsArray

    selectedItem: any;

    searchQuery: string = '';
    items: any[] = [];

    constructor() {
        effect(() => {
            this.profileData = this._profileService.profileDataChanges();

            if (!this.profileData) {
                this.menuItems = [
                    {
                        label: 'Inici',
                        icon: 'pi pi-home',
                        routerLink: ['/'],
                    },
                ];
            } else {
                if (this.profileData.role == Role.ADMIN) {
                    this.menuItems = [
                        {
                            label: 'Panell de control',
                            icon: 'pi pi-table',
                            routerLink: ['/dashboard'],
                            items: [
                                {
                                    label: 'Perfil',
                                    icon: 'pi pi-user',
                                    routerLink: ['/perfil'],
                                },
                                {
                                    label: 'Crear usuari',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/creacio-usuari'],
                                },
                                {
                                    label: 'Llistar usuaris',
                                    icon: 'pi pi-list',
                                    routerLink: ['/llista-usuaris'],
                                },
                                {
                                    label: 'Importar CSV',
                                    icon: 'pi pi-file-import',
                                    routerLink: ['/importar-usuaris'],
                                },
                                {
                                    label: 'Logs',
                                    icon: 'pi pi-cloud-upload',
                                    navigateTo: 'http://127.0.0.1:8000/admin/biblioApp/log/',
                                },
                            ],
                        },
                        {
                            label: 'Sortir',
                            icon: 'pi pi-fw pi-power-off',
                            command: () => this.logout(),
                        },
                    ];
                } else if (this.profileData.role == Role.BIBLIO) {
                    this.menuItems = [
                        {
                            label: 'Panell de control',
                            icon: 'pi pi-table',
                            routerLink: ['/dashboard'],
                            items: [
                                {
                                    label: 'Perfil',
                                    icon: 'pi pi-user',
                                    routerLink: ['/perfil'],
                                },
                                {
                                    label: 'Crear usuari',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/creacio-usuari'],
                                },
                                {
                                    label: 'Llistar usuaris',
                                    icon: 'pi pi-list',
                                    routerLink: ['/llista-usuaris'],
                                },
                                {
                                    label: 'Importar CSV',
                                    icon: 'pi pi-file-import',
                                    routerLink: ['/importar-usuaris'],
                                },
                            ],
                        },
                        {
                            label: 'Sortir',
                            icon: 'pi pi-fw pi-power-off',
                            command: () => this.logout(),
                        },
                    ];
                } else if (this.profileData.role == Role.USER) {
                    this.menuItems = [
                        {
                            label: 'Panell de control',
                            icon: 'pi pi-table',
                            routerLink: ['/dashboard'],
                            items: [
                                {
                                    label: 'Perfil',
                                    icon: 'pi pi-user',
                                    routerLink: ['/perfil'],
                                },
                            ],
                        },
                        {
                            label: 'Sortir',
                            icon: 'pi pi-fw pi-power-off',
                            command: () => this.logout(),
                        },
                    ];
                }
            }
        });
    }

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

    logout() {
        this._profileService.logout();
        this.router.navigate(['/login']);
    }

    menuItems: MenuItem[] = [];

    roleName!: string;
    email!: string;

    async ngOnInit() {
        if (this.profileData) {
            console.log('roleName -> ', this.roleName);
            console.log('profileData -> ', this.profileData);
        }
    }
}

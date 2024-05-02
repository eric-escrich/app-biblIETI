import { Component, OnInit, inject } from '@angular/core';import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
            CommonModule,
            MenubarModule,
            InputTextModule,
            ButtonModule,
            AutoCompleteModule,
            FormsModule,
            RouterLink,
            ToastModule
          ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
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
  
    itemsArray: any[] = []; // Renombrada a itemsArray
  
    selectedItem: any;
  
    searchQuery: string = '';
  
    async searchItems(query: string) {
        try {
            
            this._logService.logInfo('Search query', `Consulta de búsqueda: "${this.searchQuery}"`, 'HomeComponent - searchItems');
            const response: any = await this._itemService.searchQuery(query);
  
            this.itemsArray = response; // Asignación a itemsArray
            suggestions: [] = this.itemsArray.map((item) => item.name);
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
                this.itemsArray = [];
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
  
    menuItems: MenuItem[] = [];
  
    ngOnInit() {
      this._logService.logInfo('Initializing HomeComponent', 'Inicializando HomeComponent', 'HomeComponent - ngOnInit()');
  
      this.menuItems = [
        {
          label: 'Inici',
          icon: 'pi pi-home',
          routerLink: ['/landing']
        },
        
        {
            label: 'Panel de control',
            icon: 'pi pi-table',
            items: [
              {
                  label: 'Editar dades',
                  icon: 'pi pi-palette',
                  items: [
                      {
                          label: 'Editar perfil',
                          icon: 'pi pi-pencil',
                          routerLink: ['/dashboard'],
                      },
                      {
                          label: 'Editar usuaris',
                          icon: 'pi pi-user',
                          routerLink: ['/dashboard'],
                      }
                  ]
              },
              {
                  label: 'Importar CSV',
                  icon: 'pi pi-file',
                  routerLink: ['/dashboard'],
              }
          ]
        },
        {
            label: 'Tancar sessió',
            icon: 'pi pi-fw pi-power-off',
        }
      ];
    }
  }
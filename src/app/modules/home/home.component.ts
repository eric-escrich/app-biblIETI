import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginComponent } from '../../core/auth/login/login.component';
import { ItemService } from '../../services/item.service';
import { DialogService } from '../../services/dialog.service';
import { LogService } from '../../services/log.service';
import { ItemSearcherComponent } from '../item-searcher/item-searcher.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ItemSearcherComponent, LoginComponent, RouterLink],
    providers: [MessageService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    router = inject(Router);
    _itemService = inject(ItemService);
    _dialogService = inject(DialogService);
    _logService = inject(LogService);

    // POP UP OLVIDAR CONTRASEÑA
    popupVisible = false;
    showPopup() {
        this.popupVisible = true;
    }

    ngOnInit() {
        this._logService.logInfo('Initializing HomeComponent', 'Inicializando HomeComponent', 'HomeComponent - ngOnInit()');
    }
}

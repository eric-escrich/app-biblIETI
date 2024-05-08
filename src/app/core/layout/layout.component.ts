import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { DialogService } from '../../services/dialog.service';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../../modules/menu/menu.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [RouterModule, DialogModule, ButtonModule, MenuComponent],
})
export class LayoutComponent {
    _dialogService = inject(DialogService);

    isVisible: boolean = false;
    header: string = 'INTORMACIÓ';
    message: string = '';

    sidebarLock: boolean = false;
    screenWidth!: number;

    constructor(private router: Router) {
        this.getScreenSize();

        router.events.subscribe((route) => {
            if (this.screenWidth < 768) this.sidebarLock = false;
        });
    }

    async ngOnInit() {
        this._dialogService.showDialog$.subscribe(({ isVisible, header, message }) => {
            this.isVisible = isVisible;
            this.header = header;
            this.message = message;
        });
    }

    sidebarLockToggle(): void {
        this.sidebarLock = !this.sidebarLock;
    }

    sidebarHover(hover: boolean) {
        this.sidebarLock = hover;
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(): void {
        if (typeof window !== 'undefined') {
            this.screenWidth = window.innerWidth;
        }
    }
}

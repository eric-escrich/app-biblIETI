import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-detall-llibres',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TableModule,
    CalendarModule,
  
    FormsModule
  ],
  templateUrl: './detall-llibres.component.html',
  styleUrl: './detall-llibres.component.css'
})
export class DetallLlibresComponent {
  datosTabla = [
    { id: 18, estado: 'Disponible' },
    { id: 40, estado: 'No disponible' }
  ];

  fechaReserva: Date;

  constructor() {
    this.fechaReserva = new Date();
  }
  mostrarFormulario = false;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}

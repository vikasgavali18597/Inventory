import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { VehicleIntakeModalComponent } from './shared/components/vehicle-intake-modal/vehicle-intake-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SidebarComponent, 
    HeaderComponent, 
    VehicleIntakeModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ApexAuto OS';
  showIntakeModal = false;

  openIntakeModal(): void {
    this.showIntakeModal = true;
  }

  closeIntakeModal(): void {
    this.showIntakeModal = false;
  }
}

import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  garageService = inject(GarageDataService);
  router = inject(Router);

  @Output() openIntakeModal = new EventEmitter<void>();

  searchQuery = '';
  isDarkMode = true;
  todayDate = '18 Oct 2026';

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    const query = this.searchQuery.trim().toLowerCase();
    
    // Find matching job card or vehicle plate
    const match = this.garageService.jobCards().find(j => 
      j.id.toLowerCase().includes(query) || 
      j.vehicle.regPlate.toLowerCase().includes(query) ||
      j.customer.name.toLowerCase().includes(query)
    );

    if (match) {
      this.router.navigate(['/job-cards', match.id]);
    } else {
      this.router.navigate(['/job-cards'], { queryParams: { q: this.searchQuery } });
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.remove('apex-light');
      document.body.classList.add('apex-dark');
    } else {
      document.body.classList.remove('apex-dark');
      document.body.classList.add('apex-light');
    }
  }
}

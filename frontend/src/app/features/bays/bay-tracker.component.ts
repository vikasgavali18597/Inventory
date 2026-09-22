import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';

@Component({
  selector: 'app-bay-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="bays-page">
      <div class="page-header">
        <div>
          <div class="breadcrumb">Operations / Live Workshop Tracking</div>
          <h1 class="page-title font-display">Live Service Bay Tracker</h1>
        </div>
      </div>

      <div class="bays-grid">
        <div class="apex-card bay-card" *ngFor="let bay of garageService.bays()">
          <div class="bay-card-header">
            <span class="bay-id font-mono">Bay #{{ bay.bayNumber }}</span>
            <span class="badge" [ngClass]="bay.status === 'Occupied' ? 'badge-primary' : (bay.status === 'QC Inspection' ? 'badge-warning' : 'badge-neutral')">
              {{ bay.status }}
            </span>
          </div>

          <div class="bay-car-details">
            <h3 class="bay-model font-display">{{ bay.vehicleModel }}</h3>
            <span class="plate-badge font-mono" *ngIf="bay.regPlate !== '—'">{{ bay.regPlate }}</span>
          </div>

          <div class="bay-work-info">
            <div class="info-row">
              <span class="lbl">Service:</span>
              <span class="val">{{ bay.serviceType }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Technician:</span>
              <span class="val text-success">{{ bay.technician }}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="bay-progress-section" *ngIf="bay.progressPercent > 0">
            <div class="prog-header">
              <span>Work Progress</span>
              <span class="font-mono">{{ bay.progressPercent }}%</span>
            </div>
            <div class="prog-track">
              <div class="prog-fill" [style.width.%]="bay.progressPercent"></div>
            </div>
          </div>

          <div class="bay-actions" *ngIf="bay.regPlate !== '—'">
            <a routerLink="/job-cards" class="btn btn-sm btn-secondary btn-block">
              <app-icon name="wrench" [size]="13"></app-icon>
              <span>View Job Card</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bays-page {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .bays-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .bay-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .bay-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bay-id {
      font-size: 13px;
      font-weight: 700;
      color: #60a5fa;
    }
    .bay-model {
      font-size: 15px;
      color: var(--text-main);
      font-weight: 600;
    }
    .bay-work-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      background-color: var(--bg-surface-elevated);
      padding: 8px 10px;
      border-radius: var(--radius-sm);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
    }
    .info-row .lbl {
      color: var(--text-dim);
    }
    .prog-header {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 4px;
      color: var(--text-muted);
    }
    .prog-track {
      width: 100%;
      height: 6px;
      background-color: var(--bg-input);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .prog-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary) 0%, var(--accent-cyan) 100%);
      border-radius: var(--radius-full);
    }
    .btn-block {
      width: 100%;
    }
  `]
})
export class BayTrackerComponent {
  garageService = inject(GarageDataService);
}

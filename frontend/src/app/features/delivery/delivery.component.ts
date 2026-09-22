import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';
import { JobCard } from '../../core/models/garage.models';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="delivery-page">
      <div class="page-header">
        <div>
          <div class="breadcrumb">Operations / Vehicle Delivery</div>
          <h1 class="page-title font-display">Vehicle Delivery & Gatepass Clearance</h1>
        </div>
      </div>

      <div class="delivery-grid">
        <!-- Ready for Delivery Queue -->
        <div class="apex-card queue-card">
          <div class="apex-card-header">
            <div class="apex-card-title">
              <app-icon name="delivery" [size]="16" color="#10b981"></app-icon>
              <span>Vehicles Ready for Customer Handover</span>
            </div>
          </div>

          <div class="delivery-cards-list">
            <div 
              class="delivery-card-item" 
              *ngFor="let job of readyJobs"
              [class.active]="selectedJob?.id === job.id"
              (click)="selectedJob = job"
            >
              <div class="delivery-card-header">
                <span class="job-id-pill font-mono">#{{ job.id }}</span>
                <span class="badge badge-success font-mono">{{ job.status }}</span>
              </div>
              <strong class="veh-title">{{ job.vehicle.year }} {{ job.vehicle.make }} {{ job.vehicle.model }}</strong>
              <div class="cust-info">{{ job.customer.name }} • {{ job.customer.phone }}</div>
              <div class="delivery-card-footer">
                <span class="plate-badge font-mono">{{ job.vehicle.regPlate }}</span>
                <span class="balance-tag font-mono" [class.text-danger]="job.balanceDue > 0">
                  {{ job.balanceDue <= 0 ? 'Fully Paid' : 'Due: ₹' + job.balanceDue.toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="empty-state" *ngIf="readyJobs.length === 0">
              <app-icon name="check-circle" [size]="24" color="#10b981"></app-icon>
              <p>All completed vehicles have been handed over!</p>
            </div>
          </div>
        </div>

        <!-- Handover Verification & Sign-off Panel -->
        <div class="apex-card handover-panel" *ngIf="selectedJob">
          <div class="apex-card-header">
            <div class="apex-card-title">
              <app-icon name="check-circle" [size]="16" color="#3b82f6"></app-icon>
              <span>Handover Clearance Checklist: {{ selectedJob.vehicle.regPlate }}</span>
            </div>
          </div>

          <div class="handover-body">
            <div class="handover-veh-summary">
              <h3>{{ selectedJob.vehicle.year }} {{ selectedJob.vehicle.make }} {{ selectedJob.vehicle.model }}</h3>
              <div>Customer: <strong>{{ selectedJob.customer.name }}</strong> ({{ selectedJob.customer.phone }})</div>
              <div>Lead Technician: <strong>{{ selectedJob.assignedTechnician }}</strong></div>
            </div>

            <div class="clearance-checklist">
              <div class="check-item">
                <app-icon name="check-circle" [size]="16" color="#10b981"></app-icon>
                <span>Invoice Settlement Verified ({{ selectedJob.balanceDue <= 0 ? 'Paid in Full' : 'Pending: ₹' + selectedJob.balanceDue.toFixed(2) }})</span>
              </div>
              <div class="check-item">
                <app-icon name="check-circle" [size]="16" color="#10b981"></app-icon>
                <span>Pre-Delivery Multi-Point Quality Inspection Passed</span>
              </div>
              <div class="check-item">
                <app-icon name="check-circle" [size]="16" color="#10b981"></app-icon>
                <span>Vehicle Cleaned & Protective Seat Covers Removed</span>
              </div>
              <div class="check-item">
                <app-icon name="check-circle" [size]="16" color="#10b981"></app-icon>
                <span>Vehicle Keys & Service Book Ready at Customer Counter</span>
              </div>
            </div>

            <div class="handover-action-box">
              <button 
                class="btn btn-success btn-lg btn-block" 
                [disabled]="selectedJob.status === 'Delivered'"
                (click)="confirmDelivery()"
              >
                <app-icon name="delivery" [size]="16" color="#ffffff"></app-icon>
                <span>{{ selectedJob.status === 'Delivered' ? 'Vehicle Already Delivered' : 'Confirm Customer Handover & Archive' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delivery-page {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .delivery-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 18px;
      align-items: start;
    }
    @media (max-width: 1024px) {
      .delivery-grid {
        grid-template-columns: 1fr;
      }
    }
    .delivery-cards-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .delivery-card-item {
      background-color: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .delivery-card-item:hover, .delivery-card-item.active {
      border-color: var(--success);
      background-color: var(--bg-surface-hover);
    }
    .delivery-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .veh-title {
      font-size: 13px;
      color: var(--text-main);
    }
    .cust-info {
      font-size: 11px;
      color: var(--text-muted);
    }
    .delivery-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }
    .balance-tag {
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
    }
    .clearance-checklist {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 16px 0;
      background-color: var(--bg-surface-elevated);
      padding: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    .check-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: var(--text-main);
    }
    .handover-veh-summary {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
    }
    .btn-block {
      width: 100%;
    }
    .empty-state {
      text-align: center;
      padding: 30px;
      color: var(--text-dim);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .job-id-pill {
      font-size: 11px;
      font-weight: 600;
      color: #60a5fa;
      background-color: var(--primary-light);
      padding: 2px 6px;
      border-radius: var(--radius-xs);
    }
  `]
})
export class DeliveryComponent {
  garageService = inject(GarageDataService);
  selectedJob: JobCard | null = null;

  get readyJobs(): JobCard[] {
    return this.garageService.jobCards().filter(j => j.status === 'Ready' || j.status === 'Delivered');
  }

  constructor() {
    const list = this.readyJobs;
    if (list.length > 0) {
      this.selectedJob = list[0];
    }
  }

  confirmDelivery(): void {
    if (!this.selectedJob) return;
    this.garageService.updateJobPipelineStep(this.selectedJob.id, 8); // Step 8: Delivered
    this.selectedJob = this.garageService.getJobCardById(this.selectedJob.id) || null;
    alert(`Vehicle ${this.selectedJob?.vehicle.regPlate} confirmed as delivered to customer!`);
  }
}

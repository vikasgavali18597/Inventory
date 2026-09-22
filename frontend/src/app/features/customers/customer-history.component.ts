import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="customer-history-page">
      <div class="page-header">
        <div>
          <div class="breadcrumb">Administration / Customer Relations</div>
          <h1 class="page-title font-display">Customer & Vehicle Service History</h1>
        </div>
      </div>

      <div class="history-grid">
        <!-- Customers List -->
        <div class="apex-card cust-list-card">
          <div class="search-box">
            <app-icon name="search" [size]="15"></app-icon>
            <input type="text" placeholder="Search customer, phone, plate..." [(ngModel)]="searchQuery" />
          </div>

          <div class="cust-items">
            <div 
              class="cust-card-item" 
              *ngFor="let job of filteredJobs" 
              [class.active]="selectedCustomerJob ? selectedCustomerJob.id === job.id : false"
              (click)="selectedCustomerJob = job"
            >
              <div class="cust-avatar-sm">{{ job.customer.name.slice(0, 2).toUpperCase() }}</div>
              <div class="cust-card-info">
                <div class="cust-name-row">
                  <strong>{{ job.customer.name }}</strong>
                  <span class="badge badge-purple" *ngIf="job.customer.vipTier">{{ job.customer.vipTier }}</span>
                </div>
                <div class="cust-phone-sub">{{ job.customer.phone }}</div>
                <div class="cust-vehicle-sub font-mono">{{ job.vehicle.year }} {{ job.vehicle.make }} {{ job.vehicle.model }} ({{ job.vehicle.regPlate }})</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Customer Detailed Ledger -->
        <div class="apex-card cust-detail-card" *ngIf="selectedCustomerJob">
          <div class="detail-header">
            <div class="detail-title-cluster">
              <div class="cust-avatar-lg">{{ selectedCustomerJob.customer.name.slice(0, 2).toUpperCase() }}</div>
              <div>
                <h2 class="font-display">{{ selectedCustomerJob.customer.name }}</h2>
                <div class="detail-sub font-mono">
                  <span>{{ selectedCustomerJob.customer.phone }}</span> • 
                  <span>{{ selectedCustomerJob.customer.email }}</span>
                </div>
              </div>
            </div>

            <a [routerLink]="['/job-cards', selectedCustomerJob.id]" class="btn btn-primary btn-sm">
              <app-icon name="wrench" [size]="14"></app-icon>
              <span>Open Active Job Card</span>
            </a>
          </div>

          <!-- Customer Metrics Summary -->
          <div class="cust-stats-row">
            <div class="stat-box">
              <span class="lbl">Total Visits</span>
              <strong class="val font-mono">{{ selectedCustomerJob.customer.priorVisits }} Visits</strong>
            </div>
            <div class="stat-box">
              <span class="lbl">Payment Rating</span>
              <strong class="val text-success">{{ selectedCustomerJob.customer.paymentRecordRating }}</strong>
            </div>
            <div class="stat-box">
              <span class="lbl">Pref Channel</span>
              <strong class="val">{{ selectedCustomerJob.customer.preferredChannel }}</strong>
            </div>
            <div class="stat-box">
              <span class="lbl">Lifetime Spend</span>
              <strong class="val font-mono text-primary">\${{ (selectedCustomerJob.grandTotal * 3.4) | number:'1.2-2' }}</strong>
            </div>
          </div>

          <!-- Registered Vehicle Details -->
          <div class="registered-vehicle-box">
            <h3 class="section-heading font-display">Registered Vehicle</h3>
            <div class="veh-specs-grid">
              <div>Make & Model: <strong>{{ selectedCustomerJob.vehicle.year }} {{ selectedCustomerJob.vehicle.make }} {{ selectedCustomerJob.vehicle.model }}</strong></div>
              <div>License Plate: <strong class="font-mono text-warning">{{ selectedCustomerJob.vehicle.regPlate }}</strong></div>
              <div>VIN: <strong class="font-mono">{{ selectedCustomerJob.vehicle.vin }}</strong></div>
              <div>Current Odometer: <strong class="font-mono">{{ selectedCustomerJob.vehicle.odometer | number }} km</strong></div>
            </div>
          </div>

          <!-- Service History Records -->
          <div class="service-records-box">
            <h3 class="section-heading font-display">Chronological Service Ledger</h3>
            <div class="apex-table-wrapper">
              <table class="apex-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Date</th>
                    <th>Service Scope</th>
                    <th>Lead Tech</th>
                    <th>Total Invoiced</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="job-id-pill font-mono">#{{ selectedCustomerJob.id }}</span></td>
                    <td>{{ selectedCustomerJob.createdAt }}</td>
                    <td>
                      <div *ngFor="let lab of selectedCustomerJob.laborServices">
                        • {{ lab.name }}
                      </div>
                    </td>
                    <td>{{ selectedCustomerJob.assignedTechnician }}</td>
                    <td class="font-mono"><strong>\${{ selectedCustomerJob.grandTotal | number:'1.2-2' }}</strong></td>
                    <td><span class="badge badge-success">{{ selectedCustomerJob.status }}</span></td>
                  </tr>
                  <tr>
                    <td><span class="job-id-pill font-mono">#JC-7910</span></td>
                    <td>14 May 2026</td>
                    <td>• Oil Service & Cabin Filter Replacement</td>
                    <td>Dan Thornton</td>
                    <td class="font-mono">₹340.00</td>
                    <td><span class="badge badge-success">Completed</span></td>
                  </tr>
                  <tr>
                    <td><span class="job-id-pill font-mono">#JC-7214</span></td>
                    <td>10 Dec 2025</td>
                    <td>• 30,000 km Major Service & Alignment</td>
                    <td>Dan Thornton</td>
                    <td class="font-mono">₹780.00</td>
                    <td><span class="badge badge-success">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-history-page {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .history-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 18px;
      align-items: start;
    }
    @media (max-width: 1024px) {
      .history-grid {
        grid-template-columns: 1fr;
      }
    }
    .cust-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 14px;
    }
    .cust-card-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .cust-card-item:hover, .cust-card-item.active {
      border-color: var(--primary);
      background-color: var(--bg-surface-hover);
    }
    .cust-avatar-sm {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background-color: var(--primary-light);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    .cust-card-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
    }
    .cust-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cust-phone-sub {
      font-size: 11px;
      color: var(--text-dim);
    }
    .cust-vehicle-sub {
      font-size: 11px;
      color: var(--text-muted);
    }
    .detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .detail-title-cluster {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .cust-avatar-lg {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background-color: var(--primary-light);
      color: #60a5fa;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .detail-sub {
      font-size: 12px;
      color: var(--text-muted);
    }
    .cust-stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .stat-box {
      background-color: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-box .lbl {
      font-size: 10px;
      color: var(--text-dim);
      text-transform: uppercase;
    }
    .stat-box .val {
      font-size: 14px;
      color: var(--text-main);
    }
    .registered-vehicle-box, .service-records-box {
      margin-bottom: 20px;
    }
    .section-heading {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 10px;
    }
    .veh-specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background-color: var(--bg-surface-elevated);
      padding: 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      font-size: 12px;
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
export class CustomerHistoryComponent {
  garageService = inject(GarageDataService);
  searchQuery = '';
  selectedCustomerJob = this.garageService.jobCards()[0];

  get filteredJobs() {
    let jobs = this.garageService.jobCards();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      jobs = jobs.filter(j => 
        j.customer.name.toLowerCase().includes(q) ||
        j.customer.phone.toLowerCase().includes(q) ||
        j.vehicle.regPlate.toLowerCase().includes(q)
      );
    }
    return jobs;
  }
}

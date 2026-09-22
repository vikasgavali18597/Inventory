import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { GarageDataService } from '../../../core/services/garage-data.service';

@Component({
  selector: 'app-vehicle-intake-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div class="modal-dialog modal-intake" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-title-box">
            <app-icon name="car" [size]="20" color="#3b82f6"></app-icon>
            <h3 class="modal-title font-display">New Vehicle Intake & Job Creation</h3>
          </div>
          <button class="btn-ghost" (click)="close()">
            <app-icon name="close" [size]="18"></app-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <!-- Customer Section -->
            <div class="form-section full-width">
              <h4 class="section-title">Customer Details</h4>
            </div>

            <div class="form-group">
              <label>Customer Full Name *</label>
              <input type="text" [(ngModel)]="customerName" placeholder="e.g. Michael Henderson" required />
            </div>

            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" [(ngModel)]="phone" placeholder="+1 (555) 000-0000" required />
            </div>

            <div class="form-group full-width">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="email" placeholder="customer@example.com" />
            </div>

            <!-- Vehicle Section -->
            <div class="form-section full-width">
              <h4 class="section-title">Vehicle Information</h4>
            </div>

            <div class="form-group">
              <label>Make & Model *</label>
              <input type="text" [(ngModel)]="makeModel" placeholder="e.g. BMW M340i or Ford F-150" required />
            </div>

            <div class="form-group">
              <label>Model Year & Engine</label>
              <input type="text" [(ngModel)]="yearEngine" placeholder="e.g. 2023 • 3.0L Turbo" />
            </div>

            <div class="form-group">
              <label>License Plate # *</label>
              <input type="text" [(ngModel)]="regPlate" placeholder="e.g. NY-9842" required class="font-mono text-uppercase" />
            </div>

            <div class="form-group">
              <label>Odometer (Mileage)</label>
              <input type="number" [(ngModel)]="odometer" placeholder="e.g. 35000" />
            </div>

            <div class="form-group">
              <label>Assigned Bay</label>
              <select [(ngModel)]="bay">
                <option value="Bay #1">Bay #1 (Mechanical)</option>
                <option value="Bay #2">Bay #2 (Diagnostics)</option>
                <option value="Bay #3">Bay #3 (Express Service)</option>
                <option value="Bay #4">Bay #4 (Suspension)</option>
                <option value="Bay #5">Bay #5 (QC / Inspection)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Lead Technician</label>
              <select [(ngModel)]="technician">
                <option value="Dan Thornton">Dan Thornton (Master Tech)</option>
                <option value="Sam Morales">Sam Morales (Senior Tech)</option>
                <option value="Liam Walker">Liam Walker (Electrical)</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Customer Stated Complaints / Work Scope *</label>
              <textarea 
                rows="3" 
                [(ngModel)]="complaintText" 
                placeholder="Describe issues reported by customer (e.g. brake squeal, scheduled 30k oil service, check engine light)..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="close()">Cancel</button>
          <button class="btn btn-primary" [disabled]="!isValid()" (click)="submit()">
            <app-icon name="wrench" [size]="15" color="#ffffff"></app-icon>
            <span>Create Job Card & Open</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-intake {
      max-width: 650px;
    }
    .header-title-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .full-width {
      grid-column: span 2;
    }
    .form-section {
      margin-top: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .form-group label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .text-uppercase {
      text-transform: uppercase;
    }
  `]
})
export class VehicleIntakeModalComponent {
  garageService = inject(GarageDataService);
  router = inject(Router);

  @Output() closeModal = new EventEmitter<void>();

  customerName = '';
  phone = '';
  email = '';
  makeModel = '';
  yearEngine = '2023 • 2.0L Turbo';
  regPlate = '';
  odometer = 32000;
  bay = 'Bay #3';
  technician = 'Dan Thornton';
  complaintText = '';

  isValid(): boolean {
    return !!(this.customerName.trim() && this.phone.trim() && this.makeModel.trim() && this.regPlate.trim());
  }

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    if (!this.isValid()) return;

    const parts = this.makeModel.split(' ');
    const make = parts[0] || 'Vehicle';
    const model = parts.slice(1).join(' ') || 'Model';

    const newJob = this.garageService.registerVehicleIntake({
      customerName: this.customerName,
      phone: this.phone,
      email: this.email,
      make,
      model,
      year: 2023,
      regPlate: this.regPlate,
      vin: 'WAU' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      odometer: this.odometer,
      fuelLevel: 65,
      complaintText: this.complaintText,
      technician: this.technician,
      bay: this.bay
    });

    this.close();
    this.router.navigate(['/job-cards', newJob.id]);
  }
}

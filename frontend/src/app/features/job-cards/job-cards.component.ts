import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';
import { JobCard, LaborService, JobPart, InventoryPart } from '../../core/models/garage.models';

@Component({
  selector: 'app-job-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  templateUrl: './job-cards.component.html',
  styleUrl: './job-cards.component.css'
})
export class JobCardsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  garageService = inject(GarageDataService);

  activeJobId: string | null = null;
  activeJob: JobCard | null = null;
  activeTab: 'breakdown' | 'checklist' = 'breakdown';

  // Modals state
  showAddLaborModal = false;
  showRequisitionModal = false;
  showToast = false;
  toastMessage = '';

  // Add Labor Form
  newLaborName = '';
  newLaborHours = 1.0;
  newLaborRate = 85.0;

  // Requisition Part Form
  selectedPartSku = '';
  requisitionQty = 1;

  // List View Filters
  listFilter = 'ALL';
  searchQuery = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeJobId = id;
        this.loadJob();
      } else {
        this.activeJobId = null;
        this.activeJob = null;
      }
    });

    this.route.queryParams.subscribe(q => {
      if (q['q']) {
        this.searchQuery = q['q'];
      }
    });
  }

  loadJob(): void {
    if (!this.activeJobId) return;
    const found = this.garageService.getJobCardById(this.activeJobId);
    if (found) {
      this.activeJob = found;
    } else {
      // Fallback to first job card if not found
      const first = this.garageService.jobCards()[0];
      if (first) {
        this.router.navigate(['/job-cards', first.id]);
      }
    }
  }

  get filteredJobCards(): JobCard[] {
    let list = this.garageService.jobCards();
    if (this.listFilter !== 'ALL') {
      list = list.filter(j => j.status.toUpperCase() === this.listFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(j => 
        j.id.toLowerCase().includes(q) ||
        j.vehicle.regPlate.toLowerCase().includes(q) ||
        j.customer.name.toLowerCase().includes(q) ||
        j.vehicle.make.toLowerCase().includes(q) ||
        j.vehicle.model.toLowerCase().includes(q)
      );
    }
    return list;
  }

  setPipelineStep(step: number): void {
    if (!this.activeJob) return;
    this.garageService.updateJobPipelineStep(this.activeJob.id, step);
    this.loadJob();
    this.notify(`Pipeline updated to Stage ${step}: ${this.activeJob?.status}`);
  }

  toggleChecklist(checkId: string): void {
    if (!this.activeJob) return;
    this.garageService.toggleChecklistItem(this.activeJob.id, checkId);
    this.loadJob();
  }

  get completedChecklistCount(): number {
    if (!this.activeJob) return 0;
    return this.activeJob.checklist.filter(c => c.completed).length;
  }

  // Labor Service Actions
  openAddLabor(): void {
    this.newLaborName = '';
    this.newLaborHours = 1.5;
    this.newLaborRate = 85.0;
    this.showAddLaborModal = true;
  }

  submitAddLabor(): void {
    if (!this.activeJob || !this.newLaborName.trim()) return;
    this.garageService.addLaborService(this.activeJob.id, {
      name: this.newLaborName,
      hours: Number(this.newLaborHours),
      rate: Number(this.newLaborRate)
    });
    this.showAddLaborModal = false;
    this.loadJob();
    this.notify('Labor service added to Job Card');
  }

  removeLabor(id: string): void {
    if (!this.activeJob) return;
    this.garageService.removeLaborService(this.activeJob.id, id);
    this.loadJob();
    this.notify('Labor service removed');
  }

  // Requisition Part Actions
  openRequisitionModal(): void {
    const parts = this.garageService.inventory();
    if (parts.length > 0) {
      this.selectedPartSku = parts[0].sku;
    }
    this.requisitionQty = 1;
    this.showRequisitionModal = true;
  }

  submitRequisition(): void {
    if (!this.activeJob || !this.selectedPartSku) return;
    const ok = this.garageService.requisitionPartForJob(
      this.activeJob.id, 
      this.selectedPartSku, 
      Number(this.requisitionQty)
    );

    if (ok) {
      this.showRequisitionModal = false;
      this.loadJob();
      this.notify('Part requisitioned & deducted from inventory');
    } else {
      alert('Insufficient stock available in inventory for this item!');
    }
  }

  removePart(partId: string): void {
    if (!this.activeJob) return;
    this.garageService.removePartFromJob(this.activeJob.id, partId);
    this.loadJob();
    this.notify('Part removed and returned to inventory stock');
  }

  generateInvoice(): void {
    if (!this.activeJob) return;
    const inv = this.garageService.generateInvoiceFromJob(this.activeJob.id);
    this.notify(`Invoice ${inv.id} generated! Redirecting to POS Settlement...`);
    setTimeout(() => {
      this.router.navigate(['/billing'], { queryParams: { invoiceId: inv.id } });
    }, 600);
  }

  sendEstimateSMS(): void {
    this.notify('Estimate summary sent to client via WhatsApp / SMS Auto');
  }

  printJobCard(): void {
    window.print();
  }

  notify(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3200);
  }
}

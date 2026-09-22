import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';
import { GoodsReceiptNote } from '../../core/models/garage.models';

@Component({
  selector: 'app-suppliers-grn',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './suppliers-grn.component.html',
  styleUrl: './suppliers-grn.component.css'
})
export class SuppliersGrnComponent {
  garageService = inject(GarageDataService);

  activeTab: 'grn' | 'suppliers' | 'ledger' = 'grn';
  showToast = false;
  toastMessage = '';
  showNewGrnModal = false;

  // New GRN form
  newSupplierName = 'Brembo S.p.A.';
  newPoRef = 'PO-2024-0995';
  newInvRef = 'INV-BRM-99120';
  newPartSku = 'BRK-BRM-09A82011';
  newPartQty = 10;
  newUnitCost = 195.0;

  get currentGrn(): GoodsReceiptNote | undefined {
    return this.garageService.grnList()[0];
  }

  commitGRN(grnNumber: string): void {
    const ok = this.garageService.commitGRNToInventory(grnNumber);
    if (ok) {
      this.notify(`GRN ${grnNumber} committed! Inventory stock levels updated automatically.`);
    } else {
      this.notify(`GRN ${grnNumber} is already committed.`);
    }
  }

  submitNewGRN(): void {
    const part = this.garageService.inventory().find(p => p.sku === this.newPartSku);
    const subtotal = this.newPartQty * this.newUnitCost;
    const tax = subtotal * 0.18;
    const freight = 35.0;
    const total = subtotal + tax + freight;

    const grn: GoodsReceiptNote = {
      grnNumber: 'GRN-2024-' + Math.floor(1000 + Math.random() * 9000),
      supplierName: this.newSupplierName,
      supplierCode: 'SUP-' + Math.floor(100 + Math.random() * 900),
      invoiceRef: this.newInvRef,
      poRef: this.newPoRef,
      receivingLocation: 'Bay 2 / Dock A',
      qualityInspector: 'Dan Thornton',
      items: [
        {
          sku: this.newPartSku,
          name: part ? part.name : 'Automotive Spare Component',
          orderedQty: this.newPartQty,
          shippedQty: this.newPartQty,
          acceptedQty: this.newPartQty,
          unitCost: this.newUnitCost,
          total: subtotal
        }
      ],
      acceptedTotalQty: this.newPartQty,
      subtotal,
      taxAmount: tax,
      freightAmount: freight,
      totalInvoiceAmount: total,
      status: 'Ready to Commit',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.garageService.addNewGRN(grn);
    this.showNewGrnModal = false;
    this.notify(`Created ${grn.grnNumber} from ${grn.supplierName}`);
  }

  notify(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3200);
  }
}

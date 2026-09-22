import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';
import { InventoryPart } from '../../core/models/garage.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  garageService = inject(GarageDataService);

  searchQuery = '';
  selectedCategory = 'ALL';
  selectedStockFilter = 'ALL';

  // Modals
  showAddPartModal = false;
  showRestockModal = false;
  showToast = false;
  toastMessage = '';

  // Add Part Form
  newPart: Omit<InventoryPart, 'id'> = {
    sku: '',
    name: '',
    category: 'Lubricants & Fluids',
    binLocation: 'Rack B-01',
    currentStock: 10,
    minStock: 5,
    maxStock: 50,
    unit: 'Units',
    unitCost: 25.0,
    unitPrice: 45.0,
    supplier: 'Brembo S.p.A.',
    oemCode: 'OEM-100',
    compatibility: 'Universal'
  };

  // Quick PO Drawer Form
  targetRestockPart: InventoryPart | null = null;
  quickPoQty = 5;

  get filteredParts(): InventoryPart[] {
    let list = this.garageService.inventory();
    if (this.selectedCategory !== 'ALL') {
      list = list.filter(p => p.category === this.selectedCategory);
    }
    if (this.selectedStockFilter === 'LOW') {
      list = list.filter(p => p.currentStock <= p.minStock);
    } else if (this.selectedStockFilter === 'HEALTHY') {
      list = list.filter(p => p.currentStock > p.minStock);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
      );
    }
    return list;
  }

  get totalValuation(): number {
    return this.garageService.inventory().reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);
  }

  openAddPartModal(): void {
    this.newPart = {
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      name: '',
      category: 'Lubricants & Fluids',
      binLocation: 'Rack A-01',
      currentStock: 10,
      minStock: 5,
      maxStock: 50,
      unit: 'Units',
      unitCost: 25.0,
      unitPrice: 45.0,
      supplier: 'Brembo S.p.A.',
      oemCode: 'OEM-' + Math.floor(10000 + Math.random() * 90000),
      compatibility: 'Audi, BMW, Porsche'
    };
    this.showAddPartModal = true;
  }

  submitAddPart(): void {
    if (!this.newPart.name.trim() || !this.newPart.sku.trim()) return;
    this.garageService.addInventoryPart({ ...this.newPart });
    this.showAddPartModal = false;
    this.notify(`Part ${this.newPart.name} added to inventory catalog`);
  }

  openRestock(part: InventoryPart): void {
    this.targetRestockPart = part;
    this.quickPoQty = Math.max(1, part.minStock * 2 - part.currentStock);
    this.showRestockModal = true;
  }

  submitRestock(): void {
    if (!this.targetRestockPart) return;
    const added = Number(this.quickPoQty);
    this.garageService.updateStock(this.targetRestockPart.sku, added);
    this.showRestockModal = false;
    this.notify(`Restocked +${added} ${this.targetRestockPart.unit} for ${this.targetRestockPart.name}`);
  }

  exportCSV(): void {
    const parts = this.garageService.inventory();
    let csv = 'SKU,Name,Category,Bin,CurrentStock,MinStock,UnitCost,UnitPrice,Supplier\n';
    parts.forEach(p => {
      csv += `"${p.sku}","${p.name}","${p.category}","${p.binLocation}",${p.currentStock},${p.minStock},${p.unitCost},${p.unitPrice},"${p.supplier}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexAuto_Inventory_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    this.notify('Inventory CSV exported successfully');
  }

  notify(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3200);
  }
}

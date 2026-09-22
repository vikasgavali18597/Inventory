import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { GarageDataService } from '../../core/services/garage-data.service';
import { Invoice } from '../../core/models/garage.models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  garageService = inject(GarageDataService);
  route = inject(ActivatedRoute);

  activeTab: 'invoices' | 'expenses' = 'invoices';
  selectedInvoice: Invoice | null = null;
  selectedPaymentChannel: 'UPI / QR' | 'POS Card' | 'Cash' | 'Bank NEFT' = 'UPI / QR';

  searchQuery = '';
  statusFilter = 'ALL';

  // Settlement Form
  transactionRef = 'UPI-REF-' + Math.floor(10000000 + Math.random() * 90000000);
  autoIssueGatepass = true;
  customPayAmount = 0;

  // Modals & Notifications
  showGatepassModal = false;
  showExpenseModal = false;
  showToast = false;
  toastMessage = '';

  // New Expense Form
  newExpTitle = '';
  newExpCategory: any = 'Supplies & Parts';
  newExpAmount = 150.0;
  newExpRecipient = '';
  newExpMethod: any = 'UPI';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const invId = params['invoiceId'];
      if (invId) {
        const found = this.garageService.invoices().find(i => i.id === invId);
        if (found) {
          this.selectInvoice(found);
          return;
        }
      }
      // Default select first invoice with balance due
      const dueInv = this.garageService.invoices().find(i => i.balanceDue > 0);
      if (dueInv) {
        this.selectInvoice(dueInv);
      } else {
        this.selectInvoice(this.garageService.invoices()[0]);
      }
    });
  }

  selectInvoice(inv: Invoice): void {
    this.selectedInvoice = inv;
    this.customPayAmount = inv.balanceDue > 0 ? inv.balanceDue : inv.grandTotal;
    this.transactionRef = 'UPI-REF-' + Math.floor(10000000 + Math.random() * 90000000);
  }

  get filteredInvoices(): Invoice[] {
    let list = this.garageService.invoices();
    if (this.statusFilter === 'PAID') {
      list = list.filter(i => i.status === 'Paid in Full');
    } else if (this.statusFilter === 'DUE') {
      list = list.filter(i => i.balanceDue > 0);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(i => 
        i.id.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q) ||
        i.vehiclePlate.toLowerCase().includes(q) ||
        i.vehicleDesc.toLowerCase().includes(q)
      );
    }
    return list;
  }

  confirmSettlement(): void {
    if (!this.selectedInvoice) return;
    const amount = Number(this.customPayAmount);
    if (amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    this.garageService.settleInvoicePayment(
      this.selectedInvoice.id,
      amount,
      this.selectedPaymentChannel,
      this.transactionRef
    );

    // Refresh selected invoice state
    const refreshed = this.garageService.invoices().find(i => i.id === this.selectedInvoice?.id);
    if (refreshed) {
      this.selectedInvoice = refreshed;
    }

    if (this.autoIssueGatepass) {
      this.showGatepassModal = true;
    }
    this.notify(`Payment of ₹${amount.toFixed(2)} settled via ${this.selectedPaymentChannel}`);
  }

  submitExpense(): void {
    if (!this.newExpTitle.trim() || !this.newExpAmount) return;
    this.garageService.addExpense({
      title: this.newExpTitle,
      category: this.newExpCategory,
      vendorOrRecipient: this.newExpRecipient || 'Garage Vendor',
      amount: Number(this.newExpAmount),
      paymentMethod: this.newExpMethod,
      status: 'Verified'
    });
    this.showExpenseModal = false;
    this.notify(`Expense of ₹${this.newExpAmount} recorded`);
  }

  printInvoice(inv: Invoice): void {
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

import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { JobCardsComponent } from './features/job-cards/job-cards.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { SuppliersGrnComponent } from './features/suppliers/suppliers-grn.component';
import { BillingComponent } from './features/billing/billing.component';
import { CustomerHistoryComponent } from './features/customers/customer-history.component';
import { DeliveryComponent } from './features/delivery/delivery.component';
import { BayTrackerComponent } from './features/bays/bay-tracker.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'job-cards', component: JobCardsComponent },
  { path: 'job-cards/:id', component: JobCardsComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'suppliers-grn', component: SuppliersGrnComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'expenses', component: BillingComponent },
  { path: 'customer-history', component: CustomerHistoryComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'bays', component: BayTrackerComponent },
  { path: '**', redirectTo: 'dashboard' }
];

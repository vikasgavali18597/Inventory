// Core domain models for ApexAuto OS Garage Management System

export type JobStatus = 
  | 'Intake' 
  | 'Inspection' 
  | 'Estimate' 
  | 'In Progress' 
  | 'QC & Testing' 
  | 'Final Billing' 
  | 'Ready' 
  | 'Delivered';

export type JobPriority = 'Normal' | 'Medium' | 'High' | 'Urgent';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vipTier?: 'Regular' | 'Silver' | 'Gold' | 'VIP Return Client';
  preferredChannel: 'WhatsApp / SMS Auto' | 'Phone Call' | 'Email';
  priorVisits: number;
  paymentRecordRating: 'Flawless Pay Record' | 'Good' | 'Fair';
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  regPlate: string;
  odometer: number;
  fuelLevel: number; // 0 to 100 percentage
  imageUrl?: string;
  bayNumber?: string;
  customerId: string;
  targetHandover?: string;
}

export interface LaborService {
  id: string;
  name: string;
  description?: string;
  hours: number;
  rate: number;
  total: number;
  status: 'Queued' | 'Running' | 'Done';
}

export interface JobPart {
  id: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  amount: number;
  location: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  active?: boolean;
}

export interface CustomerComplaint {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export interface JobCard {
  id: string; // e.g. '#JC-8492'
  vehicleId: string;
  vehicle: Vehicle;
  customerId: string;
  customer: Customer;
  status: JobStatus;
  pipelineStep: number; // 1 to 8
  progressPercent: number; // e.g. 65
  priority: JobPriority;
  assignedTechnician: string;
  technicianRole: string;
  complaints: CustomerComplaint[];
  inspectionNotes?: string;
  laborServices: LaborService[];
  partsUsed: JobPart[];
  checklist: ChecklistItem[];
  
  // Costing
  laborTotal: number;
  partsTotal: number;
  shopSupplies: number; // e.g. 28.00
  grossSubtotal: number;
  discountRate: number; // e.g. 0.05
  discountAmount: number;
  taxRate: number; // e.g. 0.10
  taxAmount: number;
  grandTotal: number;
  advanceDeposit: number;
  balanceDue: number;

  createdAt: string;
  targetHandover: string;
  invoiceId?: string;
}

export interface InventoryPart {
  id: string;
  sku: string;
  name: string;
  category: 'Lubricants & Fluids' | 'Braking System' | 'Engine & Filters' | 'Batteries' | 'Ignition' | 'Suspension';
  binLocation: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  unitPrice: number;
  supplier: string;
  oemCode: string;
  compatibility: string;
  weight?: string;
}

export interface GRNItem {
  sku: string;
  name: string;
  orderedQty: number;
  shippedQty: number;
  acceptedQty: number;
  unitCost: number;
  total: number;
}

export interface GoodsReceiptNote {
  grnNumber: string; // e.g. 'GRN-2024-0418'
  supplierName: string;
  supplierCode: string;
  invoiceRef: string;
  poRef: string;
  receivingLocation: string;
  qualityInspector: string;
  items: GRNItem[];
  acceptedTotalQty: number;
  subtotal: number;
  taxAmount: number;
  freightAmount: number;
  totalInvoiceAmount: number;
  status: 'Ready to Commit' | 'Committed' | 'Pending QC';
  date: string;
}

export interface Invoice {
  id: string; // e.g. 'INV-2024-1088'
  jobCardId: string;
  customerName: string;
  vehiclePlate: string;
  vehicleDesc: string;
  laborTotal: number;
  partsTotal: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Paid in Full' | 'Partial / Due' | 'Draft / In QC';
  paymentMethod?: 'UPI / QR' | 'POS Card' | 'Cash' | 'Bank NEFT';
  transactionRef?: string;
  gatepassIssued: boolean;
  issuedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  title: string;
  category: 'Supplies & Parts' | 'Equipment & Maintenance' | 'Technician Meals / Overtime' | 'Utilities / Gases' | 'Facility';
  vendorOrRecipient: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'NEFT';
  status: 'Approved' | 'Verified' | 'Pending';
}

export interface BayInfo {
  bayNumber: number;
  vehicleModel: string;
  regPlate: string;
  technician: string;
  serviceType: string;
  progressPercent: number;
  status: 'Occupied' | 'Available' | 'QC Inspection';
}

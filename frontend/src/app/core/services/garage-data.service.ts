import { Injectable, signal, computed } from '@angular/core';
import { 
  Customer, 
  Vehicle, 
  JobCard, 
  JobStatus, 
  LaborService, 
  JobPart, 
  InventoryPart, 
  GoodsReceiptNote, 
  Invoice, 
  Expense, 
  BayInfo 
} from '../models/garage.models';

@Injectable({
  providedIn: 'root'
})
export class GarageDataService {
  private STORAGE_KEY = 'apexauto_garage_state_v1';

  // Reactive State Signals
  readonly jobCards = signal<JobCard[]>([]);
  readonly inventory = signal<InventoryPart[]>([]);
  readonly grnList = signal<GoodsReceiptNote[]>([]);
  readonly invoices = signal<Invoice[]>([]);
  readonly expenses = signal<Expense[]>([]);
  readonly bays = signal<BayInfo[]>([]);

  // Computed Dashboard Metrics
  readonly activeJobsCount = computed(() => 
    this.jobCards().filter(j => j.status !== 'Delivered').length
  );
  
  readonly todayDeliveriesCount = computed(() => 
    this.jobCards().filter(j => j.status === 'Ready' || j.status === 'Delivered').length
  );

  readonly lowStockCount = computed(() => 
    this.inventory().filter(p => p.currentStock <= p.minStock).length
  );

  readonly grossInvoicedToday = computed(() => 
    this.invoices().reduce((acc, inv) => acc + inv.grandTotal, 0)
  );

  readonly realizedCollections = computed(() => 
    this.invoices().reduce((acc, inv) => acc + inv.paidAmount, 0)
  );

  readonly pendingReceivables = computed(() => 
    this.invoices().reduce((acc, inv) => acc + inv.balanceDue, 0)
  );

  readonly todayExpensesTotal = computed(() => 
    this.expenses().reduce((acc, exp) => acc + exp.amount, 0)
  );

  readonly netOperatingMargin = computed(() => 
    this.realizedCollections() - this.todayExpensesTotal()
  );

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.jobCards.set(parsed.jobCards || []);
        this.inventory.set(parsed.inventory || []);
        this.grnList.set(parsed.grnList || []);
        this.invoices.set(parsed.invoices || []);
        this.expenses.set(parsed.expenses || []);
        this.bays.set(parsed.bays || []);
        return;
      } catch (e) {
        console.warn('Could not parse saved garage state, reloading defaults', e);
      }
    }
    this.loadDefaultData();
    this.persist();
  }

  private persist(): void {
    const data = {
      jobCards: this.jobCards(),
      inventory: this.inventory(),
      grnList: this.grnList(),
      invoices: this.invoices(),
      expenses: this.expenses(),
      bays: this.bays()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadDefaultData(): void {
    // 1. Initial Inventory (Matching Screenshot 4)
    const initialInventory: InventoryPart[] = [
      {
        id: 'p-1',
        sku: 'OIL-MTL-5W40-GEN2',
        name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic',
        category: 'Lubricants & Fluids',
        binLocation: 'Rack B-04 / Shelf 2',
        currentStock: 28,
        minStock: 20,
        maxStock: 100,
        unit: 'Liters',
        unitCost: 9.50,
        unitPrice: 14.50,
        supplier: 'Motul Lubricants Dist.',
        oemCode: '#102784',
        compatibility: 'Audi, BMW, VW, Porsche',
        weight: 'Liquid drum top'
      },
      {
        id: 'p-2',
        sku: 'BRK-BRM-09A82011',
        name: 'Brembo Front Drilled Rotors (350mm Pair)',
        category: 'Braking System',
        binLocation: 'Heavy C-02 / Pallet Level 1',
        currentStock: 1,
        minStock: 3,
        maxStock: 10,
        unit: 'Sets',
        unitCost: 195.00,
        unitPrice: 280.00,
        supplier: 'Brembo S.p.A.',
        oemCode: '#4G0615301',
        compatibility: 'Audi S4/S5, A6 3.0T',
        weight: '24 kg'
      },
      {
        id: 'p-3',
        sku: 'FLT-MNN-HU7035Y',
        name: 'OEM Mann Engine Oil Filter (HU7035Y)',
        category: 'Engine & Filters',
        binLocation: 'Rack A-12 / Bin 4',
        currentStock: 3,
        minStock: 8,
        maxStock: 30,
        unit: 'Pcs',
        unitCost: 14.00,
        unitPrice: 24.00,
        supplier: 'Mann+Hummel Filtration',
        oemCode: '#06L115562',
        compatibility: 'EA888 Gen 3/4 2.0 TFSI',
        weight: '0.2 kg'
      },
      {
        id: 'p-4',
        sku: 'OIL-5W30-SYN',
        name: 'Castrol Edge 5W-30 Full Synth (208L Bulk Drum)',
        category: 'Lubricants & Fluids',
        binLocation: 'Bulk Drum Bay 1',
        currentStock: 4,
        minStock: 20,
        maxStock: 208,
        unit: 'Liters',
        unitCost: 7.20,
        unitPrice: 12.00,
        supplier: 'Shell / Castrol Dist.',
        oemCode: 'Universal LongLife',
        compatibility: 'BMW LL04, MB 229.51, VW 504',
        weight: 'Pump Dispenser'
      },
      {
        id: 'p-5',
        sku: 'BRK-AKB-EUR1894',
        name: 'Akebono Euro Ultra-Ceramic Brake Pads',
        category: 'Braking System',
        binLocation: 'Rack A-08 / Shelf 1',
        currentStock: 12,
        minStock: 4,
        maxStock: 25,
        unit: 'Sets',
        unitCost: 78.00,
        unitPrice: 115.00,
        supplier: 'Bosch / Akebono',
        oemCode: '#8W0698151N',
        compatibility: 'Audi A4/A5 Allroad, Q5 FY',
        weight: '2.8 kg'
      },
      {
        id: 'p-6',
        sku: 'BAT-BSC-S6585B',
        name: 'Bosch AGM High Performance Battery 80Ah 800CCA',
        category: 'Batteries',
        binLocation: 'Battery Bay D-01',
        currentStock: 6,
        minStock: 2,
        maxStock: 15,
        unit: 'Units',
        unitCost: 140.00,
        unitPrice: 210.00,
        supplier: 'Bosch Automotive Systems',
        oemCode: 'Group 48 / H6',
        compatibility: 'European Stop/Start Vehicles',
        weight: '22.4 kg'
      },
      {
        id: 'p-7',
        sku: 'IGN-NGK-SILZKBR8',
        name: 'NGK Laser Iridium Spark Plugs (Pack of 4)',
        category: 'Ignition',
        binLocation: 'Drawer E-05 / Security Cab',
        currentStock: 18,
        minStock: 5,
        maxStock: 40,
        unit: 'Packs',
        unitCost: 38.00,
        unitPrice: 64.00,
        supplier: 'NGK Spark Plugs',
        oemCode: '#SILZKBR8D8S',
        compatibility: 'BMW N20, N26, N55 Turbo',
        weight: '0.3 kg'
      }
    ];

    // 2. Active Job Cards (Matching Screenshot 1 for Audi A6 #JC-8492)
    const initialJobCards: JobCard[] = [
      {
        id: 'JC-8492',
        vehicleId: 'veh-audi-a6',
        vehicle: {
          id: 'veh-audi-a6',
          vin: 'WAUZZZF24MA081294',
          make: 'Audi',
          model: 'A6 3.0T V6 Quattro',
          year: 2022,
          engine: '3.0L Turbocharged V6',
          regPlate: 'GRZ-4819',
          odometer: 42850,
          fuelLevel: 50,
          imageUrl: 'assets/images/audi-a6.jpg',
          bayNumber: 'Bay #3',
          customerId: 'cust-robert',
          targetHandover: 'Oct 19, 2026 • 05:00 PM'
        },
        customerId: 'cust-robert',
        customer: {
          id: 'cust-robert',
          name: 'Robert Sterling',
          phone: '+1 (555) 849-2041',
          email: 'r.sterling@email.com',
          vipTier: 'VIP Return Client',
          preferredChannel: 'WhatsApp / SMS Auto',
          priorVisits: 4,
          paymentRecordRating: 'Flawless Pay Record'
        },
        status: 'In Progress',
        pipelineStep: 4, // Step 4 of 8
        progressPercent: 65,
        priority: 'High',
        assignedTechnician: 'Dan Thornton',
        technicianRole: 'Master Tech • ASE Certified L1',
        complaints: [
          {
            id: 'c-1',
            title: 'Squealing noise from front wheels',
            description: 'Occurs under moderate to firm braking after 10+ mins driving.',
            tag: 'Front Brakes'
          },
          {
            id: 'c-2',
            title: 'Scheduled 40,000 km periodic service',
            description: 'Synthetic oil change, OEM filters, multi-point fluid inspection.',
            tag: 'Scheduled Maintenance'
          },
          {
            id: 'c-3',
            title: 'Highway speed vibration',
            description: 'Felt through steering yoke between 85 - 105 km/h.',
            tag: 'Wheel Balancing'
          }
        ],
        inspectionNotes: 'Front Left CV Axle Boot Torn & Grease Seepage found during pre-service inspection. Client Approved via SMS (Parts ₹145 + Labor ₹95 = ₹240.00).',
        laborServices: [
          {
            id: 'lab-1',
            name: '40k Periodic Minor Service',
            description: 'Oil drain, OEM filters, multi-point check',
            hours: 1.5,
            rate: 85.00,
            total: 127.50,
            status: 'Done'
          },
          {
            id: 'lab-2',
            name: 'Front Rotors & Ceramic Pads Fitment',
            description: 'Brake caliper service & sensor pin cleaning',
            hours: 2.0,
            rate: 95.00,
            total: 190.00,
            status: 'Running'
          },
          {
            id: 'lab-3',
            name: 'High-Speed Wheel Balancing & Align',
            description: 'Laser hunter 4-wheel alignment setup',
            hours: 1.0,
            rate: 80.00,
            total: 80.00,
            status: 'Queued'
          }
        ],
        partsUsed: [
          {
            id: 'pu-1',
            sku: 'OIL-MTL-5W40-GEN2',
            name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic',
            qty: 6.5,
            unitPrice: 14.50,
            amount: 94.25,
            location: 'Rack B-04'
          },
          {
            id: 'pu-2',
            sku: 'FLT-MNN-HU7035Y',
            name: 'OEM Mann Engine Oil Filter',
            qty: 1,
            unitPrice: 24.00,
            amount: 24.00,
            location: 'Rack A-12'
          },
          {
            id: 'pu-3',
            sku: 'BRK-BRM-09A82011',
            name: 'Brembo Front Drilled Rotors Pair (350mm)',
            qty: 1,
            unitPrice: 280.00,
            amount: 280.00,
            location: 'Heavy C-02'
          },
          {
            id: 'pu-4',
            sku: 'BRK-AKB-EUR1894',
            name: 'Akebono Euro Ultra-Ceramic Brake Pads',
            qty: 1,
            unitPrice: 115.00,
            amount: 115.00,
            location: 'Rack A-08'
          }
        ],
        checklist: [
          { id: 'chk-1', task: 'Drain old oil & replace crush washer', completed: true },
          { id: 'chk-2', task: 'Fit new oil filter & torque to 25Nm', completed: true },
          { id: 'chk-3', task: 'Install Brembo rotors & pads', completed: false, active: true },
          { id: 'chk-4', task: 'Road test brake feel & bed-in pads', completed: false },
          { id: 'chk-5', task: 'Reset service interval on Audi MMI', completed: false }
        ],
        laborTotal: 397.50,
        partsTotal: 513.25,
        shopSupplies: 28.00,
        grossSubtotal: 938.75,
        discountRate: 0.05, // VIP Tier 5%
        discountAmount: 46.94,
        taxRate: 0.10, // State Sales Tax / GST 10%
        taxAmount: 89.18,
        grandTotal: 980.99,
        advanceDeposit: 300.00,
        balanceDue: 680.99,
        createdAt: 'Oct 18, 2026 • 08:30 AM',
        targetHandover: 'Oct 19, 2026 • 05:00 PM',
        invoiceId: 'INV-2024-1088'
      },
      {
        id: 'JC-8423',
        vehicleId: 'veh-ford-f150',
        vehicle: {
          id: 'veh-ford-f150',
          vin: '1FTFW1ED6NFB49201',
          make: 'Ford',
          model: 'F-150 Lariat 5.0L V8',
          year: 2022,
          engine: '5.0L Coyote V8',
          regPlate: 'TRX-8890',
          odometer: 61400,
          fuelLevel: 75,
          bayNumber: 'Bay #1',
          customerId: 'cust-james',
          targetHandover: 'Oct 18, 2026 • 04:30 PM'
        },
        customerId: 'cust-james',
        customer: {
          id: 'cust-james',
          name: 'James Wilson',
          phone: '+1 (555) 723-9912',
          email: 'j.wilson@buildcorp.com',
          vipTier: 'Regular',
          preferredChannel: 'WhatsApp / SMS Auto',
          priorVisits: 2,
          paymentRecordRating: 'Good'
        },
        status: 'Ready',
        pipelineStep: 7,
        progressPercent: 100,
        priority: 'Normal',
        assignedTechnician: 'Sam Morales',
        technicianRole: 'Senior Technician',
        complaints: [
          { id: 'cf-1', title: 'Suspension clunk on rough roads', description: 'Front passenger side strut bushing worn.' }
        ],
        laborServices: [
          { id: 'lf-1', name: 'Suspension Strut & Bushing Replacement', hours: 4.5, rate: 95.00, total: 427.50, status: 'Done' }
        ],
        partsUsed: [
          { id: 'pf-1', sku: 'SUS-FRD-STRUT', name: 'Heavy Duty Front Strut Assembly', qty: 2, unitPrice: 380.00, amount: 760.00, location: 'Rack D-02' }
        ],
        checklist: [
          { id: 'chkf-1', task: 'Replace strut mounts', completed: true },
          { id: 'chkf-2', task: 'Torque bolts to spec', completed: true }
        ],
        laborTotal: 435.93,
        partsTotal: 1420.00,
        shopSupplies: 35.00,
        grossSubtotal: 1890.93,
        discountRate: 0.00,
        discountAmount: 0.00,
        taxRate: 0.10,
        taxAmount: 189.09,
        grandTotal: 2198.00,
        advanceDeposit: 2198.00,
        balanceDue: 0.00,
        createdAt: 'Oct 17, 2026 • 09:15 AM',
        targetHandover: 'Oct 18, 2026 • 04:30 PM',
        invoiceId: 'INV-2024-1087'
      },
      {
        id: 'JC-8421',
        vehicleId: 'veh-bmw-330i',
        vehicle: {
          id: 'veh-bmw-330i',
          vin: 'WBA5R1C50KFP19842',
          make: 'BMW',
          model: '330i xDrive Sedan',
          year: 2021,
          engine: '2.0L B48 Turbo',
          regPlate: 'ABC-9821',
          odometer: 38900,
          fuelLevel: 40,
          bayNumber: 'Bay #2',
          customerId: 'cust-marcus',
          targetHandover: 'Oct 18, 2026 • 01:00 PM'
        },
        customerId: 'cust-marcus',
        customer: {
          id: 'cust-marcus',
          name: 'Marcus Vance',
          phone: '+1 (555) 432-8819',
          email: 'm.vance@techlead.io',
          vipTier: 'Silver',
          preferredChannel: 'Phone Call',
          priorVisits: 3,
          paymentRecordRating: 'Flawless Pay Record'
        },
        status: 'Delivered',
        pipelineStep: 8,
        progressPercent: 100,
        priority: 'Normal',
        assignedTechnician: 'Liam Walker',
        technicianRole: 'Electrical & Diagnostic Specialist',
        complaints: [
          { id: 'cb-1', title: 'Regular 40k Service & Spark Plugs', description: 'Spark plug change and synthetic fluid top-up.' }
        ],
        laborServices: [
          { id: 'lb-1', name: '4-Cylinder Spark Plug & Coil Pack Install', hours: 2.0, rate: 90.00, total: 180.00, status: 'Done' }
        ],
        partsUsed: [
          { id: 'pb-1', sku: 'IGN-NGK-SILZKBR8', name: 'NGK Laser Iridium Spark Plugs (Pack of 4)', qty: 1, unitPrice: 64.00, amount: 64.00, location: 'Drawer E-05' }
        ],
        checklist: [
          { id: 'chkb-1', task: 'Check gap & torque spark plugs', completed: true }
        ],
        laborTotal: 461.90,
        partsTotal: 760.00,
        shopSupplies: 25.00,
        grossSubtotal: 1246.90,
        discountRate: 0.00,
        discountAmount: 0.00,
        taxRate: 0.10,
        taxAmount: 124.69,
        grandTotal: 1458.00,
        advanceDeposit: 1458.00,
        balanceDue: 0.00,
        createdAt: 'Oct 17, 2026 • 11:30 AM',
        targetHandover: 'Oct 18, 2026 • 12:30 PM',
        invoiceId: 'INV-2024-1086'
      },
      {
        id: 'JC-8425',
        vehicleId: 'veh-civic-type-r',
        vehicle: {
          id: 'veh-civic-type-r',
          vin: 'JHMFL5342PX00192',
          make: 'Honda',
          model: 'Civic Type R',
          year: 2023,
          engine: '2.0L VTEC Turbo K20C1',
          regPlate: 'CTR-2023',
          odometer: 18200,
          fuelLevel: 60,
          bayNumber: 'Bay #5',
          customerId: 'cust-alex',
          targetHandover: 'Oct 19, 2026 • 11:00 AM'
        },
        customerId: 'cust-alex',
        customer: {
          id: 'cust-alex',
          name: 'Alex Romero',
          phone: '+1 (555) 919-4402',
          email: 'alex.romero@speedmotors.com',
          vipTier: 'Regular',
          preferredChannel: 'WhatsApp / SMS Auto',
          priorVisits: 1,
          paymentRecordRating: 'Good'
        },
        status: 'QC & Testing',
        pipelineStep: 5,
        progressPercent: 80,
        priority: 'High',
        assignedTechnician: 'Dan Thornton',
        technicianRole: 'Master Tech',
        complaints: [
          { id: 'cr-1', title: 'Track day pre-inspection & brake fluid flush', description: 'High-temp brake fluid flush and pad wear analysis.' }
        ],
        laborServices: [
          { id: 'lr-1', name: 'Performance Brake Fluid Bleed & Flush', hours: 2.5, rate: 90.00, total: 225.00, status: 'Done' }
        ],
        partsUsed: [
          { id: 'pr-1', sku: 'FLD-BRM-DOT51', name: 'High-Temp DOT 5.1 Brake Fluid (1L)', qty: 2, unitPrice: 22.00, amount: 44.00, location: 'Rack B-01' }
        ],
        checklist: [
          { id: 'chkr-1', task: 'Pressure bleed hydraulic brake circuit', completed: true },
          { id: 'chkr-2', task: 'Measure rotor thickness with micrometer', completed: true }
        ],
        laborTotal: 264.75,
        partsTotal: 828.00,
        shopSupplies: 22.00,
        grossSubtotal: 1114.75,
        discountRate: 0.00,
        discountAmount: 0.00,
        taxRate: 0.10,
        taxAmount: 111.48,
        grandTotal: 1288.00,
        advanceDeposit: 0.00,
        balanceDue: 1288.00,
        createdAt: 'Oct 18, 2026 • 10:15 AM',
        targetHandover: 'Oct 19, 2026 • 11:00 AM',
        invoiceId: 'INV-2024-1085'
      }
    ];

    // 3. Inbound Goods Receipts (Matching Screenshot 3)
    const initialGRNList: GoodsReceiptNote[] = [
      {
        grnNumber: 'GRN-2024-0418',
        supplierName: 'Brembo S.p.A.',
        supplierCode: 'ASUP-BRM-003',
        invoiceRef: 'INV-BRM-884920',
        poRef: 'PO-2024-0981',
        receivingLocation: 'Bay 2 / Dock A (Apex Central Depot)',
        qualityInspector: 'Dan Thornton (Micrometer Verified)',
        items: [
          {
            sku: 'BRK-BRM-09A82011',
            name: 'Brembo Front Drilled Rotors (350mm Pair)',
            orderedQty: 5,
            shippedQty: 5,
            acceptedQty: 5,
            unitCost: 195.00,
            total: 975.00
          },
          {
            sku: 'BRK-BRM-P86038N',
            name: 'Brembo Ceramic Performance Brake Pads',
            orderedQty: 10,
            shippedQty: 10,
            acceptedQty: 10,
            unitCost: 52.00,
            total: 520.00
          },
          {
            sku: 'FLD-BRM-DOT51',
            name: 'High-Temp DOT 5.1 Brake Fluid (1L Can)',
            orderedQty: 24,
            shippedQty: 24,
            acceptedQty: 22,
            unitCost: 11.50,
            total: 253.00
          }
        ],
        acceptedTotalQty: 37,
        subtotal: 1748.00,
        taxAmount: 314.64,
        freightAmount: 45.00,
        totalInvoiceAmount: 2107.64,
        status: 'Ready to Commit',
        date: 'Today, 11:24 AM'
      },
      {
        grnNumber: 'GRN-2024-0417',
        supplierName: 'Motul Lubricants Dist.',
        supplierCode: 'ASUP-MTL-001',
        invoiceRef: 'INV-MTL-77491',
        poRef: 'PO-2024-0979',
        receivingLocation: 'Dock B (Fluids)',
        qualityInspector: 'Sam Morales',
        items: [
          {
            sku: 'OIL-MTL-5W40-GEN2',
            name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic (60 L)',
            orderedQty: 60,
            shippedQty: 60,
            acceptedQty: 60,
            unitCost: 9.50,
            total: 570.00
          }
        ],
        acceptedTotalQty: 60,
        subtotal: 1390.00,
        taxAmount: 150.80,
        freightAmount: 0.00,
        totalInvoiceAmount: 1540.80,
        status: 'Committed',
        date: '17 Oct, 14:15'
      },
      {
        grnNumber: 'GRN-2024-0416',
        supplierName: 'Mann+Hummel Filtration',
        supplierCode: 'ASUP-MNN-005',
        invoiceRef: 'INV-MNN-2039',
        poRef: 'PO-2024-0972',
        receivingLocation: 'Dock A (Small Parts)',
        qualityInspector: 'Dan Thornton',
        items: [
          {
            sku: 'FLT-MNN-HU7035Y',
            name: 'OEM Mann Engine Oil Filter',
            orderedQty: 25,
            shippedQty: 25,
            acceptedQty: 25,
            unitCost: 14.00,
            total: 350.00
          }
        ],
        acceptedTotalQty: 84,
        subtotal: 810.00,
        taxAmount: 80.20,
        freightAmount: 0.00,
        totalInvoiceAmount: 890.20,
        status: 'Committed',
        date: '17 Oct, 09:40'
      }
    ];

    // 4. Invoices & Ledger (Matching Screenshot 5)
    const initialInvoices: Invoice[] = [
      {
        id: 'INV-2024-1088',
        jobCardId: 'JC-8492',
        customerName: 'Robert Sterling',
        vehiclePlate: 'GRZ-4819',
        vehicleDesc: '2022 Audi A6 Quattro 3.0T',
        laborTotal: 397.50,
        partsTotal: 513.25,
        subtotal: 938.75,
        taxAmount: 89.18,
        discountAmount: 46.94,
        grandTotal: 980.99,
        paidAmount: 300.00,
        balanceDue: 680.99,
        status: 'Partial / Due',
        paymentMethod: 'UPI / QR',
        gatepassIssued: false,
        issuedAt: 'Today, 15:42 PM'
      },
      {
        id: 'INV-2024-1087',
        jobCardId: 'JC-8423',
        customerName: 'James Wilson',
        vehiclePlate: 'TRX-8890',
        vehicleDesc: '2022 Ford F-150 Lariat',
        laborTotal: 435.93,
        partsTotal: 1420.00,
        subtotal: 1890.93,
        taxAmount: 189.09,
        discountAmount: 0.00,
        grandTotal: 2198.00,
        paidAmount: 2198.00,
        balanceDue: 0.00,
        status: 'Paid in Full',
        paymentMethod: 'UPI / QR',
        transactionRef: 'UPI-AXIS-QR-A4910',
        gatepassIssued: true,
        issuedAt: 'Today, 14:15 PM'
      },
      {
        id: 'INV-2024-1086',
        jobCardId: 'JC-8421',
        customerName: 'Marcus Vance',
        vehiclePlate: 'ABC-9821',
        vehicleDesc: '2021 BMW 330i xDrive',
        laborTotal: 461.90,
        partsTotal: 760.00,
        subtotal: 1246.90,
        taxAmount: 124.69,
        discountAmount: 0.00,
        grandTotal: 1458.00,
        paidAmount: 1458.00,
        balanceDue: 0.00,
        status: 'Paid in Full',
        paymentMethod: 'POS Card',
        transactionRef: 'POS-BAY2-TERM',
        gatepassIssued: true,
        issuedAt: 'Today, 12:30 PM'
      },
      {
        id: 'INV-2024-1085',
        jobCardId: 'JC-8425',
        customerName: 'Alex Romero',
        vehiclePlate: 'CTR-2023',
        vehicleDesc: '2023 Honda Civic Type R',
        laborTotal: 264.75,
        partsTotal: 828.00,
        subtotal: 1114.75,
        taxAmount: 111.48,
        discountAmount: 0.00,
        grandTotal: 1288.00,
        paidAmount: 0.00,
        balanceDue: 1288.00,
        status: 'Draft / In QC',
        gatepassIssued: false,
        issuedAt: 'Today, 11:10 AM'
      },
      {
        id: 'INV-2024-1084',
        jobCardId: 'JC-8419',
        customerName: 'Sarah Jenkins',
        vehiclePlate: 'W205-557',
        vehicleDesc: '2020 Mercedes C300',
        laborTotal: 291.86,
        partsTotal: 428.00,
        subtotal: 719.86,
        taxAmount: 72.00,
        discountAmount: 0.00,
        grandTotal: 840.80,
        paidAmount: 840.80,
        balanceDue: 0.00,
        status: 'Paid in Full',
        paymentMethod: 'Cash',
        transactionRef: 'CASH-REG-01',
        gatepassIssued: true,
        issuedAt: 'Today, 09:45 AM'
      }
    ];

    // 5. Operating Expenses (Matching Screenshot 5)
    const initialExpenses: Expense[] = [
      {
        id: 'exp-1',
        date: 'Today, 14:30',
        title: 'Castrol Drum Stock Purchase',
        category: 'Supplies & Parts',
        vendorOrRecipient: 'Shell / Castrol Dist. • Spare Parts',
        amount: 780.00,
        paymentMethod: 'NEFT',
        status: 'Approved'
      },
      {
        id: 'exp-2',
        date: 'Today, 12:15',
        title: 'Air Compressor Maintenance',
        category: 'Equipment & Maintenance',
        vendorOrRecipient: 'Atlas Copco • Cash Counter',
        amount: 240.00,
        paymentMethod: 'Cash',
        status: 'Verified'
      },
      {
        id: 'exp-3',
        date: 'Today, 13:00',
        title: 'Technician Overtime Meals',
        category: 'Technician Meals / Overtime',
        vendorOrRecipient: '8 Mechanics • UPI Counter',
        amount: 95.00,
        paymentMethod: 'UPI',
        status: 'Verified'
      },
      {
        id: 'exp-4',
        date: 'Today, 10:45',
        title: 'Oxygen & Acetylene Bay 4',
        category: 'Utilities / Gases',
        vendorOrRecipient: 'BOC Gas Dist. • NEFT',
        amount: 165.00,
        paymentMethod: 'NEFT',
        status: 'Verified'
      }
    ];

    // 6. Workshop Bays
    const initialBays: BayInfo[] = [
      { bayNumber: 1, vehicleModel: 'Ford F-150 Lariat', regPlate: 'TRX-8890', technician: 'Sam Morales', serviceType: 'Suspension Fitment', progressPercent: 100, status: 'Occupied' },
      { bayNumber: 2, vehicleModel: 'BMW 330i xDrive', regPlate: 'ABC-9821', technician: 'Liam Walker', serviceType: 'Regular Service', progressPercent: 100, status: 'Available' },
      { bayNumber: 3, vehicleModel: 'Audi A6 3.0T Quattro', regPlate: 'GRZ-4819', technician: 'Dan Thornton', serviceType: 'Brakes & Minor Service', progressPercent: 65, status: 'Occupied' },
      { bayNumber: 4, vehicleModel: 'Porsche Macan GTS', regPlate: 'PCN-4421', technician: 'Chris Evans', serviceType: 'Transmission Flush', progressPercent: 40, status: 'Occupied' },
      { bayNumber: 5, vehicleModel: 'Honda Civic Type R', regPlate: 'CTR-2023', technician: 'Dan Thornton', serviceType: 'Brake Bleed & QC', progressPercent: 80, status: 'QC Inspection' },
      { bayNumber: 6, vehicleModel: 'Mercedes-Benz E350', regPlate: 'MBZ-7711', technician: 'Liam Walker', serviceType: 'Air Suspension Check', progressPercent: 50, status: 'Occupied' },
      { bayNumber: 7, vehicleModel: 'Toyota Land Cruiser', regPlate: 'TLC-9900', technician: 'Sam Morales', serviceType: 'Heavy 80k Service', progressPercent: 30, status: 'Occupied' },
      { bayNumber: 8, vehicleModel: 'Empty Bay', regPlate: '—', technician: 'Unassigned', serviceType: 'Ready for Intake', progressPercent: 0, status: 'Available' }
    ];

    this.inventory.set(initialInventory);
    this.jobCards.set(initialJobCards);
    this.grnList.set(initialGRNList);
    this.invoices.set(initialInvoices);
    this.expenses.set(initialExpenses);
    this.bays.set(initialBays);
  }

  // --- CRUD & State Transition Actions ---

  getJobCardById(id: string): JobCard | undefined {
    return this.jobCards().find(j => j.id.toLowerCase() === id.toLowerCase() || j.id.toLowerCase() === `#${id.toLowerCase()}`);
  }

  updateJobPipelineStep(jobId: string, stepNumber: number): void {
    const statuses: JobStatus[] = [
      'Intake', 
      'Inspection', 
      'Estimate', 
      'In Progress', 
      'QC & Testing', 
      'Final Billing', 
      'Ready', 
      'Delivered'
    ];
    const newStatus = statuses[stepNumber - 1] || 'In Progress';
    const percent = Math.min(100, Math.round((stepNumber / 8) * 100));

    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          return {
            ...c,
            pipelineStep: stepNumber,
            status: newStatus,
            progressPercent: stepNumber === 8 ? 100 : (stepNumber === 7 ? 100 : percent)
          };
        }
        return c;
      })
    );
    this.persist();
  }

  toggleChecklistItem(jobId: string, checkId: string): void {
    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          const updatedChecklist = c.checklist.map(chk => 
            chk.id === checkId ? { ...chk, completed: !chk.completed } : chk
          );
          return { ...c, checklist: updatedChecklist };
        }
        return c;
      })
    );
    this.persist();
  }

  addLaborService(jobId: string, service: { name: string; hours: number; rate: number }): void {
    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          const total = service.hours * service.rate;
          const newLab: LaborService = {
            id: 'lab-' + Date.now(),
            name: service.name,
            hours: service.hours,
            rate: service.rate,
            total,
            status: 'Running'
          };
          const updatedLabor = [...c.laborServices, newLab];
          return this.recalculateJobTotals({ ...c, laborServices: updatedLabor });
        }
        return c;
      })
    );
    this.persist();
  }

  removeLaborService(jobId: string, serviceId: string): void {
    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          const updatedLabor = c.laborServices.filter(l => l.id !== serviceId);
          return this.recalculateJobTotals({ ...c, laborServices: updatedLabor });
        }
        return c;
      })
    );
    this.persist();
  }

  requisitionPartForJob(jobId: string, sku: string, qty: number): boolean {
    const part = this.inventory().find(p => p.sku === sku);
    if (!part || part.currentStock < qty) {
      return false;
    }

    // Decrement inventory stock
    this.inventory.update(items => 
      items.map(p => p.sku === sku ? { ...p, currentStock: p.currentStock - qty } : p)
    );

    // Add to Job Card
    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          const amount = qty * part.unitPrice;
          const existing = c.partsUsed.find(p => p.sku === sku);
          let updatedParts: JobPart[];
          if (existing) {
            updatedParts = c.partsUsed.map(p => 
              p.sku === sku ? { ...p, qty: p.qty + qty, amount: (p.qty + qty) * p.unitPrice } : p
            );
          } else {
            updatedParts = [
              ...c.partsUsed,
              {
                id: 'pu-' + Date.now(),
                sku: part.sku,
                name: part.name,
                qty,
                unitPrice: part.unitPrice,
                amount,
                location: part.binLocation
              }
            ];
          }
          return this.recalculateJobTotals({ ...c, partsUsed: updatedParts });
        }
        return c;
      })
    );
    this.persist();
    return true;
  }

  removePartFromJob(jobId: string, partId: string): void {
    const card = this.getJobCardById(jobId);
    if (!card) return;
    const partItem = card.partsUsed.find(p => p.id === partId);
    if (partItem) {
      // Return stock back to inventory
      this.inventory.update(items => 
        items.map(p => p.sku === partItem.sku ? { ...p, currentStock: p.currentStock + partItem.qty } : p)
      );
    }

    this.jobCards.update(cards => 
      cards.map(c => {
        if (c.id === jobId) {
          const updatedParts = c.partsUsed.filter(p => p.id !== partId);
          return this.recalculateJobTotals({ ...c, partsUsed: updatedParts });
        }
        return c;
      })
    );
    this.persist();
  }

  private recalculateJobTotals(job: JobCard): JobCard {
    const laborTotal = job.laborServices.reduce((sum, l) => sum + l.total, 0);
    const partsTotal = job.partsUsed.reduce((sum, p) => sum + p.amount, 0);
    const shopSupplies = 28.00;
    const grossSubtotal = laborTotal + partsTotal + shopSupplies;
    const discountAmount = grossSubtotal * (job.discountRate || 0);
    const taxableAmount = grossSubtotal - discountAmount;
    const taxAmount = taxableAmount * (job.taxRate || 0.10);
    const grandTotal = taxableAmount + taxAmount;
    const balanceDue = Math.max(0, grandTotal - (job.advanceDeposit || 0));

    return {
      ...job,
      laborTotal,
      partsTotal,
      shopSupplies,
      grossSubtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      balanceDue
    };
  }

  // --- Inventory & GRN Methods ---

  addInventoryPart(partData: Omit<InventoryPart, 'id'>): void {
    const newPart: InventoryPart = {
      ...partData,
      id: 'p-' + Date.now()
    };
    this.inventory.update(parts => [newPart, ...parts]);
    this.persist();
  }

  updateInventoryPart(id: string, updated: Partial<InventoryPart>): void {
    this.inventory.update(parts => 
      parts.map(p => p.id === id ? { ...p, ...updated } : p)
    );
    this.persist();
  }

  updateStock(sku: string, delta: number): void {
    this.inventory.update(parts => 
      parts.map(p => p.sku === sku ? { ...p, currentStock: Math.max(0, p.currentStock + delta) } : p)
    );
    this.persist();
  }

  commitGRNToInventory(grnNumber: string): boolean {
    const grn = this.grnList().find(g => g.grnNumber === grnNumber);
    if (!grn || grn.status === 'Committed') return false;

    // Increase stock in inventory for each item
    this.inventory.update(parts => {
      const partsCopy = [...parts];
      grn.items.forEach(grnItem => {
        const matchIndex = partsCopy.findIndex(p => p.sku === grnItem.sku);
        if (matchIndex > -1) {
          partsCopy[matchIndex] = {
            ...partsCopy[matchIndex],
            currentStock: partsCopy[matchIndex].currentStock + grnItem.acceptedQty
          };
        }
      });
      return partsCopy;
    });

    // Mark GRN as committed
    this.grnList.update(list => 
      list.map(g => g.grnNumber === grnNumber ? { ...g, status: 'Committed' } : g)
    );
    this.persist();
    return true;
  }

  addNewGRN(grn: GoodsReceiptNote): void {
    this.grnList.update(list => [grn, ...list]);
    this.persist();
  }

  // --- Billing & Invoicing Methods ---

  generateInvoiceFromJob(jobId: string): Invoice {
    const job = this.getJobCardById(jobId);
    if (!job) throw new Error('Job Card not found');

    const invoiceId = 'INV-2024-' + Math.floor(1000 + Math.random() * 9000);
    const invoice: Invoice = {
      id: invoiceId,
      jobCardId: job.id,
      customerName: job.customer.name,
      vehiclePlate: job.vehicle.regPlate,
      vehicleDesc: `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}`,
      laborTotal: job.laborTotal,
      partsTotal: job.partsTotal,
      subtotal: job.grossSubtotal,
      taxAmount: job.taxAmount,
      discountAmount: job.discountAmount,
      grandTotal: job.grandTotal,
      paidAmount: job.advanceDeposit,
      balanceDue: job.balanceDue,
      status: job.balanceDue <= 0 ? 'Paid in Full' : 'Partial / Due',
      gatepassIssued: job.balanceDue <= 0,
      issuedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.invoices.update(invs => [invoice, ...invs]);
    this.updateJobPipelineStep(job.id, 6); // Move to Final Billing
    this.persist();
    return invoice;
  }

  settleInvoicePayment(
    invoiceId: string, 
    amountPaid: number, 
    method: 'UPI / QR' | 'POS Card' | 'Cash' | 'Bank NEFT',
    refNo: string
  ): void {
    this.invoices.update(invs => 
      invs.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amountPaid;
          const newBalance = Math.max(0, inv.grandTotal - newPaid);
          const isFullyPaid = newBalance <= 0.01;
          return {
            ...inv,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: isFullyPaid ? 'Paid in Full' : 'Partial / Due',
            paymentMethod: method,
            transactionRef: refNo,
            gatepassIssued: isFullyPaid
          };
        }
        return inv;
      })
    );

    // Also update corresponding Job Card
    const targetInvoice = this.invoices().find(i => i.id === invoiceId);
    if (targetInvoice && targetInvoice.balanceDue <= 0.01) {
      this.updateJobPipelineStep(targetInvoice.jobCardId, 7); // Step 7: Ready for Pickup
    }
    this.persist();
  }

  // --- Expenses ---

  addExpense(expenseData: Omit<Expense, 'id' | 'date'>): void {
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.expenses.update(exps => [newExpense, ...exps]);
    this.persist();
  }

  // --- New Vehicle Intake ---

  registerVehicleIntake(intake: {
    customerName: string;
    phone: string;
    email: string;
    make: string;
    model: string;
    year: number;
    regPlate: string;
    vin: string;
    odometer: number;
    fuelLevel: number;
    complaintText: string;
    technician: string;
    bay: string;
  }): JobCard {
    const newJobId = 'JC-' + Math.floor(8500 + Math.random() * 500);
    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      name: intake.customerName,
      phone: intake.phone,
      email: intake.email,
      vipTier: 'Regular',
      preferredChannel: 'WhatsApp / SMS Auto',
      priorVisits: 1,
      paymentRecordRating: 'Good'
    };

    const newVehicle: Vehicle = {
      id: 'veh-' + Date.now(),
      vin: intake.vin || ('VIN' + Math.random().toString(36).substring(2, 10).toUpperCase()),
      make: intake.make,
      model: intake.model,
      year: intake.year || 2023,
      engine: '2.0L Turbo',
      regPlate: intake.regPlate.toUpperCase(),
      odometer: intake.odometer || 25000,
      fuelLevel: intake.fuelLevel || 50,
      bayNumber: intake.bay || 'Bay #1',
      customerId: newCustomer.id,
      imageUrl: 'assets/images/audi-a6.jpg'
    };

    const newCard: JobCard = {
      id: newJobId,
      vehicleId: newVehicle.id,
      vehicle: newVehicle,
      customerId: newCustomer.id,
      customer: newCustomer,
      status: 'Intake',
      pipelineStep: 1,
      progressPercent: 12,
      priority: 'Normal',
      assignedTechnician: intake.technician || 'Dan Thornton',
      technicianRole: 'Master Tech • ASE Certified',
      complaints: [
        {
          id: 'comp-' + Date.now(),
          title: 'Initial Intake Request',
          description: intake.complaintText || 'General inspection and diagnostics requested.',
          tag: 'General Inspection'
        }
      ],
      laborServices: [
        {
          id: 'lab-' + Date.now(),
          name: 'Multi-Point Initial Vehicle Inspection',
          hours: 1.0,
          rate: 85.00,
          total: 85.00,
          status: 'Done'
        }
      ],
      partsUsed: [],
      checklist: [
        { id: 'c1', task: 'Check fluid levels & battery health', completed: true },
        { id: 'c2', task: 'Inspect brake pads & rotor wear', completed: false, active: true },
        { id: 'c3', task: 'Scan OBD-II diagnostic fault codes', completed: false }
      ],
      laborTotal: 85.00,
      partsTotal: 0.00,
      shopSupplies: 28.00,
      grossSubtotal: 113.00,
      discountRate: 0.00,
      discountAmount: 0.00,
      taxRate: 0.10,
      taxAmount: 11.30,
      grandTotal: 124.30,
      advanceDeposit: 0.00,
      balanceDue: 124.30,
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetHandover: 'Tomorrow • 05:00 PM'
    };

    this.jobCards.update(cards => [newCard, ...cards]);
    this.persist();
    return newCard;
  }
}

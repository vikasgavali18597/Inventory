import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="icon-wrapper" [style.width.px]="size" [style.height.px]="size" [style.color]="color">
      <svg 
        [attr.width]="size" 
        [attr.height]="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="feather-icon">
        <ng-container [ngSwitch]="name">
          <!-- Dashboard -->
          <g *ngSwitchCase="'dashboard'">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </g>

          <!-- Car / Vehicle -->
          <g *ngSwitchCase="'car'">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H7.5a1 1 0 0 0-.8.4L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m14 0a2 2 0 1 1-4 0m-8 0a2 2 0 1 1-4 0"></path>
          </g>

          <!-- Wrench / Tool / Job Cards -->
          <g *ngSwitchCase="'wrench'">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </g>

          <!-- Package / Inventory -->
          <g *ngSwitchCase="'inventory'">
            <path d="m7.5 4.27 9 5.15"></path>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
            <path d="m3.3 7 8.7 5 8.7-5"></path>
            <path d="M12 22V12"></path>
          </g>

          <!-- Truck / Supplier -->
          <g *ngSwitchCase="'truck'">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </g>

          <!-- Billing / Receipt / Invoices -->
          <g *ngSwitchCase="'billing'">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
            <path d="M14 8H8"></path>
            <path d="M16 12H8"></path>
            <path d="M13 16H8"></path>
          </g>

          <!-- Dollar / Expense -->
          <g *ngSwitchCase="'expense'">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </g>

          <!-- Users / Customer -->
          <g *ngSwitchCase="'users'">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </g>

          <!-- Search -->
          <g *ngSwitchCase="'search'">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </g>

          <!-- Plus -->
          <g *ngSwitchCase="'plus'">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </g>

          <!-- Check -->
          <g *ngSwitchCase="'check'">
            <polyline points="20 6 9 17 4 12"></polyline>
          </g>

          <!-- Check Circle -->
          <g *ngSwitchCase="'check-circle'">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </g>

          <!-- Clock -->
          <g *ngSwitchCase="'clock'">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </g>

          <!-- Alert Triangle -->
          <g *ngSwitchCase="'alert'">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </g>

          <!-- Trash -->
          <g *ngSwitchCase="'trash'">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </g>

          <!-- Printer -->
          <g *ngSwitchCase="'printer'">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </g>

          <!-- QR Code -->
          <g *ngSwitchCase="'qr-code'">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </g>

          <!-- Credit Card -->
          <g *ngSwitchCase="'credit-card'">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </g>

          <!-- Delivery / Checkmark box -->
          <g *ngSwitchCase="'delivery'">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </g>

          <!-- Filter -->
          <g *ngSwitchCase="'filter'">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </g>

          <!-- Arrow Right -->
          <g *ngSwitchCase="'arrow-right'">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </g>

          <!-- Refresh -->
          <g *ngSwitchCase="'refresh'">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </g>

          <!-- X / Close -->
          <g *ngSwitchCase="'close'">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </g>

          <!-- Default -->
          <g *ngSwitchDefault>
            <circle cx="12" cy="12" r="10"></circle>
          </g>
        </ng-container>
      </svg>
    </span>
  `,
  styles: [`
    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 1;
    }
    .feather-icon {
      display: block;
    }
  `]
})
export class IconComponent {
  @Input() name: string = 'dashboard';
  @Input() size: number = 18;
  @Input() color: string = 'currentColor';
}

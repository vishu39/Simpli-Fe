import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app-layout/main-layout/main-layout.component';
import { PricePlanBarComponent } from './price-plan-bar/price-plan-bar.component';
import { PricePlanSidebarComponent } from './price-plan-sidebar/price-plan-sidebar.component';
@NgModule({
  imports: [CommonModule, NgbModule, MatTabsModule],
  declarations: [AuthLayoutComponent, MainLayoutComponent, PricePlanBarComponent, PricePlanSidebarComponent],
})
export class LayoutModule {}

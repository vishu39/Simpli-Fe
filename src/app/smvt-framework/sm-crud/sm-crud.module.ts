import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmCrudListComponent } from './sm-crud-list/sm-crud-list.component';
import { SmToolbarComponent } from './sm-toolbar/sm-toolbar.component';
import { SmFormComponent } from './sm-form/sm-form.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { GenericDialogComponent } from '../components/generic-dialog/generic-dialog.component';
import { SampleListComponent } from 'src/app/sample/sample-list.component';
import { ResizeColumnDirective } from '../directives/resize-column.directive';
import { GenericFilterDialogComponent } from '../components/generic-filter-dialog/generic-filter-dialog.component';
import { SafeURLPipe } from '../pipes/safe-url.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { SmExpansionPanelComponent } from '../components/sm-expansion-panel/sm-expansion-panel.component';
import { SmLightboxComponent } from '../components/sm-lightbox/sm-lightbox.component';

@NgModule({
  declarations: [
    SmToolbarComponent,
    SmFormComponent,
    SmCrudListComponent,
    GenericDialogComponent,
    SampleListComponent,
    ResizeColumnDirective,
    GenericFilterDialogComponent,
    SafeURLPipe,
    SafeHtmlPipe,
    SmExpansionPanelComponent,
    SmLightboxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
  ],
  exports:[
    SmToolbarComponent,
    SmFormComponent,
    SmCrudListComponent,
    GenericDialogComponent,
    SampleListComponent,
    ResizeColumnDirective,
    GenericFilterDialogComponent,
    SafeURLPipe,
    SafeHtmlPipe,
    SmExpansionPanelComponent,
    SmLightboxComponent
  ]
})
export class SmCrudModule { }

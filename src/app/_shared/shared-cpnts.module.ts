import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { MatDialogModule } from '@angular/material';
import { MaterialModule } from 'app/main/material/material.module';


@NgModule({
  declarations: [ AlertComponent ],
  imports: [
    CommonModule,
    MatDialogModule,
    MaterialModule,

  ],
  entryComponents: [
    AlertComponent
  ]
})
export class SharedCpntsModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import { GapComponent } from './gap.component';
import {TranslateModule} from '@ngx-translate/core';
// import { MaterialModule } from 'app/main/material/material.module';

@NgModule({
  declarations: [GapComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    RouterModule.forChild([{path: '', component: GapComponent}]),
    // MaterialModule
  ],
  exports: [
    // MaterialModule
  ],
})
export class GapModule { }


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule, MatExpansionModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatTooltipModule, MAT_DATE_LOCALE } from '@angular/material'

import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";

import { AppComponent } from './app.component';
import { SidepanelComponent, ImpactToStringPipe } from './sidepanel/sidepanel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TreeSelectorComponent } from './tree-selector/tree-selector.component';
import { KeysPipe } from './keys.pipe';
import { EventConstraintsPipe } from './tree-selector/event-constraints.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidepanelComponent,
    ImpactToStringPipe,
    TreeSelectorComponent,
    KeysPipe,
    EventConstraintsPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
              {provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }

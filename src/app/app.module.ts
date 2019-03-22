import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule, MatExpansionModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule } from '@angular/material'

import { AppComponent } from './app.component';
import { SidepanelComponent, ImpactToStringPipe } from './sidepanel/sidepanel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TreeSelectorComponent } from './tree-selector/tree-selector.component';
import { KeysPipe } from './keys.pipe';
import { EventConstraintsPipe } from './tree-selector/event-constraints.pipe';
import { IncidentService } from './model/incident.service';
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
    MatNativeDateModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

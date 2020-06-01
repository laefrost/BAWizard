import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule,MatRadioModule, MatExpansionModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatTooltipModule, MAT_DATE_LOCALE, MatProgressSpinnerModule } from '@angular/material'
import {MatStepperModule} from '@angular/material/stepper';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import {CdkStepperModule} from '@angular/cdk/stepper'; 

//import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SidepanelComponent, ImpactToStringPipe } from './sidepanel/sidepanel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TreeSelectorComponent } from './tree-selector/tree-selector.component';
import { KeysPipe } from './keys.pipe';
import { EventConstraintsPipe } from './tree-selector/event-constraints.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { IncidentComponent } from './sites/incident/incident.component';
import { QuestionsComponent } from './sites/questions/questions.component';
import { StepperComponent } from './sites/stepper/stepper.component';



/*const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'questions',      component: QuestionsComponent }]*/

@NgModule({
  declarations: [
    AppComponent,
    SidepanelComponent,
    ImpactToStringPipe,
    TreeSelectorComponent,
    KeysPipe,
    EventConstraintsPipe,
    IncidentComponent,
    QuestionsComponent,
    StepperComponent
  ],
  imports: [
    /*RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),*/
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatStepperModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    CdkStepperModule
  ],
  providers: [{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
              {provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }

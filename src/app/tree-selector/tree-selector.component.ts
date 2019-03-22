import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Incident } from '../model/incident';
import { IncidentService } from '../model/incident.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventConstraintsPipe } from './event-constraints.pipe';

@Component({
  selector: 'app-tree-selector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TreeSelectorComponent,
    multi: true
  }]
})
export class TreeSelectorComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() incidentTree: any;
  @Input() triggeredBy: string;
  @Output() valueChange = new EventEmitter();

  incident: Incident;
  choices: any = [];
  selections: string[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.incident = this.incidentService.getIncidents();
    this.choices[0] = this.incidentTree[Object.keys(this.incidentTree)[0]]
  }

  selectionChange(value: any, i: number){
    for(let j = this.selections.length - 1; j > i; j--){
      this.choices.pop();
      this.selections.pop();
    }

    if(value === undefined){
      this.selections.pop();
      this.choices.pop();
      if(this.choices.length == 0)
        this.choices[0] = this.incidentTree[Object.keys(this.incidentTree)[0]]
    }
    else
      this.selections[i] = value;
    if(this.choices[i][value])
      this.choices[i+1] = this.choices[i][value];

    this.valueChange.emit(this.selections);
  }

    registerOnTouched(): void {
    }
    registerOnChange(fn: any): void {
      this.valueChange.subscribe((data: string[]) => fn(data));
    }
    writeValue(value: any): void {
      this.selections = value;
    }

    ngOnChanges(changes: SimpleChanges){
      if(changes.triggeredBy){
        let eventConstraintPipe: EventConstraintsPipe = new EventConstraintsPipe();
        this.selections.forEach((selection, i) => {
          if(!eventConstraintPipe.isEventAllowed(selection, this.incident.getElementById(changes.triggeredBy.currentValue))){
            this.selectionChange(undefined, i);
          }
        });
      }
    }
}

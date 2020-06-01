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
  test = "test"

  constructor(private incidentService: IncidentService) { }

  ngOnInit() {
    console.log("onInit")
    this.incident = this.incidentService.getIncidents();
    this.choices[0] = this.incidentTree.elements
    console.log("tree selector component incident tree")
    console.log(Object.values(this.incidentTree)[0])
    console.log(this.choices[0])
    
  }

  selectionChange(value: any, i: number) {
    console.log("selectionChange")
    console.log(value)
    console.log(i)
    for (let j = this.selections.length - 2; j > i; j--) {
      this.choices.pop();
      this.selections.pop();
      //this.selections.shift()
    
    }

    if (value === undefined) {
      this.selections.pop();
      this.choices.pop();
      if (this.choices.length == 0)
        //this.choices[0] = this.incidentTree[Object.keys(this.incidentTree)[0]]
        this.choices[0] = this.incidentTree
        console.log(this.choices[0])
    }
    else
      this.selections.pop()
      this.selections[i] = value.name;
      this.selections.push(value.id)
    if (value.elements)
      this.choices[i + 1] = value.elements;
      console.log("value elements")
      console.log(this.choices[i+1])
      
      //console.log(this.choices[i][value])
    
    console.log(this.selections)
    this.valueChange.emit(this.selections);
  }

  registerOnTouched(): void {
  }
  registerOnChange(fn: any): void {
    console.log("registerOnChange")
    this.valueChange.subscribe((data: string[]) => fn(data));
  }
  writeValue(value: any): void {
    console.log("writeValue")
    this.selections = value;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges")
    if (changes.triggeredBy) {
      let eventConstraintPipe: EventConstraintsPipe = new EventConstraintsPipe();
      this.selections.forEach((selection, i) => {
        if (!eventConstraintPipe.isEventAllowed(
            selection,
            this.incident.getElementById(changes.triggeredBy.currentValue))) {
          this.selectionChange(undefined, i);
        }
      });
    }
    console.log(this.selections)
  }
}

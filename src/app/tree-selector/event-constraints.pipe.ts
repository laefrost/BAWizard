import { Pipe, PipeTransform } from '@angular/core';
import constraintsJson from '../model/constraints.json';
import { IncidentService } from '../model/incident.service.js';
import { Incident } from '../model/incident.js';

@Pipe({
  name: 'eventConstraints'
})
export class EventConstraintsPipe implements PipeTransform {


  constructor(){
  };

  transform(selectibleEvents: string[], triggeredBy: number, incident): string[] {
    let triggeredByEvent: string[] = incident.getElementById(triggeredBy);
    if(triggeredBy === undefined || triggeredByEvent === undefined)
      return selectibleEvents;
    let newSelectibleEvents: string[] = [];
    for(let event of selectibleEvents){
      if(this.isEventAllowed(event, triggeredByEvent)){
        newSelectibleEvents.push(event);
      }
    }
    return newSelectibleEvents;
  }

  isEventAllowed(event: string, triggeredBy: string[]): boolean{
    for(let triggeredByEvent of triggeredBy){
      if(!constraintsJson[event])
        continue;
      for(let prohibited of constraintsJson[event].prohibits){
        if(prohibited === triggeredByEvent){
          console.log("prohibited: " + event);
          return false;
        }
      }
    }
    return true;
  }

}

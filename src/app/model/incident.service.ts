import { Injectable } from '@angular/core';
import { Incident } from './incident';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  public incident: Incident = new Incident();

  constructor() { }

  getIncidents(): Incident{
    // console.log(this.incident)
    return this.incident;
  }
}

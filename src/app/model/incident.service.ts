import { Injectable } from '@angular/core';
import { Incident } from './incident';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  incident: Incident = new Incident();

  constructor() { }

  getIncidents(): Incident{
    return this.incident;
  }
}

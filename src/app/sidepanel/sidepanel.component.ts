import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { IncidentService } from '../model/incident.service';
import { Incident, Impact } from '../model/incident';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css']
})
export class SidepanelComponent implements OnInit {
  @Input() concluded: boolean;
  incident: Incident;

  constructor(private incidentService: IncidentService) { }

  ngOnInit() {
    this.incident = this.incidentService.getIncidents();
  }
}

@Pipe({name: 'impactToString'})
export class ImpactToStringPipe implements PipeTransform {
  transform(impact: Impact): string {
    return Impact[impact];
  }
}

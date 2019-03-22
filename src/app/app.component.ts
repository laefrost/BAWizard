import { Component, OnInit, ViewChild } from '@angular/core';
import { Incident, Impact, ImpactDescription } from './model/incident';
import { IncidentService } from './model/incident.service';
import sourceJson from './model/source.json'
import eventsJson from './model/threat.json'
import entitiesJson from './model/entities.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  @ViewChild('wizard') wizard: any;
  @ViewChild('sourcesAccordion') sourcesAccordion: any;

  incident: Incident;
  impactKeys: string[] = Object.keys(Impact);
  impact = Impact;
  impactDescription = ImpactDescription;
  sourcesPanelOpened: boolean[] = [true];
  eventsPanelOpened: boolean[] = [true];
  entitiesPanelOpened: boolean[] = [true];

  sourcesTree: any;
  eventsTree: any;
  entitiesTree: any;

  concluded: boolean = false;
  incidentJsonOutput: string;

  buttonNext: string = "Next";

  wizardControler: Wizard;

  selected = [];

  constructor(private incidentService: IncidentService, private http: HttpClient){
    this.sourcesTree = sourceJson;
    this.eventsTree = eventsJson;
    this.entitiesTree = entitiesJson;
  }

  ngOnInit(): void {
    this.incident = this.incidentService.getIncidents();
    this.wizardControler = new Wizard(this);
    let buttonNext = document.querySelector('.next');
    let buttonPrevious = document.querySelector('.previous');

    this.wizardControler.addControls(buttonPrevious, buttonNext);
  }

  addSource(): void{
    this.addElement(
      this.incident.sources,
      this.sourcesPanelOpened,
      {source: [], description: ""})
  }

  addEvent(): void{
    this.addElement(
      this.incident.events,
      this.eventsPanelOpened,
      {event: [], description: ""})
  }

  addEntity(): void{
    this.addElement(
      this.incident.entities,
      this.entitiesPanelOpened,
      {entity: [], description: ""})
  }

  addElement(elementArray: {description: string}[], openedArray: boolean[], element: any): void{
    if(elementArray.length < openedArray.length)
      openedArray.splice(elementArray.length, openedArray.length)

    openedArray.forEach((_e, i) => {openedArray[i]=false})
    openedArray.push(true);
    this.incident.addElement(element);
  }

  onConclude(){
    this.incidentJsonOutput = JSON.stringify(this.incident)
    this.postIncident();
  }

  postIncident(){
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    this.http.post('http://132.199.120.140:8080/STIXServer/webresources/simpleQuery', JSON.stringify(this.incident), {headers: headers}).subscribe(
      (val) => {
          console.log("POST call successful value returned in body",
                      val);
      },
      response => {
          console.log("POST call in error", response);
      }
    );
  }
}

class Steps{
  wizard: any;
  steps: any;
  stepsQuantity: any;
  currentStep: number;

  constructor(wizard: Wizard){
    this.wizard = wizard;
    this.steps = this.getSteps();
    this.stepsQuantity = this.getStepsQuantity();
    this.currentStep = 0;
  }

  setCurrentStep(currentStep: number){
    this.currentStep = currentStep;
  }

  getSteps(){
    return this.wizard.nativeElement.getElementsByClassName('step');
  }

  getStepsQuantity(){
    return this.getSteps().length;
  }

  handleConcludeStep(){
    this.steps[this.currentStep].classList.add('-completed');
  }

  handleStepsClasses(movement: number){
    if(movement > 0)
      this.steps[this.currentStep - 1].classList.add('-completed');
    else if(movement < 0)
      this.steps[this.currentStep].classList.remove('-completed');
  }
}

class Panels{
  wizard: any;
  panelWidth: any;
  panelsContainer: any;
  panels: any;
  currentStep: number;

  constructor(wizard: Wizard){
    this.wizard = wizard;
    this.panelWidth = this.wizard.nativeElement.offsetWidth;
    this.panelsContainer = this.getPanelsContainer();
    this.panels = this.getPanels();
    this.currentStep = 0;

    this.updatePanelsPosition(this.currentStep);
    this.updatePanelsContainerHeight();
  }

  getCurrentPanelHeight(){
    return `${this.getPanels()[this.currentStep].offsetHeight}px`;
  }

  getPanelsContainer(){
    return this.wizard.nativeElement.querySelector('.panels');
  }

  getPanels(){
    return this.wizard.nativeElement.getElementsByClassName('panel');
  }

  updatePanelsContainerHeight(){
    this.panelsContainer.style.height = this.getCurrentPanelHeight();
  }

  updatePanelsPosition(currentStep: number){
    const panels = this.panels;

    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.remove(
         'movingIn',
         'movingOutBackward',
         'movingOutFoward'
      );

      if(i !== currentStep){
        if(i < currentStep) panels[i].classList.add('movingOutBackward');
        else if( i > currentStep ) panels[i].classList.add('movingOutFoward');
      }else{
        panels[i].classList.add('movingIn');
      }
    }

    this.updatePanelsContainerHeight();
  }

  setCurrentStep(currentStep: number){
    this.currentStep = currentStep;
    this.updatePanelsPosition(currentStep);
  }
}

class Wizard{
  panels: Panels;
  steps: Steps;
  stepsQuantity: any;
  currentStep: number;
  concludeControlMoveStepMethod: any;
  wizardConclusionMethod: any;
  previousControl: any;
  nextControl: any;
  previousControlMoveStepMethod: any;
  nextControlMoveStepMethod: any;
  component: AppComponent;

  constructor(component: AppComponent){
    this.panels = new Panels(component.wizard);
    this.steps = new Steps(component.wizard);
    this.stepsQuantity = this.steps.getStepsQuantity();
    this.currentStep = this.steps.currentStep;
    this.component = component;

    this.concludeControlMoveStepMethod = this.steps.handleConcludeStep.bind(this.steps);
    this.wizardConclusionMethod = this.handleWizardConclusion.bind(this);
  }

  updateButtonsStatus(){
    if(this.currentStep === 0)
      this.previousControl.classList.add('disabled');
    else
      this.previousControl.classList.remove('disabled');
  }

  updtadeCurrentStep(movement: number){
    this.currentStep += movement;
    this.steps.setCurrentStep(this.currentStep);
    this.panels.setCurrentStep(this.currentStep);

    this.handleNextStepButton();
    this.updateButtonsStatus();
  }

  handleNextStepButton(){
    if(this.currentStep === this.stepsQuantity - 1){
      this.component.buttonNext = 'Conclude!';

      this.nextControl.removeEventListener('click', this.nextControlMoveStepMethod);
      this.nextControl.addEventListener('click', this.concludeControlMoveStepMethod);
      this.nextControl.addEventListener('click', this.wizardConclusionMethod);
    }else{
      this.component.buttonNext = 'Next';

      this.nextControl.addEventListener('click', this.nextControlMoveStepMethod);
      this.nextControl.removeEventListener('click', this.concludeControlMoveStepMethod);
      this.nextControl.removeEventListener('click', this.wizardConclusionMethod);
    }
  }

  handleWizardConclusion(){
    this.component.concluded = true;
    this.component.onConclude();
  };

  addControls(previousControl: any, nextControl: any){
    this.previousControl = previousControl;
    this.nextControl = nextControl;
    this.previousControlMoveStepMethod = this.moveStep.bind(this, -1);
    this.nextControlMoveStepMethod = this.moveStep.bind(this, 1);

    previousControl.addEventListener('click', this.previousControlMoveStepMethod);
    nextControl.addEventListener('click', this.nextControlMoveStepMethod);

    this.updateButtonsStatus();
  }

  moveStep(movement: number){
    if(this.validateMovement(movement)){
      this.updtadeCurrentStep(movement);
      this.steps.handleStepsClasses(movement);
    }else{
       throw('This was an invalid movement');
    }
  }

  validateMovement(movement: number){
    const fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
    const backMov = movement < 0 && this.currentStep > 0;

    return fowardMov || backMov;
  }
}

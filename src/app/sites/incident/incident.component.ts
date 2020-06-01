import { Component, OnInit, ViewChild } from '@angular/core';
import { Incident, Impact, ImpactDescription } from '../../model/incident';
import { IncidentService } from '../../model/incident.service';
import sourceJson from '../../model/source.json'
import eventsJson from '../../model/threat.json'
import entitiesJson from '../../model/entities.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnswerServiceService } from 'src/app/services/answer-service.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent implements OnInit {

  @ViewChild('wizard') wizard: any;
  @ViewChild('sourcesAccordion') sourcesAccordion: any;

  incident: Incident;
  impactKeys: string[] = Object.keys(Impact);
  impact = Impact;
  impactDescription = ImpactDescription;
  sourcesPanelOpened: boolean[] = [true];
  eventsPanelOpened: boolean[] = [true];
  entitiesPanelOpened: boolean[] = [true];
  impactsPanelOpened: boolean[] = [true]
  serverAnswer 

  done:boolean
  sourcesTree: {}
  impactTree:{}
  entitiesTree:{}
  eventsTree:{}

  loading: boolean = false;

  concluded: boolean = false;
  stixIncidentUrl = "";

  buttonNext: string = "Next";

  wizardControler: Wizard;

  selected = [];

  constructor(private dataService: DataService, private incidentService: IncidentService, private http: HttpClient, private _router:Router, private answerService: AnswerServiceService){
  }

  async ngOnInit():Promise<void> {
    this.done = false
    await this.getData();
    this.incident = this.incidentService.getIncidents();
    this.wizardControler = new Wizard(this);
    let buttonNext = document.querySelector('.next');
    let buttonPrevious = document.querySelector('.previous');

    this.wizardControler.addControls(buttonPrevious, buttonNext);
    this.done = true
  }

  async getData(): Promise<void> {
    console.log("getAsync")
    const s = await this.dataService.getSources().toPromise();
    let sList = JSON.stringify(s[0])
    let sTemp = JSON.parse(sList)
    this.sourcesTree = sTemp;

    const en = await this.dataService.getEnities().toPromise(); 
    let enList = JSON.stringify(en[0])
    let enTemp = JSON.parse(enList)
    this.entitiesTree = enTemp;
    console.log(this.entitiesTree)

    const ev = await this.dataService.getEvents().toPromise(); 
    let evList = JSON.stringify(ev[0])
    let evTemp = JSON.parse(evList)
    this.eventsTree = evTemp;

    const i = await this.dataService.getImpacts().toPromise(); 
    let iList = JSON.stringify(i[0])
    let iTemp = JSON.parse(iList)
    this.impactTree = iTemp;


  }

  addSource(): void{
    console.log("addSource")
    this.addElement(
      this.incident.sources,
      this.sourcesPanelOpened,
      {source: [], description: ""})
      console.log(this.incident)
  }

  addEvent(): void{
    this.addElement(
      this.incident.events,
      this.eventsPanelOpened,
      {event: [], description: ""})
      console.log(this.incident)
  }

  addEntity(): void{
    this.addElement(
      this.incident.entities,
      this.entitiesPanelOpened,
      {entity: [], description: ""})
      console.log(this.incident)
  }

  addElement(elementArray: {description: string}[], openedArray: boolean[], element: any): void{
    console.log("addElement")
    if(elementArray.length < openedArray.length)
      openedArray.splice(elementArray.length, openedArray.length)

    openedArray.forEach((_e, i) => {openedArray[i]=false})
    openedArray.push(true);
    this.incident.addElement(element);
    console.log(this.incident)
  }

  onConclude(){
    this.postIncident();
    console.log(this.incident);
  }

  //'http://pcrw00033.uni-regensburg.de:8080/STIXServer/webresources/stixoutput'

  postIncident(){
    console.log(JSON.stringify(this.incident))
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    this.http.post('http://127.0.0.1:5000/user_incidents', JSON.stringify(this.incident), {headers: headers}).subscribe(
      (val) => {
          console.log(
                      val);
          this.serverAnswer = val; 
          console.log("Server Answer")
          console.log(this.serverAnswer)
          //this.answerService.sendAnswer(this.serverAnswer)
          sessionStorage.setItem("answer", JSON.stringify(this.serverAnswer))
          this._router.navigateByUrl('/questions')


      },
      response => {
          console.log("POST call in error", response);
      }
    );
  }

  dateChange(event: any){
    this.incident.time = event.value.format('YYYY-MM-DD');
    console.log(this.incident.time);
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
  component: IncidentComponent;

  constructor(component: IncidentComponent){
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

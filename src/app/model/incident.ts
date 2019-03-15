export class Incident{
  sources: {
    source: string[];
    description: string;
  }[];
  events: {
    event: string[];
    description: string;
  }[];
  entities: {
    entity: string[];
    description: string;
  }[];
  impact: Impact;
  time: Date;
  email: string;
  description: string;

  constructor(){
    this.addSource();
    this.addEvent();
    this.addEntity();
  }

  addSource(): void{
    let newElement = {source: [], description: ""}
    if(!this.sources)
      this.sources = [newElement]
    else
      this.sources.push(newElement)
  }

  addEvent(): void{
    let newElement = {event: [], description: ""}
    if(!this.events)
      this.events = [newElement]
    else
      this.events.push(newElement)
  }

  addEntity(): void{
    let newElement = {entity: [], description: ""}
    if(!this.entities)
      this.entities = [newElement]
    else
      this.entities.push(newElement)
  }

  isOneEventSet(): boolean{
    for(let event of this.events){
      if(event.event.length > 0)
        return true;
    }
    return false;
  }

  isOneSourceSet(): boolean{
    for(let source of this.sources){
      if(source.source.length > 0)
        return true;
    }
    return false;
  }

  isOneEntitySet(): boolean{
    for(let entity of this.entities){
      if(entity.entity.length > 0)
        return true;
    }
    return false;
  }
}

export enum Impact{
  veryLow = "Very Low",
  low = "Low",
  moderate = "Moderate",
  high = "High",
  veryHigh = "Very High"
}

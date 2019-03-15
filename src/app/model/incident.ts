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

export enum ImpactDescription{
  veryLow = "The threat event could be expected to have a negligible adverse effect on organizational operations, organizational assets, individuals other organizations, or the Nation.",
  low = "The threat event could be expected to have a limited adverse effect on organizational operations, organizational assets, individuals other organizations, or the Nation. A limited adverse effect means that, for example, the threat event might: (i) cause a degradation in mission capability to an extent and duration that the organization is able to perform its primary functions, but the effectiveness of the functions is noticeably reduced; (ii) result in minor damage to organizational assets; (iii) result in minor financial loss; or (iv) result in minor harm to individuals.",
  moderate = "The threat event could be expected to have a serious adverse effect on organizational operations, organizational assets, individuals other organizations, or the Nation. A serious adverse effect means that, for example, the threat event might: (i) cause a significant degradation in mission capability to an extent and duration that the organization is able to perform its primary functions, but the effectiveness of the functions is significantly reduced; (ii) result in significant damage to organizational assets; (iii) result in significant financial loss; or (iv) result in significant harm to individuals that does not involve loss of life or serious life-threatening injuries.",
  high = "The threat event could be expected to have a severe or catastrophic adverse effect on organizational operations, organizational assets, individuals, other organizations, or the Nation. A severe or catastrophic adverse effect means that, for example, the threat event might: (i) cause a severe degradation in or loss of mission capability to an extent and duration that the organization is not able to perform one or more of its primary functions; (ii) result in major damage to organizational assets; (iii) result in major financial loss; or (iv) result in severe or catastrophic harm to individuals involving loss of life or serious life-threatening injuries.",
  veryHigh = "The threat event could be expected to have multiple severe or catastrophic adverse effects on organizational operations, organizational assets, individuals, other organizations, or the Nation."
}

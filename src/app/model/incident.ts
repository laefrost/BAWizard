export class Incident{
  sources: {
    source: string[];
    description: string;
    id: number;
  }[];
  events: {
    event: string[];
    description: string;
    id: number;
    triggeredBy: number;
  }[];
  entities: {
    entity: string[];
    description: string;
    id: number;
  }[];
  impact: Impact;
  time: Date;
  email: string;
  description: string;
  technicalData: string;
  title: string;

  idCount: number = 0;

  constructor(){
    this.addElement({source: [], description: ""});
    this.addElement({event: [], description: ""});
    this.addElement({entity: [], description: ""});
  }

  addElement(element: {source: [], description: string}): void;

  addElement(element: {event: [], description: string}): void;

  addElement(element: {entity: [], description: string}): void;

  addElement(element: {description: string}): void{
    let key: string;
    if(element['source'])
      key = 'sources';
    else if(element['event'])
      key = 'events';
    else if(element['entity'])
      key = 'entities';

    element['id'] = this.idCount++;
    if(!this[key])
      this[key] = [element]
    else
      this[key].push(element)
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

  getElementById(id: number): string[]{
    for(let source of this.sources)
      if(source.id === id)
        return source.source;

    for(let event of this.events)
      if(event.id === id)
        return event.event;

    for(let entity of this.entities)
      if(entity.id === id)
        return entity.entity;

    return undefined;
  }

  checkTitle(): boolean{
    if(this.title && this.title.trim())
      return true;
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

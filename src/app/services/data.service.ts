import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SelectModel } from '../classes/select-model';
import { catchError } from 'rxjs/operators';
import { Answer } from '../classes/answer';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  sourcesObj = new BehaviorSubject<Object[]>(null)
  sources :any; 
  events
  entities

  sourceUrl = 'http://127.0.0.1:5000/sources'
  eventsUrl = 'http://127.0.0.1:5000/events'
  entitiesUrl = 'http://127.0.0.1:5000/entities'
  impactsUrl = 'http://127.0.0.1:5000/impacts'

  constructor(private http: HttpClient) { }

  async setData() {
    console.log("setData")
    await this.http.get(this.sourceUrl).subscribe(
      data => {
        this.sources = data;
        console.log(this.sources)
        this.sourcesObj.next(Object.assign({}, this.sources));
      },
      error => console.log('Could not load todos.')
    );
    //this.events = this.http.get<Object[]>(this.eventsUrl)
    //this.entities = this.http.get<Object[]>(this.entities)
  }

  getSources(): Observable<SelectModel> {
    console.log("getSources")
    return this.http.get<SelectModel>(this.sourceUrl).pipe(
      catchError(this.handleError<SelectModel>('getSourcesFaaaaaaiiiiil'))
    ); 
  }

  getEvents() {
    console.log("getEvents")
    return this.http.get<SelectModel>(this.eventsUrl).pipe(
      catchError(this.handleError<SelectModel>('get Events Fail'))
    ); 
  }

  getEnities() {
    console.log("getEntities")
    return this.http.get<SelectModel>(this.entitiesUrl).pipe(
      catchError(this.handleError<SelectModel>('get Enities Fail'))
    ); 
  }

  getImpacts() {
    console.log("getImpacts")
    return this.http.get<SelectModel>(this.impactsUrl).pipe(
      catchError(this.handleError<SelectModel>('get Impact Fail'))
    ); 
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("eeeeeerrrooooor")
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

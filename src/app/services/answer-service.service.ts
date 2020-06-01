import { Injectable } from '@angular/core';
import { Answer } from '../classes/answer';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Incident } from '../model/incident';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnswerServiceService {
  private myAnswer= new BehaviorSubject<any>(null); 
  answerUrl = 'http://127.0.0.1:5000/answer'

  constructor(private http: HttpClient) { }

  sendAnswer(answer: any): void{
    console.log("sendAnswer")
    console.log(answer)
    this.myAnswer.next(answer)
  }

  getAnswer():Observable<any>{
    return this.myAnswer.asObservable()
  }

  postAnswer(answer: Answer){
    console.log("postAnswer")
    return this.http.post(this.answerUrl, JSON.stringify(answer)).pipe(
      catchError(this.handleError<Answer>('postAnswer')));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
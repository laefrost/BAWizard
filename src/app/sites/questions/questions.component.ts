import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AnswerServiceService } from 'src/app/services/answer-service.service';
import { Answer } from 'src/app/classes/answer';
import { Question } from 'src/app/classes/question';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CdkStepperModule, CdkStep, CdkStepper, CdkStepperNext } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: QuestionsComponent,
    multi: true
  }]
})
export class QuestionsComponent implements OnInit {
  subscription: any;
  questions: any;
  selections: Question[]
  temp
  answer: Answer
  serverAnswer
  concluded: boolean
  done: boolean
  subq
  valAnswer
  index
  indexlist = []
  @Input()
  stepper: CdkStepper
  constructor(private answerService: AnswerServiceService, private http: HttpClient, private _router: Router) {
  }

  ngOnInit() {
    this.concluded = false
    this.done = false
    console.log("OnInit")
    if (sessionStorage.getItem("answer"))
      var t = JSON.parse(sessionStorage.getItem("answer"))
    this.questions = t.questions[0]
    console.log("jdfjekjfhwejkfhejkfbskjdbf")
    /*this.subscription = this.answerService.getAnswer().
subscribe(data => this.questions = data)*/
    this.selections = []
    this.answer = new Answer()
    console.log(this.questions)
    console.log(t.questions)
    this.valAnswer = 0
    this.index = 0
    this.indexlist.push([0])
  }

  ngOnDestroy() {
    console.log("onDestroy")
    if (this.subscription != undefined)
      this.subscription.unsubscribe();
  }

  /*onSelectionChange(questionOb, question, i, val): void {
    console.log("onSelectionChange")
    console.log(question)
    this.selections[this.index] = new Question()
    this.selections[this.index].value = val
    this.selections[this.index].attributeId = question.attrId
    this.selections[this.index].topicId = question.topicId
    var t = JSON.parse(sessionStorage.getItem("answer"))
    this.valAnswer = this.valAnswer + val
    console.log(questionOb)

    if(i == questionOb.questions.length-1) {
      if (val > 0 ) {
        if (questionOb.children != undefined) {
          console.log("childquestions found")
          this.questions = questionOb.children[0]
        } else {
          console.log("find next question of same level1")
          this.findList(questionOb, t.questions,0, t.questions)
        }
      }
      else {
        console.log("find next question of same level2")
        this.findList(questionOb, t.questions,0,t.questions)
      }
    } else {
      //this.stepper.selectedIndex = i + 1;
    }

  }*/

  onSelectionChange(questionObj, question, i, value): void {
    this.valAnswer = this.valAnswer + value
    console.log("on Selection Change")
    console.log(i)
    var t = JSON.parse(sessionStorage.getItem("answer")).questions
    if (i == questionObj.questions.length - 1) {
      let selection = new Question()
      selection.value = this.valAnswer/(i+1)
      selection.attributeId= question.attrId
      selection.topicId = question.topicId
      this.selections[this.index] = selection
      if (this.valAnswer > 0) {
        if (questionObj.children != undefined) {
          console.log("childquestions found")
          this.valAnswer = 0
          this.indexlist.push([0])
          console.log(this.indexlist)
          this.questions = questionObj.children[0]
        } else {
          this.index = this.index + 1
          console.log("find next question of same level1")
          this.valAnswer = 0
          console.log("indexlist selectionchange")
          console.log(this.indexlist)
          var temp = this.indexlist[this.indexlist.length - 1][0] + 1
          this.indexlist.pop()
          this.indexlist.push([temp])
          this.generateObj(t, 0, [])
        }
      } else {
        this.index = this.index + 1
        console.log("find next question of same level1")
        this.valAnswer = 0
        console.log("indexlist selectionchange")
        console.log(this.indexlist)
        var temp = this.indexlist[this.indexlist.length - 1][0] + 1
        this.indexlist.pop()
        this.indexlist.push([temp])
        this.generateObj(t, 0, [])
      }
    }
  }

  //nochmal get object at indexlist 
  generateObj(t, i, list) {
    console.log("generarte Obj")
    console.log("i " + i)
    if (i < this.indexlist.length) {
      console.log("index list " + this.indexlist[i][0])
      if (i == 0) {
        list = t[this.indexlist[0][0]]
      } else {
        list = list.children[this.indexlist[i][0]]
      }
      i = i + 1
      console.log("liste")
      console.log(list)
      this.generateObj(t, i, list)
    } else {
      console.log("return list")
      console.log(list)
      if (list == undefined) {
        this.indexlist.pop()
        if (this.indexlist.length >= 1) {
          var temp = this.indexlist[this.indexlist.length - 1][0] + 1
          this.indexlist.pop()
          this.indexlist.push([temp])
          this.generateObj(t,0, [])
        }
        else {
          if (this.indexlist.length >0) {
            var temp = this.indexlist[this.indexlist.length - 1][0] + 1
            this.indexlist.pop()
            this.indexlist.push([temp])
            this.generateObj(t,0, [])
          }
          else {
            console.log("Doooooooooooooooooone")
            console.log(this.selections)
            this.submitAnswers()
          }
        }
      } else {
        this.questions = list
      }
    }
  }

  checkQuestions(t) {
    //if t has element ar indexlist then questions is t at index list
    //else cut index List and add +1 at end an then check again for question
    console.log("checkQuestuin")
    let result = this.generateObj(t, 0, [])
    console.log("gotten result")
    console.log(result)
    if (result == undefined) {
      this.indexlist.pop()
      if (this.indexlist.length >= 1) {
        var temp = this.indexlist[this.indexlist.length - 1][0] + 1
        this.indexlist.pop()
        this.indexlist.push([temp])
        this.checkQuestions(t)
      }
      else {
        if (this.indexlist.length >0) {
          var temp = this.indexlist[this.indexlist.length - 1][0] + 1
          this.indexlist.pop()
          this.indexlist.push([temp])
          this.checkQuestions(t)
        }
        else {
          console.log("Doooooooooooooooooone")
        }
        console.log("submit answers")
      }
    } else {
      this.questions = result
    }
  }

  //nochmal 
  /* findList(questionOb, list, index, t){
     console.log("findIndex")
     console.log(questionOb)
     console.log(list)
     if(list == questionOb) {
       console.log("list == question Ob")
       for (let i = 0; i < list.length; i++){
         this.findList(questionOb, list[i], i,t)
       }
     } else {
       if (index+1 <= list.length-1 )
         this.questions = list[index+1]
       else 
         //this.findList(list, t,0,t)
         console.log("hallo")
     } 
   }*/

  /*findList(questionOb, list, index, t){
    if(list == questionOb){
      console.log("found obj")
    }
    else {
      for (let i = 0; i < list.length; i++){
        this.findList(questionOb, list[i], i,t)
      }
    }
  }*/

  async submitAnswers() {
    var t = JSON.parse(sessionStorage.getItem("answer"))
    this.concluded = true
    this.answer.id = t.id
    this.answer.answers = this.selections
    console.log(this.answer)
    console.log(JSON.stringify(this.answer))
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    await this.http.post('http://127.0.0.1:5000/answer', JSON.stringify(this.answer), { headers: headers, responseType: "text" }).subscribe(
      (val) => {
        console.log(
          val);
        this.serverAnswer = JSON.parse(val);
        console.log("Server Answer")
        console.log(this.serverAnswer)
        sessionStorage.setItem("answer", JSON.stringify(this.serverAnswer))
        console.log(JSON.parse(sessionStorage.getItem("answer")).questions.lengt)
        if ((JSON.parse(sessionStorage.getItem("answer")).questions.length) != 0){
          location.reload()
        } else {
          this.done = true 
        }
      },
      response => {
        console.log("POST call in error", response);
      }
    );
  }

  redirect() {
    this._router.navigateByUrl('/incident')
  }
}

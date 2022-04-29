import { Component, OnInit } from '@angular/core';
import {Evaluator} from "../evaluator";
import {abs} from "mathjs";
import {Point} from "../point";

@Component({
  selector: 'app-secant',
  templateUrl: './secant.component.html',
  styleUrls: ['./secant.component.scss']
})
export class SecantComponent{

  evaluator !: Evaluator;

  precision = 5;
  tolerance = 0.00001;
  fn = '';
  value = 0;
  x = 0;
  prevX = 0;
  nextX = 0;
  maxIteration = 50;
  relativeError = 1.01;
  prevRelative = 1.01;
  divergeTimes = 10;
  diverge = false;
  runTime = 0;

  prevCoff : Array<number> = [];
  prevCoffSub : Array<number> = [];
  coff : Array<number> = [];
  coffSub : Array<number> = [];
  nextCoff : Array<number> = [];
  nextCoffSub : Array<number> = [];
  relatives : Array<number> = [];

  height!: number;
  width!: number;
  tangents: Point[][] = []


  precisionSelector(e : any){
    // set precision default = 5
    if(!isNaN(Number((e.target as HTMLInputElement).value)) && Number((e.target as HTMLInputElement).value)!=0) {
      this.precision = Number((e.target as HTMLInputElement).value);
    }
    else this.precision = 5;
    console.log("precision= " + this.precision);
  }


  toleranceSelector(e : any){
    // set tolerance default = 0.00001
    if(!isNaN(Number((e.target as HTMLInputElement).value)) && Number((e.target as HTMLInputElement).value) >= 0) {
      this.tolerance = Number((e.target as HTMLInputElement).value) / 100;
    }
    else this.tolerance = 0.00001;
    console.log("tolerance= " + this.tolerance);
  }

  functionSelector(e : any){
    // set function
    this.fn = (e.target as HTMLInputElement).value;
    console.log("fn = " + this.fn);
  }

  guess1Setter(e1 : any){
    // set prevX
    if(!isNaN(Number((e1.target as HTMLInputElement).value))) {
      this.prevX = Number((e1.target as HTMLInputElement).value);
    }
    else this.prevX = 0;
    console.log("prevX= " + this.prevX);
  }

  guess2Setter(e2 : any){
    // set x
    if(!isNaN(Number((e2.target as HTMLInputElement).value))) {
      this.x = Number((e2.target as HTMLInputElement).value);
    }
    else this.x = 0;
    console.log("x= " + this.x);
  }


  secant(){

    let beginTime = new Date().getMilliseconds();

    // reset for new solve
    this.prevCoff = [];
    this.coff = [];
    this.nextCoff = [];
    this.prevCoffSub = [];
    this.coffSub = [];
    this.nextCoffSub = [];
    this.relatives = [];
    this.maxIteration = 50;
    this.relativeError = 1.01;
    this.prevRelative = 1.01;
    this.divergeTimes = 10;
    this.diverge = false;

    // appear canvas and solution iterations when clicking on solve button
    let x = document.getElementById("secantDisplay");
    x!.style.display = 'block';
    let y = <HTMLCanvasElement>document.getElementById("secantCanvas");
    y!.style.display = 'block';
    this.evaluator = new Evaluator(this.fn);

    while(this.maxIteration && this.relativeError > this.tolerance && !this.diverge){
      console.log(this.prevX);

      this.prevRelative = Number((abs((this.x - this.prevX)/this.x)).toPrecision(this.precision));
      this.nextX = Number((this.x - ((this.evaluator.getNumber(this.x) * (this.prevX - this.x)) / (this.evaluator.getNumber(this.prevX) - this.evaluator.getNumber(this.x)))).toPrecision(this.precision));
      this.relativeError = Number((abs((this.nextX - this.x) / this.nextX)).toPrecision(this.precision));
      // check divergence
      if(this.relativeError > this.prevRelative) this.divergeTimes--;
      if(this.divergeTimes == 0) this.diverge = true;

      this.prevCoff.push(this.prevX);
      this.prevCoffSub.push(this.evaluator.getNumber(this.prevX));
      this.coff.push(this.x);
      this.coffSub.push(this.evaluator.getNumber(this.x));
      this.nextCoff.push(this.nextX);
      this.nextCoffSub.push(this.evaluator.getNumber(this.nextX));
      this.relatives.push(this.relativeError * 100);

      this.prevX = this.x;
      this.x = this.nextX;
      this.maxIteration--;
    }

    // reset prevX x nextX if press on solve without changing
    this.prevX = this.prevCoff[0];
    this.x = this.coff[0];
    this.nextX = this.nextCoff[0];

    //plotting function and chords
    this.setTangentsArray();
    this.plot();

    // calculate run time to execute
    let endTime = new Date().getMilliseconds();
    this.runTime = abs(endTime - beginTime);

    console.log("size=" + this.nextCoff.length);
    console.log("begin=" + beginTime);
    console.log("end=" + endTime);

  }


  /// plotting functions
  plot(){
    let canvasArea = <HTMLCanvasElement>document.getElementById("secantCanvas")
    let context = canvasArea.getContext("2d");
    this.height = canvasArea.height;
    this.width = canvasArea.width;
    ///
    context!.clearRect(0, 0, 1500, 1500);
    this.drawAxes();
    context!.strokeStyle = 'blue';
    this.drawCurve(this.fn);
    context!.strokeStyle = 'red'
    this.drawTangents(this.tangents)
  }
  ///the following 4 functions are adjusting the origin point to the center of screen
  adjustXMin(){
    return -20;///arbitrary value
  }
  adjustXMax(){
    return 20;///arbitrary value
  }
  adjustYMin(){
    return this.adjustXMin() * this.height / this.width;///that is tp keep the same ratio
  }
  adjustYMax(){
    return this.adjustXMax() * this.height/ this.width;///that is tp keep the same ratio
  }
  ///we will enter logical coordinates with respect to the adjusted one.
  // so, we need to convert the point from canvas coordinates to that of origin point at the
  //center of screen...
  getAdjustedXcoordinate(x : number) {
    return (x - this.adjustXMin()) * this.width /(this.adjustXMax() - this.adjustXMin());
  }
  getAdjustedYcoordinate(y: number){
    return this.height - (y - this.adjustYMin()) * this.height / (this.adjustYMax() - this.adjustYMin());
  }
  drawAxes(){
    let canvasArea = <HTMLCanvasElement>document.getElementById("secantCanvas")
    let context = canvasArea.getContext("2d");
    let deltaY = 1 ///arbitrary
    let deltaX = 1 ///arbitrary

    context!.save();
    context!.lineWidth = 1;
    context!.strokeStyle = "black";

    ///drawing +ve Y-axis
    context!.beginPath() ;
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0)) ;
    context!.lineTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(this.adjustYMax())) ;
    context!.stroke() ;
    for(let d = deltaY; d < this.adjustYMax(); d += deltaY){
      context!.beginPath() ;
      context!.moveTo(this.getAdjustedXcoordinate(0) + 3 , this.getAdjustedYcoordinate(d))
      context!.lineTo(this.getAdjustedXcoordinate(0) - 3 , this.getAdjustedYcoordinate(d))
      context!.stroke();
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(0), this.getAdjustedYcoordinate(d)+4)
    }

    ///drawing -ve Y-axis
    context!.beginPath() ;
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0)) ;
    context!.lineTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(this.adjustYMin())) ;
    context!.stroke() ;
    for(let d = -deltaY; d >  this.adjustYMin(); d-= deltaY){
      context!.beginPath() ;
      context!.moveTo(this.getAdjustedXcoordinate(0) + 3 , this.getAdjustedYcoordinate(d ))
      context!.lineTo(this.getAdjustedXcoordinate(0) - 3 , this.getAdjustedYcoordinate(d ))
      context!.stroke();
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(0), this.getAdjustedYcoordinate(d)+3)
    }

    ///drawing +ve X-axis
    context!.beginPath() ;
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0)) ;
    context!.lineTo(this.getAdjustedXcoordinate(this.adjustXMax()),this.getAdjustedYcoordinate(0)) ;
    context!.stroke() ;
    for(let d = deltaX; d < this.adjustXMax(); d+= deltaX){
      context!.beginPath();
      context!.moveTo(this.getAdjustedXcoordinate(d )  , this.getAdjustedYcoordinate(0) + 3)
      context!.lineTo(this.getAdjustedXcoordinate(d), this.getAdjustedYcoordinate(0) - 3)
      context!.stroke();
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(d)-5, this.getAdjustedYcoordinate(0)+10)
    }

    ///drawing -ve X-axis
    context!.beginPath() ;
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0)) ;
    context!.lineTo(this.getAdjustedXcoordinate(this.adjustXMin()),this.getAdjustedYcoordinate(0)) ;
    context!.stroke() ;
    for(let d = - deltaX; d > this.adjustXMin(); d-= deltaX){
      context!.beginPath();
      context!.moveTo(this.getAdjustedXcoordinate(d )  , this.getAdjustedYcoordinate(0) + 3)
      context!.lineTo(this.getAdjustedXcoordinate(d ), this.getAdjustedYcoordinate(0) - 3)
      context!.stroke();
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(d)-5, this.getAdjustedYcoordinate(0)+10)
    }
    context!.restore();
  }
  drawCurve(f : string) {
    console.log(f);
    let canvasArea = <HTMLCanvasElement> document.getElementById("secantCanvas")
    let context = canvasArea.getContext("2d");
    let error = 0.01;
    context!.beginPath();
    for (let i = this.adjustXMin(); i < this.adjustXMax(); i += error) {
      let x = i;
      this.evaluator.expression = f;
      this.evaluator.simplfy();
      let y = this.evaluator.getNumber(x);
      // console.log(x+"..."+y);
      if (i != this.adjustXMin())
        context!.lineTo(this.getAdjustedXcoordinate(x), this.getAdjustedYcoordinate(y));
      else context!.moveTo(this.getAdjustedXcoordinate(x), this.getAdjustedYcoordinate(y));
      context!.stroke();
    }
  }

  setTangentsArray() {
    this.tangents = []
    for (let i = 0; i < this.prevCoff.length - 1; i++) {
      let x = this.prevCoff[i]
      // console.log(x)
      let x_plus = this.coff[i]
      // console.log(x_plus)
      let start = new Point(x, this.evaluator.getNumber(x))
      let end = new Point(x_plus, this.evaluator.getNumber(x_plus))
      this.tangents.push([start, end])
      //console.log(this.tangents[i] + "tangent")
    }
  }

  drawTangent(start: Point, end: Point) {
    let canvasArea = <HTMLCanvasElement> document.getElementById("secantCanvas")
    let context = canvasArea.getContext("2d");
    context!.beginPath()
    context!.moveTo(this.getAdjustedXcoordinate(start.x), this.getAdjustedYcoordinate(start.y))
    context!.lineTo(this.getAdjustedXcoordinate(end.x), this.getAdjustedYcoordinate(end.y))
    context!.stroke()
  }

  drawTangents(tangents : Point[][]) {
    for (let i = 0; i < tangents.length; i++) {
      this.drawTangent(tangents[i][0], tangents[i][1])
    }
  }

}


import { Component, OnInit } from '@angular/core';
import {Evaluator} from "../evaluator";

@Component({
  selector: 'app-fixed-point-iteration',
  templateUrl: './fixed-point-iteration.component.html',
  styleUrls: ['./fixed-point-iteration.component.scss']
})
export class FixedPointIterationComponent implements OnInit {
  x: number;
  gxFunction: string = "";
  fxFunction: string = "";
  evaluator: Evaluator;

  error: number;
  maxIterNo: number;
  machineEps: number;
  precision: number;
  soln : Array<any> = [];
  height!: number;
  width!: number;
  noSoln: boolean
  time: number = 0;

  constructor() {
    this.evaluator = new Evaluator("");
    this.error = 100;
    this.x = 0;
    this.maxIterNo = 50;
    this.machineEps = 0.00001;
    this.precision = Math.floor(1 - Math.log10(this.machineEps / 0.5));
    this.noSoln = false;
  }
  ///for receiving the EPS and MAX iteration no.
  setMaxIterNo(iterNoEvent: any){
    this.maxIterNo = parseInt((iterNoEvent.target as HTMLInputElement).value);
    console.log(this.maxIterNo);
  }
  setMachineEps(epsEvent: any){
    this.machineEps = parseFloat((epsEvent.target as HTMLInputElement).value);
    this.precision = Math.floor(1 - Math.log10(this.machineEps / 0.5))
    console.log(this.machineEps);
  }

  ///for receiving the function f(x)
  receiveFunc(eqnEvent : any){
    this.fxFunction = (eqnEvent.target as HTMLInputElement).value;
    console.log(this.fxFunction);
  }

  ///for receiving the initial guess
  setInitialGuess(guessEvent: any){
    this.x = parseFloat((guessEvent.target as HTMLInputElement).value);
    console.log(this.x);
  }

  ///reformulation of f(x) into x = g(x) where g(x) cause soln to converge
  reformulate(){
    this.time = new Date().getMilliseconds();
    this.evaluator.expression = this.fxFunction;
    this.evaluator.simplfy();
    this.gxFunction = this.evaluator.extraG(this.x);
    if(this.evaluator.extraG(this.x) == "not") this.noSoln = true;
    console.log(this.gxFunction);
  }

  ///applying the iterative Fixed Point Iteration
  fixedPointIter(){
    for (let i = 0; i < this.maxIterNo && this.error>= this.machineEps; i++) {

      this.evaluator.expression = this.gxFunction;
      this.evaluator.simplfy();
      let x = (this.evaluator.getNumber(this.x).toPrecision(this.precision)) as unknown as number;
      this.error = Math.abs((x - this.x) / x).toPrecision(this.precision) as unknown as number;
      this.x = x;


      this.soln.push([this.x, this.error]);
      if(!isFinite(this.error)){
        this.noSoln =true;
        break;
      }
      this.evaluator.expression = this.fxFunction;
      if(this.evaluator.getNumber(x) == 0){
        this.noSoln =false;
        break;
      }

    }
    console.log(this.soln);
    if(!this.noSoln){
      let solnArea = document.getElementById("solnFPI");
      solnArea!.style.visibility = "visible";
    }
    console.log(this.x +"......" + this.error);
    this.time = new Date().getMilliseconds() - this.time;
  }

  ///to plot the required functions
  plot(){
    let canvasArea = <HTMLCanvasElement>document.getElementById("plot")
    canvasArea.style.visibility = "visible";
    let context = canvasArea.getContext("2d");
    this.height = canvasArea.height;
    this.width = canvasArea.width;
    context!.clearRect(0, 0, 400, 300);
    this.drawAxes();
    context!.strokeStyle = 'red';
    this.drawCurve(this.fxFunction);
    context!.strokeStyle = 'blue';
    this.drawCurve("x");
    context!.strokeStyle = 'green';
    this.drawCurve(this.gxFunction)
  }
  ///the following 4 functions are adjusting the origin point to the center of screen
  adjustXMin(){
    return -10;///arbitrary value
  }
  adjustXMax(){
    return 10;///arbitrary value
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
    let canvasArea = <HTMLCanvasElement>document.getElementById("plot")
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
    let canvasArea = <HTMLCanvasElement> document.getElementById("plot")
    let context = canvasArea.getContext("2d");
    let error = 0.01;
    context!.beginPath();
    for (let i = this.adjustXMin(); i < this.adjustXMax(); i += error) {
      let x = i;
      this.evaluator.expression = f;
      this.evaluator.simplfy();
      let y = this.evaluator.getNumber(x);
      console.log(x+"..."+y);
      if (i != this.adjustXMin())
        context!.lineTo(this.getAdjustedXcoordinate(x), this.getAdjustedYcoordinate(y));
      else context!.moveTo(this.getAdjustedXcoordinate(x), this.getAdjustedYcoordinate(y));
      context!.stroke();
    }
  }

  ngOnInit(): void {
  }




}

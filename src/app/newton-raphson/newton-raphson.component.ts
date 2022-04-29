import { Component, OnInit } from '@angular/core';
import {Evaluator} from "../evaluator";
import {Point} from "../point";

@Component({
  selector: 'app-newton-raphson',
  templateUrl: './newton-raphson.component.html',
  styleUrls: ['./newton-raphson.component.scss']
})
export class NewtonRaphsonComponent implements OnInit {

  ngOnInit(): void {
  }

  evaluator!: Evaluator
  fn!: string
  initialGuess = 1   //assume that the default initial guess is 1 and will work on this value if the user do not enter initial guess
  noOfIter = -1
  tolValue = 0.00001    //default epsilon value is 10^-4
  precision = 5         //default precision is 5
  solutionArray!:any
  algorithmTime = 0


  height!: number;
  width!: number;
  tangents: Point[][] = []

  constructor() {

  }

  implementNewtonMethod(fn: string, initialGuess: number, noOfIterations: number, epsilon: number, precision: number) {
    let x_i = initialGuess
    let maxIterations = 50  //the max no of iterations is set to 50 iterations in case the method couldn't converge and satisfy the relative error
    let relativeError = epsilon
    let solutionsArray = new Array<number>()
    solutionsArray.push(initialGuess)

    //assume that if the user works on epsilon flag of noOfIterations will be -1

    if(noOfIterations != -1) {
      for (let i = 1; i <=  noOfIterations; i++) {
        if(this.evaluator.getDervativeNumber(x_i) == 0)
          break;
        x_i = x_i - this.evaluator.getNumber(x_i) / this.evaluator.getDervativeNumber(x_i)
        x_i = Number(x_i.toPrecision(precision))
        solutionsArray.push(x_i)
        console.log(x_i)
      }
    }
    else {
      let counter = 0
      while (relativeError >= epsilon) {
        if(this.evaluator.getDervativeNumber(x_i) == 0)
          break;
        x_i = x_i - this.evaluator.getNumber(x_i) / this.evaluator.getDervativeNumber(x_i)
        x_i = Number(x_i.toPrecision(precision))
        solutionsArray.push(x_i)
        relativeError = Math.abs((solutionsArray[counter + 1] - solutionsArray[counter]) / solutionsArray[counter + 1]) * 100
        if (counter == maxIterations)
          break;
        console.log(x_i)
        counter++;
      }
    }
    return solutionsArray
  }


  setFn(e: any) {
    this.fn = (e.target as HTMLInputElement).value
  }

  setInitialGuess(e: any) {
      this.initialGuess = Number((e.target as HTMLInputElement).value)
      if(this.initialGuess == 0)
        this.initialGuess = 1
  }

  setIter(e: any) {
    this.noOfIter = Number((e.target as HTMLInputElement).value)
    if(this.noOfIter == 0)
      this.noOfIter = -1
    console.log('No of iterations: '+ this.noOfIter)
  }

  setTolValue(e: any) {
    this.tolValue = Number((e.target as HTMLInputElement).value)
    if(this.tolValue == 0)
      this.tolValue = 0.00001
    console.log('Tolerance value: '+ this.tolValue)
  }

  setPrecision(e: any) {
    this.precision = Number((e.target as HTMLInputElement).value)
    if(this.precision == 0)
      this.precision = 5
    console.log('Precision: '+ this.precision)
  }

  solveEqn() {
      this.evaluator = new Evaluator(this.fn)
      this.algorithmTime = new Date().getMilliseconds();
      this.solutionArray = this.implementNewtonMethod(this.fn, this.initialGuess, this.noOfIter, this.tolValue, this.precision)
      this.algorithmTime = new Date().getMilliseconds() - this.algorithmTime
      console.log(this.solutionArray)
      this.setTangentsArray()
      this.plot()
  }

  getAlgorithmTime() {
      let timeStamp = document.getElementById("algorithmTime")
      timeStamp!.style.display = 'block'
      return this.algorithmTime
  }

  plot(){
    let canvasArea = <HTMLCanvasElement>document.getElementById("canvasNewton")
    let context = canvasArea.getContext("2d");
    this.height = canvasArea.height;
    this.width = canvasArea.width;
    context!.clearRect(0, 0, 400, 300);
    this.drawAxes();
    context!.strokeStyle = 'blue';
    this.drawCurve(this.fn);
    context!.strokeStyle = 'red'
    this.drawTangents(this.tangents)
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
    let canvasArea = <HTMLCanvasElement>document.getElementById("canvasNewton")
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
    let canvasArea = <HTMLCanvasElement> document.getElementById("canvasNewton")
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
    for (let i = 0; i < this.solutionArray.length - 1; i++) {
      let x = this.solutionArray[i]
      // console.log(x)
      let x_plus = this.solutionArray[i + 1]
      // console.log(x_plus)
      let start = new Point(x, this.evaluator.getNumber(x))
      let end = new Point(x_plus, 0)
      this.tangents.push([start, end])
      console.log(this.tangents[i] + "tangent")
    }
  }

  drawTangent(start: Point, end: Point) {
    let canvasArea = <HTMLCanvasElement> document.getElementById("canvasNewton")
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

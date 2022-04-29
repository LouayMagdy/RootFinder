import { Component, OnInit } from '@angular/core';
import {Evaluator} from "../evaluator";
import {Point} from "../point";

@Component({
  selector: 'app-false-position',
  templateUrl: './false-position.component.html',
  styleUrls: ['./false-position.component.scss']
})
export class FalsePositionComponent implements OnInit {

  constructor() {
    this.maxIterations = 50                     // DEFAULT VALUE
    this.tolerance = Math.pow(10, -5)           // DEFAULT VALUE
    this.xL = NaN
    this.xU = NaN
    this.xR = NaN
    this.xRs = new Array()
    this.xLs = new Array()
    this.xUs = new Array()
    this.error = new Array()
  }

  evaluator = new Evaluator('')
  precision?: number
  maxIterations: number
  tolerance: number
  xL: number
  xU: number
  xR: number
  xRs: number[]                                 // ARRAY TO HOLD VALUES OF X ROOT FOR ERROR AND TOLERANCE CHECK
  xLs: number[]                                 // ``````````````````````` X LOWER ````````````````````````````
  xUs: number[]                                 // ``````````````````````` X UPPER ````````````````````````````
  error: number[]
  solution = new Array()

  requirements = [0, 0]                         // INDICATOR OF SETTING REQUIRED PARAMETERS
  solved = false                                // TO PREVENT MALICIOUS USERS FROM BREAKING THE PROGRAM USING SOLVE BUTTON

  height!: number
  width!: number
  tangents: Point[][] = []

  timeTaken!: any                               // TOTAL TIME TAKEN BY THE ALGORITHM TO SOLVE

  setRequirements() {
    this.setFunction()                          // THE FUNCTION OF X WILL BE STORED INSIDE EVALUATOR.TS
    this.setInitGuess()
    this.setPrecision()
    this.setIterations()
    this.setTolerance()
  }

  // REQUIREMENTS TO BE SET
  setFunction() {
    this.evaluator.expression = (document.getElementById('function') as HTMLInputElement).value
    this.evaluator.simplfy()
    if(this.evaluator.expression.length > 0) {
      this.requirements[0] = 1
    } else {
      this.requirements[0] = 0
    }
  }
  setInitGuess() {
    this.xL = parseFloat((document.getElementById('x lower') as HTMLInputElement).value)
    this.xU = parseFloat((document.getElementById('x upper') as HTMLInputElement).value)
    if(this.xL.toString() == 'NaN' || this.xU.toString() == 'NaN') {
      this.requirements[1] = 0
    } else {
      this.requirements[1] = 1
    }
  }
  setPrecision() {
    let precision = document.getElementById('precision') as HTMLInputElement
    let precisionValue = precision.value as string
    if(precisionValue.length < 1) {
      //DO NOTHING
    } else {
      this.precision = parseInt(precisionValue)
    }
  }
  setIterations() {
    let iterations = document.getElementById('iterations') as HTMLInputElement
    let iterationsValue = iterations.value as string
    if(iterationsValue.length < 1) {
      //DO NOTHING
    } else {
      this.maxIterations = parseInt(iterationsValue)
    }
  }
  setTolerance() {
    let tolerance = document.getElementById('tolerance') as HTMLInputElement
    let toleranceValue = tolerance.value as string
    if(toleranceValue.length < 1) {
      //DO NOTHING
    } else {
      this.tolerance = parseFloat(toleranceValue)
    }
  }

  // ALGORITHM PROCESSING
  algorithm() {
    let startTime = Date.now()                                // SETTING START TIME UPON FUNCTION INVOKE

    // VALIDATING REQUIREMENTS (PROTECTION AGAINST MALICIOUS USERS)
    if(this.requirements[0] + this.requirements[1] > 1) {
      // IF SATISFIED --> EXECUTE
      this.solution.push('__________________________________________________')
      this.solution.push('Checking if the initial guesses would converge to a root or not by evaluating f(x lower) * f(x upper):')

      if(this.initChecker()) {
        this.solution.push('Initial guesses would not converge to a root.')
        this.solved = true
        this.timeTaken = Date.now() - startTime                  // EVALUATING TOTAL TIME TAKEN ONCE FINISHED
        return
      } else {
        this.solution.push('Initial guesses would converge to a root.')
      }

      // EXECUTING THE ALGORITHM AFTER CHECKING INITIAL GUESSES CONVERGENCE
      for(let iteration = 1; iteration <= this.maxIterations; iteration++) {

        // ADD XU, XL, AND XR TO THEIR STORAGE AT THE BEGINNING OF EACH LOOP
        this.addxLs(), this.addxUs(), this.setXn(), this.addxRs()

        this.solution.push('__________________________________________________')
        this.solution.push('Setting x root for iteration #' + iteration + ': x root = (xl + xu) / 2 = ' + this.xR)
        this.solution.push('Checking whether f(x lower) * f(x root) is positive, negative, or zero:')

        if(this.signChecker()) {
          this.xL = this.xR
          this.solution.push('Evaluation returned +. Setting x root to be the new x lower. x lower = ' + this.xR)
        } else {
          this.xU = this.xR
          this.solution.push('Evaluation returned -. Setting x root to be the new x upper. x upper = ' + this.xR)
        }

        // SETTING ERROR AND CHECKING THE TOLERANCE CONVERGENCE
        if(iteration > 1) {
          this.setError(iteration)
          if(this.checkTolerance(iteration)) {
            this.solution.push('Tolerance satisfied. ROOT FOUND! x root = ' + this.xR)
            this.solved = true
            this.timeTaken = Date.now() - startTime   // EVALUATE TOTAL TIME TAKEN BY THE PROCESS
            return
          }
        }
      } // END OF FOR LOOP
      this.solution.push('Max iterations consumed. ROOT FOUND! x root = ' + this.xR)
      this.solved = true
    } else {
      // IF REQUIREMENTS ARE NOT SATISFIED
      alert("MISSING PARAMETERS")
    }
    this.timeTaken = Date.now() - startTime           // EVALUATE TOTAL TIME TAKEN BY THE PROCESS
  }   // END OF ALGORITHM FUNCTION

  // CHECKING CONVERGENCE OF INITIAL GUESSES
  initChecker() {
    let sign = this.evaluator.getNumber(this.xL) * this.evaluator.getNumber(this.xU)
    return sign > 0
  }   // END OF INITCHECKER()

  // SETTING X ROOT OF ITERATION #N
  setXn() {
    let numerator = this.xL * this.evaluator.getNumber(this.xU) - this.xU * this.evaluator.getNumber(this.xL)
    let denominator = this.evaluator.getNumber(this.xU) - this.evaluator.getNumber(this.xL)
    this.xR = numerator / denominator
  }   // END OF SETXN()

  // ADDING XR, XL, AND XU TO THEIR STORAGE
  addxRs() {
    this.xRs.push(this.xR)
  }
  addxLs() {
    this.xLs.push(this.xL)
  }
  addxUs() {
    this.xUs.push(this.xU)
  }

  // CHECKING THE SIGN OF F(XL) AND F(XR)
  signChecker() {
    let sign = this.evaluator.getNumber(this.xL) * this.evaluator.getNumber(this.xR)
    return sign >= 0
  }   // END OF SIGNCHECKER()

  // SETTING ERROR AND ADDING IT TO ITS STORAGE
  setError(iteration: number) {
    iteration--
    let error = Math.abs(((this.xRs[iteration] - this.xRs[iteration - 1]) / this.xRs[iteration])).toPrecision(this.precision)
    this.error.push(parseFloat(error) * 100)
    this.solution.push('Evaluating error at iteration #' + (iteration + 1))
    this.solution.push('Relative Error = ' + this.error[iteration - 1] + '%')
  }   // END OF SETERROR(ITERATION: NUMBER)

  // CHECKING TOLERANCE CONVERGENCE
  checkTolerance(iteration: number) {
    iteration--
    return Math.abs(this.xRs[iteration] - this.xRs[iteration - 1]) <= this.tolerance
  }   // END OF CHECKTOLERANCE()

  // PLOTTING PROCESS
  plot(){
    let canvasArea = document.getElementById("canvasFalse-Position") as HTMLCanvasElement
    canvasArea.setAttribute('style', 'display: auto;')
    let context = canvasArea.getContext("2d")
    this.height = canvasArea.height
    this.width = canvasArea.width
    context!.clearRect(0, 0, 400, 300)
    this.drawAxes()
    context!.strokeStyle = 'blue'
    this.drawCurve()
    context!.strokeStyle = 'green'
    for(let index = 0; index < this.xLs.length; index++) {
      this.drawLine(this.xLs[index], this.xUs[index])
    }
  }
  // ADJUSTING THE ORIGIN POINT
  adjustXMin() {
    return -10
  }
  adjustXMax() {
    return 10
  }
  adjustYMin() {
    return this.adjustXMin() * this.height / this.width
  }
  adjustYMax() {
    return this.adjustXMax() * this.height/ this.width
  }
  // ADJUSTING (X, Y) COORDINATES
  getAdjustedXcoordinate(x : number) {
    return (x - this.adjustXMin()) * this.width /(this.adjustXMax() - this.adjustXMin())
  }
  getAdjustedYcoordinate(y: number) {
    return this.height - (y - this.adjustYMin()) * this.height / (this.adjustYMax() - this.adjustYMin())
  }
  // DRAWING AXES AND FUNCTION
  drawAxes(){
    let canvasArea = document.getElementById("canvasFalse-Position") as HTMLCanvasElement
    let context = canvasArea.getContext("2d")
    let deltaY = 1
    let deltaX = 1

    context!.save()
    context!.lineWidth = 1
    context!.strokeStyle = "black"

    ///drawing +ve Y-axis
    context!.beginPath()
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0))
    context!.lineTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(this.adjustYMax()))
    context!.stroke() ;
    for(let d = deltaY; d < this.adjustYMax(); d += deltaY){
      context!.beginPath()
      context!.moveTo(this.getAdjustedXcoordinate(0) + 3 , this.getAdjustedYcoordinate(d))
      context!.lineTo(this.getAdjustedXcoordinate(0) - 3 , this.getAdjustedYcoordinate(d))
      context!.stroke()
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(0), this.getAdjustedYcoordinate(d)+4)
    }

    ///drawing -ve Y-axis
    context!.beginPath()
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0))
    context!.lineTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(this.adjustYMin()))
    context!.stroke()
    for(let d = -deltaY; d >  this.adjustYMin(); d-= deltaY){
      context!.beginPath()
      context!.moveTo(this.getAdjustedXcoordinate(0) + 3 , this.getAdjustedYcoordinate(d))
      context!.lineTo(this.getAdjustedXcoordinate(0) - 3 , this.getAdjustedYcoordinate(d))
      context!.stroke()
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(0), this.getAdjustedYcoordinate(d)+3)
    }

    ///drawing +ve X-axis
    context!.beginPath()
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0))
    context!.lineTo(this.getAdjustedXcoordinate(this.adjustXMax()),this.getAdjustedYcoordinate(0))
    context!.stroke()
    for(let d = deltaX; d < this.adjustXMax(); d+= deltaX){
      context!.beginPath()
      context!.moveTo(this.getAdjustedXcoordinate(d )  , this.getAdjustedYcoordinate(0) + 3)
      context!.lineTo(this.getAdjustedXcoordinate(d), this.getAdjustedYcoordinate(0) - 3)
      context!.stroke()
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(d)-5, this.getAdjustedYcoordinate(0)+10)
    }

    ///drawing -ve X-axis
    context!.beginPath()
    context!.moveTo(this.getAdjustedXcoordinate(0),this.getAdjustedYcoordinate(0))
    context!.lineTo(this.getAdjustedXcoordinate(this.adjustXMin()),this.getAdjustedYcoordinate(0))
    context!.stroke()
    for(let d = - deltaX; d > this.adjustXMin(); d-= deltaX){
      context!.beginPath()
      context!.moveTo(this.getAdjustedXcoordinate(d )  , this.getAdjustedYcoordinate(0) + 3)
      context!.lineTo(this.getAdjustedXcoordinate(d ), this.getAdjustedYcoordinate(0) - 3)
      context!.stroke()
      context!.fillText(" " + d.toString(), this.getAdjustedXcoordinate(d)-5, this.getAdjustedYcoordinate(0)+10)
    }
    context!.restore()
  }
  drawCurve() {
    let canvasArea = document.getElementById("canvasFalse-Position") as HTMLCanvasElement
    let context = canvasArea.getContext("2d")
    let error = 0.01
    context!.beginPath()
    for (let i = this.adjustXMin(); i < this.adjustXMax(); i += error) {
      let y = this.evaluator.getNumber(i)
      if (i != this.adjustXMin())
        context!.lineTo(this.getAdjustedXcoordinate(i), this.getAdjustedYcoordinate(y))
      else context!.moveTo(this.getAdjustedXcoordinate(i), this.getAdjustedYcoordinate(y))
      context!.stroke()
    }
  }
  // DRAWING X ROOTS
  getRandomColor():string{
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","  +  Math.floor(Math.random() * 255) + ")"
  }
  // DRAWING A LINE BETWEEN 2 KNOWN POINTS XL AND XU
  drawLine(x1:number, x2:number){
    let canvasArea = document.getElementById("canvasFalse-Position") as HTMLCanvasElement
    let context = canvasArea.getContext("2d")
    context!.beginPath()
    context!.strokeStyle = this.getRandomColor()
    context!.lineWidth = 1
    let y1=this.evaluator.getNumber(x1)
    let y2=this.evaluator.getNumber(x2)
    let lineEq=((y1-y2)/(x1-x2))+'*(x'+'+'+-1*x1+')'+'+'+y1
    let line = this.getStAndEnd(x1, x2, lineEq)
    context!.moveTo(this.getAdjustedXcoordinate(line[0]),this.getAdjustedYcoordinate(line[2]))
    context!.lineTo(this.getAdjustedXcoordinate(line[1]),this.getAdjustedYcoordinate(line[3]))
    context!.stroke()
    console.log(x1.toString() + ', ' + x2.toString())
  }
  getStAndEnd(x1:number, x2:number, line:string): number[] {
    if(x1 > 0){
      while(
        x1 > this.adjustXMax()
        || this.evaluator.getNumberToSpecific(x1, line) > this.adjustYMax()
        || this.evaluator.getNumberToSpecific(x1, line) < this.adjustYMin()
        ) {
        x1=x1-0.001
        if(x1 < this.adjustYMin()) {
          break
        }
      }
    } else {
      while(
        x1 < this.adjustXMin()
        || this.evaluator.getNumberToSpecific(x1, line) > this.adjustYMax()
        || this.evaluator.getNumberToSpecific(x1, line) < this.adjustYMin()
        ) {
        x1=x1+0.001
        if(x1 > this.adjustYMax())
          break
      }
    }

    if(x2 > 0){
      while(
        x2 > this.adjustXMax()
        || this.evaluator.getNumberToSpecific(x2, line) > this.adjustYMax()
        || this.evaluator.getNumberToSpecific(x2, line) < this.adjustYMin()
        ) {
        x2=x2-0.001
        if(x2 < this.adjustYMin()){
          break
        }
      }
    } else {
      while(
        x2 < this.adjustXMin()
        || this.evaluator.getNumberToSpecific(x2, line) > this.adjustYMax()
        || this.evaluator.getNumberToSpecific(x2, line) < this.adjustYMin()
        ) {
        x2=x2+0.001
        if(x2 > this.adjustYMax())
          break
      }
    }
    return [x1, x2, this.evaluator.getNumberToSpecific(x1, line), this.evaluator.getNumberToSpecific(x2, line)]
  }

  ngOnInit(): void {
  }

}

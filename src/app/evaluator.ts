import * as math from "mathjs";
import { derivative, evaluate } from "mathjs";

export class Evaluator{
  MyMap= new Map<string,string[]>();
  expression=''
  constructor(exp:string){this.expression=exp}
  clear(exp:string){//to clear all function and handle exciption
    while(exp.includes('--')||exp.includes('+-+-')||exp.includes('++')||exp.includes('+-+')){
      exp= exp.split('--').join('')
      exp= exp.split('+-+-').join('+-')
      exp= exp.split('++').join('+')
      exp= exp.split('+-+').join('+-')
    }     console.log(exp)
    return exp
  }
  simplfy(){//to clear all input and handel different casses
    let arr=this.expression.split('=')
    if((arr[0]==='f(x)'||arr[0]==='f')&&arr[1]!=undefined){
      this.expression=arr[1].split('-').join('+-')
      this.expression=this.clear(this.expression)
      return
    }//handel if expression isn't have equal siqn
    if(arr[1]==undefined||arr[1]==''){
      this.expression=this.clear(this.expression)
      console.log(this.expression)
    }
    else if(arr[1]!='0'){//handel if expression polynpmial after equal siqn
      console.log(this.expression)
      this.expression=arr[0].split('-').join('+-')+'+-'+'('+arr[1]+')'
      this.expression=this.clear(this.expression)
      console.log(this.expression)
    }
    else{
      console.log(this.expression)
      this.expression=arr[0].split('-').join('+-')
      console.log(this.expression)
      this.expression=this.clear(this.expression)
      console.log(this.expression)
    }
  }
  getNumber(x:number):number{//function to get f(x) under certian x
    let st=this.expression.split('exp').join("not")
    st=st.split('x').join('('+x+')')
    st=st.split('not').join("exp")

    console.log(st)
    return evaluate(st);
  }
  getNumberToSpecific(x:number,func:string):number{//function to get f(x) under certian x to given function  using mathjs
    let st=func.split('exp').join("not")
    st=st.split('x').join('('+x+')')
    st=st.split('not').join("exp")

    console.log(st)
    return evaluate(st);
  }
  getDervativeNumber(x:number):number{// get the dervative  of exprission under certian x using mathjs
    let st=math.derivative(this.expression,'x').toString()
    console.log(st)
    st=st.split('exp').join("not")
    st=st.split('x').join('('+x+')')
    st=st.split('not').join("exp")
    console.log("==============")
    console.log(st)
    return evaluate(st);
  }
  getDervativeToFn(x:number,expression:string):number{// get the dervative  of given under certian x using mathjs
    let st=math.derivative(expression,'x').toString()
    console.log(st)
    //replace exp with oter string because x in exp will make program confusing
    st=st.split('exp').join("not")
    st=st.split('x').join('('+x+')')
    //retuern the exp in it's place
    st=st.split('not').join("exp")
    console.log("==============")
    console.log(st)
    return evaluate(st);
  }

  getReadyForSplit(x:string):string{//to get ready for split by replacing any + not in () by replacing it with sp
    let set=0
    x=x.split('-').join('+-')
    let temp=this.clear(x)

    for(let i=0;i<temp.length;i++){
      console.log(i)
      if("(".charCodeAt(0)==temp.charCodeAt(i)){
        set=set+1;

      }
      if(")".charCodeAt(0)==temp.charCodeAt(i)){
        set=set-1
      }
      if("+".charCodeAt(0)==temp.charCodeAt(i)&&set==0){
        temp=temp.substring(0,i)+'sp'+temp.substring(i+1,temp.length);
        // i=0
      }

    }
    console.log(temp)
    return temp;
  }
  getG(intialG:number):string{//that function will see if ther any existance x or x raised to any power without
    //cofficent
    let arr=this.getReadyForSplit(this.expression).split("sp")
    console.log(arr)
    let totlaGx=[]
    //that loop will get all expression to given term
    for(let i=0;i<arr.length;i++){
      let exp=''
      for(let j=0;j<arr.length;j++){
        if(i==j){
          continue;
        }
        if(exp==''){
          exp=exp+arr[j];
        }else{
          exp=exp+'+'+arr[j]
        }
      }
      if(exp!=''){
        totlaGx.push("-("+exp+')')
      }
      else{
        //if expression has no terms on it
        arr.splice(i)
      }

    }
    console.log(arr)
    //loop to clear arr and lastG if they have exp or sin or cos
    for(let i=0;i<arr.length;i++){
      console.log(arr[i])
      console.log(totlaGx[i])

      if(arr[i].includes('sin')||arr[i].includes('cos')||arr[i].includes('exp')||arr[i]===''){
        arr.splice(i)
        totlaGx.splice(i)
        i=0
      }
    }
    console.log(arr)
    let last=[]
    //loop and get every possible x to be g(x)
    for(let i=0;i<arr.length;i++){
      console.log(arr[i])
      if(math.simplify(arr[i], {}, {exactFractions: false}).toString()==='x'){
        last.push(totlaGx[i])
      }
      else if(math.simplify(arr[i], {}, {exactFractions: false}).toString().indexOf("x ^")==0){
        let pow =(arr[i].split("^"))[1]
        pow="(1/"+pow+')'
        last.push('('+totlaGx[i]+")^"+pow)
        this.add('x',last[i])
      }
    }
    //to check if any g(x) that founded will be converge
    console.log(last)
    for(let i=0;i<last.length;i++){
      let n=this.getDervativeToFn(intialG,last[i])
      console.log(n)
      if(Math.abs(n)<1){
        console.log("done")
        return last[i]
      }
    }        console.log(last)
    console.log(arr)
    console.log(totlaGx)
    return 'not'
  }
  //function to add cofficient to key
  public add(key:string, value:string){
    let arr:string[];
    if(!this.MyMap.has(key)){
      this.MyMap.set(key,[value]);
    }
    else(
      this.MyMap.get(key)?.push(value)
    )
  }
  extraG(intial:number){//that function work only if the first function return not it will generate g using form
    //g=a(f(x))+x and a is close number
    let st=this.getG(intial)
    if(st==='not'){
      let maxit=50;
      let x= 'a*('+this.expression+')'+"+x"
      while(maxit--){//that loop will generate random a and check if function will converge or not
        let a=(Math.random() * .5)+.1
        x=x.split('a').join(""+a)
        console.log(a)
        if(this.getDervativeToFn(intial,x)<1){
          console.log(x)
          return x;
        }
        x=x.split(''+a).join('a')
        console.log(x)
      }
      x='-a*('+this.expression+')'+"+x"
      maxit=50
      while(maxit--){
        let a=(Math.random() * .5)+.01
        x=x.split('a').join(""+a)
        console.log(a)
        if(this.getDervativeToFn(intial,x)<1){
          console.log(x)
          return x;
        }
        x=x.split(''+a).join('a')
        console.log(x)
      }
    }
    else{
      return st;
    }
    //if that also didn't divarge then return not
    return 'not'
  }
}

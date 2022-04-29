import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NewtonRaphsonComponent} from "./newton-raphson/newton-raphson.component";
import {BisectionComponent} from "./bisection/bisection.component";
import {FalsePositionComponent} from "./false-position/false-position.component";
import {FixedPointIterationComponent} from "./fixed-point-iteration/fixed-point-iteration.component";
import {SecantComponent} from "./secant/secant.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'bisection', component: BisectionComponent},
  {path: 'false-position', component: FalsePositionComponent},
  {path: 'fixed-point-iteration', component: FixedPointIterationComponent},
  {path: 'newton-raphson', component: NewtonRaphsonComponent},
  {path: 'secant', component: SecantComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

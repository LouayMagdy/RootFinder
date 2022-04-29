import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewtonRaphsonComponent } from './newton-raphson/newton-raphson.component';
import { HomeComponent } from './home/home.component';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import { BisectionComponent } from './bisection/bisection.component';
import { FalsePositionComponent } from './false-position/false-position.component';
import { FixedPointIterationComponent } from './fixed-point-iteration/fixed-point-iteration.component';
import { SecantComponent } from './secant/secant.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    NewtonRaphsonComponent,
    HomeComponent,
    BisectionComponent,
    FalsePositionComponent,
    FixedPointIterationComponent,
    SecantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

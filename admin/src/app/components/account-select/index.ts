import {AccountSelectComponent} from "./account-select.component";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccountSelectComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSelectModule
  ],
  exports: [
    AccountSelectComponent
  ]
})

export class AccountSelectModule {}

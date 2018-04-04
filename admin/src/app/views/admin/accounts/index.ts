import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AccountsViewComponent } from "./accounts-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccountsTableModule} from "../../../components/accounts-table";
import {AccountViewModule} from "./account";

@NgModule({
  declarations: [
    AccountsViewComponent
  ],
  imports: [
    BrowserModule,
    RemarkDirectivesModule,
    RouterModule,
    FormsModule,
    BrowserAnimationsModule,
    AccountsTableModule,
    AccountViewModule
  ],
  exports: [
    AccountsViewComponent
  ]
})

export class AccountsViewModule {}

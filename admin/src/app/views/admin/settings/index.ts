import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SettingsViewComponent } from "./settings-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import {AccountSelectModule} from "../../../components/account-select/index";
import {AccountsTableModule} from "../../../components/accounts-table";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      SettingsViewComponent
    ],
    imports: [
      BrowserModule,
      RemarkDirectivesModule,
      RouterModule,
      AccountSelectModule,
      AccountsTableModule,
      FormsModule,
      ReactiveFormsModule
    ],
    exports: [
      SettingsViewComponent
    ]
})

export class SettingsViewModule {}

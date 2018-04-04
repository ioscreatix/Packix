import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { GroupViewComponent } from "./group-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import {AccountSelectModule} from "../../../components/account-select/index";
import {AccountsTableModule} from "../../../components/accounts-table";

@NgModule({
    declarations: [
      GroupViewComponent
    ],
    imports: [
      BrowserModule,
      RemarkDirectivesModule,
      RouterModule,
      AccountSelectModule,
      AccountsTableModule
    ],
    exports: [
      GroupViewComponent
    ]
})

export class GroupViewModule {}

import {NgModule} from "@angular/core";
import { FormsModule }   from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {PackagesViewModule} from "./packages/index";
import {PackageViewModule} from "./package/index";
import {GroupsViewModule} from "./groups/index";
import {GroupViewModule} from "./group/index";
import {AccountsViewModule} from "./accounts";
import {SettingsViewModule} from "./settings";

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PackagesViewModule,
    PackageViewModule,
    GroupsViewModule,
    GroupViewModule,
    AccountsViewModule,
    SettingsViewModule
  ],
  exports: [
  ],
})

export class AdminDashboardViewsModule {
}

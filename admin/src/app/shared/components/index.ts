import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {PatreonRewardSelectComponent} from "./patreon-reward-select.component";
import {RemarkDirectivesModule} from "../../helpers/directives/index";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PatreonRewardSelectComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RemarkDirectivesModule,
    FormsModule
  ],
  exports: [
   PatreonRewardSelectComponent
  ]
})

export class SharedComponentsModule {}

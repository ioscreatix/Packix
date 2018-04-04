import {AfterViewInit, Component} from '@angular/core';
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {AccountApi} from "../../../shared/sdk/services/custom/Account";

declare var jQuery:any;

@Component({
  selector: 'basic',
  templateUrl: 'dashboardLayout.template.html'
})
export class DashboardLayoutComponent implements AfterViewInit {

  // public ngOnInit():any {
  //   detectBody();
  // }
  //
  // public onResize(){
  //   detectBody();
  // }

  public profilePhotoURL:string = '';
  public profileDisplayName:string = '';

  constructor(private accountApi: AccountApi) {
    RemarkPlugin.register('scrollable', ScrollablePlugin);
    this.accountApi.getMe().subscribe((profile : any) => {
      this.profilePhotoURL = profile['profilePhoto'];
      this.profileDisplayName = profile['profileName'];
    });
  }

  ngAfterViewInit() {
    //RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

}

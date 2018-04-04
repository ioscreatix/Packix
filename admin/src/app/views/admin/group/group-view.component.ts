import {AfterViewInit, Component, OnDestroy, Directive, ViewChild} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {PackageApi} from "../../../shared/sdk/services/custom/Package";
import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
import {LoopBackConfig} from "../../../shared/sdk/lb.config";
import {Account} from "../../../shared/sdk/models/Account";
import {PackageFile} from "../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {AccountGroupApi} from "../../../shared/sdk/services/custom/AccountGroup";
import {AccountGroup} from "../../../shared/sdk/models/AccountGroup";
import {ActivatedRoute} from "@angular/router";
import {AccountSelectComponent} from "../../../components/account-select/account-select.component";
import {AccountGroupLinkApi} from "../../../shared/sdk/services/custom/AccountGroupLink";

@Component({
    selector: 'group-view',
    templateUrl: 'group-view.template.html'
})

export class GroupViewComponent implements AfterViewInit, OnDestroy{

  public group: AccountGroup;
  public groupId: string;
  public accounts: Account[] = [];

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private groupsAPI: AccountGroupApi,
    private route: ActivatedRoute,
    private accountGroupLinkApi: AccountGroupLinkApi
  ) {
    this.route.params.subscribe(params => {
      this.groupId = params['id'];
      console.log(this.groupId);
      this.loadGroupData();
    });
  }

  loadGroupData() {
    this.groupsAPI.findById(this.groupId, {
      include: ['accounts']
    }).subscribe((groupObject : AccountGroup) => {
      this.group = groupObject;
      this.accounts = this.group.accounts || [];
    });
  }

  addAccountToGroup() {

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      for (let account of this.group.accounts) {
        if (account.id === accountId) return;
      }
      this.accountGroupLinkApi.create({
        accountId: accountId,
        accountGroupId: this.groupId
      }).subscribe((data: any) => {
        this.loadGroupData();
        this.accountSelect.selectedAccount = null;
      })
    }
    console.log(this.accountSelect.selectedAccount);
  }

  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
    jQuery('body').addClass('app-packages');
   // console.log("test reload");
  }

  ngOnDestroy() {
    jQuery('body').removeClass('app-packages');
  }
}

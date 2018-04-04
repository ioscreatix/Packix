import {AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {ActivatedRoute} from "@angular/router";
import {AccountApi} from "../../../shared/sdk/services/custom";
import {Account} from "../../../shared/sdk/models";
import {AccountsTableComponent} from "../../../components/accounts-table/accounts-table.component";

@Component({
  selector: 'accounts-view',
  templateUrl: 'accounts-view.template.html'
})

export class AccountsViewComponent implements AfterViewInit, OnDestroy{

  public accounts: Account[];
  public searchText: string = "";


  @ViewChild(AccountsTableComponent) accountsTable: AccountsTableComponent;

  constructor(
    private accountAPI: AccountApi,
    private route: ActivatedRoute
  ) {
    this.loadData();

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadData() {
    if (this.searchText.length > 2) {
      this.accountAPI.find({
        where: {
          or: [
            {profileName: {regexp: '/' + this.searchText + '/i'}},
            {profileEmail: {regexp: '/' + this.searchText + '/i'}},
            {id: {regexp: '/' + this.searchText + '/i'}},

          ]
        }
      }).subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
    } else {
      this.accounts = [];
    }
  }

  public searchStroke(value) {
    //if ((value || "") !== this.searchText) {
    this.searchText = value || "";
    this.loadData();
    //}
  }

  ngAfterViewInit() {
    jQuery('body').addClass('app-packages');
  }

  ngOnDestroy() {
    jQuery('body').removeClass('app-packages');
  }
}

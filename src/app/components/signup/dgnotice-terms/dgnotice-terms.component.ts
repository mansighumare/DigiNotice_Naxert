import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-dgnotice-terms',
  templateUrl: './dgnotice-terms.component.html',
  styleUrls: ['./dgnotice-terms.component.scss']
})
export class DgnoticeTermsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeTermsPopup() {
    $("#dg-terms-popup").modal('hide');
  }

}

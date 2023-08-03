import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-feedback',
  templateUrl: './help-feedback.component.html',
  styleUrls: ['./help-feedback.component.scss']
})
export class HelpFeedbackComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
  
    }
    else{

      this.router.navigate(["./login"]);
    }
  }

}

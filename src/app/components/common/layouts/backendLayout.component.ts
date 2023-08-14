import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SharedModelService } from 'src/app/services';
// import { detectBody } from '../../../app.helpers';

declare var jQuery: any;

@Component({
  selector: 'backend',
  templateUrl: 'backendLayout.component.html',

  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BackendLayoutComponent {
  collaps: boolean;


  constructor(  private shared:SharedModelService){}
  @ViewChild('myDivElement', { static: true }) myDivElementRef!: ElementRef;


  @HostListener('document:click', ['$event'])
  private updateValue() {
    this.shared.getBoolean().subscribe((newValue) => {
      this.collaps = newValue;
      const myDiv = this.myDivElementRef.nativeElement as HTMLDivElement;
      if(!this.collaps){
        myDiv.style.width = '108%'
       myDiv.style.marginLeft = '-150px'
    
      }else{
        myDiv.style.width = '';
        myDiv.style.marginLeft = '00px'
      }
    });
  }
  public ngOnInit(): any {
    // detectBody();
  }

  public onResize() {
    // detectBody();
  }

}

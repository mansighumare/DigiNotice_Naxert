import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AddAdBannerWebModel } from '../models/AdBanner';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  constructor() { }
  private booleanSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private valueChangeSubject: Subject<void> = new Subject<void>();
  editAdBannerModel:AddAdBannerWebModel = new AddAdBannerWebModel();  
  getBoolean(): Observable<boolean> {
    return this.booleanSubject.asObservable();
  }

  setBoolean(newValue: boolean) {
    this.booleanSubject.next(newValue);
    this.valueChangeSubject.next(); // Notify about value change
  }

  onValueChange(): Observable<void> {
    return this.valueChangeSubject.asObservable();
  }




  

}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseHelperService {

  constructor() { }

  public handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    return throwError(error || 'Server error');
  }

  public extractData(response: Response) {
    let body = response.json();
    return `body`;
  }
}

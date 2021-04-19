import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface CsrfResponse {
  token: string;
  parameterName: string;
  headerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class  CsrfProvider {

  private csrfEndpoint = `${environment.messengerServerUrl}/csrf`;
  private token = '';
  private headerName = '';

  constructor(private httpClient: HttpClient) {
  }

  public getToken(): string {
    return this.token;
  }

  public getHeaderName(): string {
    return this.headerName;
  }

  public initialize(): Promise<boolean> {
    return new Promise(((resolve, reject) => {
      // this.httpClient.get<CsrfResponse>(this.csrfEndpoint)
      //   .subscribe((response) => {
      //     this.token = response.token;
      //     this.headerName = response.headerName;
      //     resolve(true);
      //   });
      resolve(true);
    }));
  }
}

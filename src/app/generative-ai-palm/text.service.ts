import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TextResponse } from '../models/vertex-ai';
import { firstValueFrom } from 'rxjs';

export class MakerSuiteCredentials {
  apiKEY: string = "";
}

@Injectable({
  providedIn: 'root'
})
export class TextServiceClient {
  constructor(private http: HttpClient, private config: MakerSuiteCredentials) {

  }

  async generateText(prompt: string) {
    let apiKey = this.config?.apiKEY || "";
    let endpoint = this.buildEndpointUrlApiKey(apiKey);

    return firstValueFrom(
      this.http.post<TextResponse>(endpoint, prompt)
    );
  }

  buildEndpointUrlApiKey(apikey: string) {
    const BASE_URL = "https://generativelanguage.googleapis.com/";
    const API_VERSION = 'v1beta2';   // may be different at this time Eg: v1, v2, etc
    const MODEL = 'text-bison-001';  // may be different at this time

    let url = BASE_URL;              // base url
    url += API_VERSION;              // api version
    url += "/models/" + MODEL        // model
    url += ":generateText";          // action
    url += "?key=" + apikey;         // api key

    return url;
  }
}

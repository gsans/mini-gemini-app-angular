import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictComponent } from './predict/predict.component';

import { NbThemeModule, NbLayoutModule, NbChatModule, NbSpinnerModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PalmModule } from './generative-ai-palm/palm.module';
import { VertexModule } from './generative-ai-vertex/vertex.module';
import { environment } from '../environments/environment.development';
import { ChatComponent } from './chat/chat.component';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MarkdownModule } from 'ngx-markdown';
import { TextComponent } from './text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictComponent,
    ChatComponent,
    TextComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    NbSpinnerModule,
    NbButtonModule,
    NbIconModule,

    BrowserAnimationsModule,
    // VertexModule.forRoot({
    //   projectId: environment.PROJECT_ID,
    //   accessToken: environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN,
    //   version: "v1" // options: v1beta1, v1
    // })
    PalmModule.forRoot({
      apiKey: environment.API_KEY,
      version: "v1beta2" // options: v1beta2
    }),
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,

    MarkdownModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, Inject, ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { AudioService } from '../read/audio.service';
import { HttpEvent, HttpEventType, HttpDownloadProgressEvent } from '@angular/common/http';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { environment } from '../../environments/environment.development';
import { GoogleAI } from '../models.constants';

const MAX_PHRASES = 10;

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @ViewChild(RichTextEditorComponent)
  editor!: RichTextEditorComponent;
  editorEmpty: boolean = true;
  playing: boolean = false;

  constructor(
    private audio: AudioService
  ) { }

  editorChange(empty: boolean) {
    this.editorEmpty = empty;
  }

  async run() {
    if (!this.editor) return;
    const prompt = this.editor.extractPrompt();

    // Gemini Client
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    const generationConfig = {
      maxOutputTokens: 100,
    };
    const model = genAI.getGenerativeModel({ 
      model: GoogleAI.Model.Gemini20ProExp, 
      generationConfig 
    });
  
    const result = await model.generateContent([ 
      "Reply using a maximum of a 100 characters.",
      prompt
    ]);
    const response = await result.response;
    const text = response.text();
    if (text.length > 0) {
      this.editor.insertAndFormatMarkdown(text);
    }
  }

  private showTextEditor(text: string) {
    console.log(text);
  }

  private handleStreamEvent(event: HttpEvent<string>, state: any): any {
    switch(event.type) {
      case HttpEventType.Sent: {
        let range = this.editor.getRange();
        return { range, text: state.text };
      }
      case HttpEventType.DownloadProgress: { 
        let fragment = this.fixPartialAnswer((event as any).partialText);
        let text = this.extractCompletion(fragment);
        this.editor.insertStream(text, state.range);
        break;
      }
      case HttpEventType.Response: {
        let text = this.extractCompletion(event.body || "");
        this.editor.insertStream(text, state.range);
        break;
      } 
    }    
    return { range: state.range, text: state.text };
  }

  private fixPartialAnswer(fragment: string): string {
    // Add closing array to partial reply if necessary
    if (fragment.slice(-1) !== ']') {
      fragment += ']';
    }
    return fragment;
  }

  private extractCompletion(fragment: string): string {
    const response = JSON.parse(fragment);
    let final = '';
    response.forEach((element: any) => {
      final += (element.outputs?.[0].structVal?.content?.stringVal?.[0]).trim() + ' ';
    })
    final = final.slice(0, -1);
    return final;
  }

  clear() {
    this.editor.clear();
  }

  speakoutPrompt() {
    if (this.audio.isAudioStreamingPlaying()) {
      this.audio.pause();
      return;
    }
    const prompt = this.editor.extractPrompt();
    if (prompt.length == 0) return;
    const phrases = prompt.split('.');
    const limitedPhrases = phrases.slice(0, MAX_PHRASES).join('.');
    if (limitedPhrases.length > 0) {
      this.audio.playStreamAudio(limitedPhrases);
    }
  }

  extractText(ops: any) {
    let text = '';
    ops.forEach((op: any) => {
      if (op.insert?.label) {
        text += '\n\n' + op.insert.label + '\n\n';
      } else if (op.insert) {
        text += op.insert;
      }
    });
    return text;
  }

  // private logBlockedResponse(prompt: string, response: TextResponse) {
  //   if (!response.filters || response.filters.length == 0) return;

  //   console.log("Response was blocked.");
  //   console.log(`Original prompt: ${prompt}`);
  //   console.log(`Filters applied:\n${JSON.stringify(response.filters, null, " ")}`);
  //   console.log(`Safety settings and category ratings:\n${JSON.stringify(response.safetyFeedback, null, " ")}`);
  // }
}


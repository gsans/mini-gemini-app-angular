import { Component } from '@angular/core';
import { AudioService } from './audio.service';

@Component({
    selector: 'app-read',
    templateUrl: './read.component.html',
    styleUrls: ['./read.component.scss'],
    standalone: false
})
export class ReadComponent {
  constructor(private audio: AudioService) { }

  public playTextToSpeech(text:string) {
    this.audio.playTextToSpeech(text);
  }
  public playStreamAudio(text: string) {
    this.audio.playStreamAudio(text);
  }
}

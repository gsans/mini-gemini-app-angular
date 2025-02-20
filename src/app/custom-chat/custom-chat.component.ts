import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { KatexOptions, MermaidAPI } from 'ngx-markdown';
import { ClipboardButtonComponent } from '../clipboard-button/clipboard-button.component';
import * as uuid from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { environment } from '../../environments/environment.development';
import { GoogleAI } from '../models.constants';

declare global {
  interface Window {
    scrollIntoView?: any;
  }
}
declare var navigator: any;

interface ChatMessage {
  id: string,
  text: string,
  sender: string,
  avatar: string,
  isRaw?: boolean,
}

interface Message {
  content: string,
}

@Component({
    selector: 'app-custom-chat',
    templateUrl: './custom-chat.component.html',
    styleUrls: ['./custom-chat.component.scss'],
    standalone: false
})
export class CustomChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('bottom') bottom!: ElementRef;
  @ViewChild('scroll') scroll!: ElementRef;
  readonly clipboardButton = ClipboardButtonComponent;
  disabled: boolean = false;

  title = 'Conversation';
  messages: Array<ChatMessage> = [];
  loading = false;
  katexOptions: KatexOptions = {
    displayMode: true,
    throwOnError: false
  };
  public mermaidOptions: MermaidAPI.Config = {
    fontFamily: `"Source Code Pro", verdana, arial, sans-serif`,
    logLevel: MermaidAPI.LogLevel.Info,
    theme: MermaidAPI.Theme.Default,
    themeCSS: `
        path.arrowMarkerPath { fill: #1d262f; stroke:#1d262f; } 
        .node rect { fill: white; stroke:#1d262f; }
        .flowchart-link { stroke: #1d262f; fill: none; }
        .entityBox { fill: white; stroke:#1d262f; }
        .nodeLabel { color: #1d262f; }
        .node polygon { fill: white; stroke:#1d262f; }
        .actor { fill: white; stroke:#1d262f; }
        text.actor>tspan { color: #1d262f; fill:#1d262f; }
        .actor-man circle, line { color: #1d262f; fill:white; stroke:#1d262f; }
      `,
  };
  large_text_section = ''; /* `**Large text**
    sajdkjaskjdaskjndkjasjkdn jkankjnaskjnd kasjndkj naskjdakjdnkajndkasnkdnaskjdnkjasndkjankj dsnksjnkja dnkjad jsakd kadsjjadsnkadnkadjnakdjsndskdjaskadjnakjnds adadasjasdkjadnakdjnadsasdndksajsdajkdskajdaskjndaskadsndsanssdanaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankj   dsajsad sdasd
  ` */
  model = {
    prompt: "",
  };
  navigator: any = window.navigator;
  MAX_SIZE_BYTES: number = 20000 - 2700; //request payload approximation 2229 TODO: expose these from the client
  gemini: any;
  chat: any;


  constructor() { }

  ngOnInit(): void {
    /* this.messages.push({
      id: uuid.v4(),
      text: `
      ${this.large_text_section}
      **Markdown for improved readability**
      This is _funky_.

      **Code blocks for coding**
\`\`\`ts
var s = "JavaScript syntax highlighting";
alert(s);
\`\`\`

\`\`\`HTML
<div class= "cdk-visually-hidden cdk-focus-trap-anchor" aria-hidden="true">
  Empty
</div>
\`\`\`

      **Emoji shortnames**
      :wave: \\:wave\\: :volcano: \\:volcano\\: :helicopter: \\:helicopter\\: 
    
      **Katex for Math**
      \$ E = mc^ 2 \$
    
      **MermaidJS for diagrams**
      \`\`\`mermaid
      sequenceDiagram
      Alice->>+John: Hello John, how are you?
      Alice->>+John: John, can you hear me?
      John-->>-Alice: Hi Alice, I can hear you!
      John-->>-Alice: I feel great!
      \`\`\`

    ` ,
      sender: '@gerardsans',
      avatar: "https://i.imgur.com/pU0z5Xt.jpeg",
    }); */

    this.messages.push({
      id: uuid.v4(),
      text: `
          **MermaidJS for diagrams**
          \`\`\`mermaid
          sequenceDiagram
          Alice->>+John: Hello John, how are you?
          Alice->>+John: John, can you hear me?
          John-->>-Alice: Hi Alice, I can hear you!
          John-->>-Alice: I feel great!
          \`\`\`

          \`\`\`mermaid
          flowchart TD
          A[Christmas] -->|Get money| B(Go shopping)
          B --> C{Let me think}
          C -->|One| D[Laptop]
          C -->|Two| E[iPhone]
          C -->|Three| F[fa:fa-car Car]
          \`\`\`

          \`\`\`mermaid
          classDiagram
          Animal <|-- Duck
          Animal <|-- Fish
          Animal <|-- Zebra
          Animal : +int age
          Animal : +String gender
          Animal: +isMammal()
          Animal: +mate()
          class Duck{
            +String beakColor
            +swim()
            +quack()
          }
          class Fish{
            -int sizeInFeet
            -canEat()
          }
          class Zebra{
            +bool is_wild
            +run()
          }
          \`\`\`

          \`\`\`mermaid
          stateDiagram-v2
          [*] --> Still
          Still --> [*]
          Still --> Moving
          Moving --> Still
          Moving --> Crash
          Crash --> [*]
          \`\`\`

          \`\`\`mermaid
          erDiagram
          CUSTOMER }|..|{ DELIVERY-ADDRESS : has
          CUSTOMER ||--o{ ORDER : places
          CUSTOMER ||--o{ INVOICE : "liable for"
          DELIVERY-ADDRESS ||--o{ ORDER : receives
          INVOICE ||--|{ ORDER : covers
          \`\`\`

          \`\`\`mermaid
          gantt
          title A Gantt Diagram
          dateFormat  YYYY-MM-DD
          section Section
          A task           :a1, 2014-01-01, 30d
          Another task     :after a1  , 20d
          section Another
          Task in sec      :2014-01-12  , 12d
          another task      : 24d
          \`\`\`

          \`\`\`mermaid
          mindmap
          {{Google Generative AI}}
            VertexAI
            ::icon(fa fa-cloud)
             (Text)
             ::icon(fa fa-file-alt)
             (Code)
             ::icon(fa fa-code)
             (Audio)
             ::icon(fa fa-volume-up)
             (Images)
             ::icon(fa fa-image)
            MakerSuite
            ::icon(fa fa-edit)
             [Gemini for Text]
             ::icon(fa fa-file-alt)
             [Gemini for Chat]
             ::icon(fa fa-comments)
             [Embeddings] 
             ::icon(fa fa-tasks)
          \`\`\`
          
          \`\`\`mermaid
          quadrantChart
          Campaign A: [0.3, 0.6]
          Campaign B: [0.45, 0.23]
          Campaign C: [0.57, 0.69]
          Campaign D: [0.78, 0.34]
          Campaign E: [0.40, 0.34]
          Campaign F: [0.35, 0.78]
          \`\`\`

        ` ,
      sender: '@gerardsans',
      avatar: "https://i.imgur.com/pU0z5Xt.jpeg",
    });

    // Gemini Client
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    this.gemini = genAI.getGenerativeModel({ model: GoogleAI.Model.Gemini20ProExp });

    this.chat = this.gemini.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: "Hi there!" },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "Keep your answers brief and to a single paragraph. Use markdown formatting extensively, Katex for formulas and MermaidJS for diagrams. Do not use other formats. Always specify the language in code fences. Eg: ```HTML. Try to use at least one or more of these special formatting options when providing your answers. Pay special attention to indentation when using MermaidJS and be very conservative using features to avoid syntax errors. Reply understood if you got everything." },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Understood." },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "Difference between Constructor and ngOnInit? Answer: The constructor is called when an **Angular component** is created, while `ngOnInit` is called after the component's data has been initialized. This means that the constructor can be used to initialize the component's properties, while `ngOnInit` can be used to perform any additional initialization that needs to be done after the component's data has been loaded.\n\nFor example, the constructor might be used to set the initial value of a component's property, while `ngOnInit` might be used to subscribe to an observable or call a service.\n\nHere is an example of a constructor:\n\n```ts\nconstructor(private service: MyService) {}\n```\nAnd here is an example of `ngOnInit`:\n\n```ts\nngOnInit() {\n  this.service.getData().subscribe(data => {\n    this.data = data;\n  });\n}\n```\nIn this example, the constructor is used to inject the `MyService` dependency, while `ngOnInit` is used to subscribe to the `getData` observable and update the component's data property with the data that is returned." },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "The constructor is called when an **Angular component** is created, while `ngOnInit` is called after the component's data has been initialized. This means that the constructor can be used to initialize the component's properties, while `ngOnInit` can be used to perform any additional initialization that needs to be done after the component's data has been loaded.\n\nFor example, the constructor might be used to set the initial value of a component's property, while `ngOnInit` might be used to subscribe to an observable or call a service.\n\nHere is an example of a constructor:\n\n```ts\nconstructor(private service: MyService) {}\n```\nAnd here is an example of `ngOnInit`:\n\n```ts\nngOnInit() {\n  this.service.getData().subscribe(data => {\n    this.data = data;\n  });\n}\n```\nIn this example, the constructor is used to inject the `MyService` dependency, while `ngOnInit` is used to subscribe to the `getData` observable and update the component's data property with the data that is returned." },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "Summarise Google's Generative AI using a mind map with MermaidJS." },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `
    \`\`\`mermaid
    mindmap
      root((Google Generative AI))
        VertexAI
          ::icon(fa fa-cloud)
          Text
            ::icon(fa fa-file-alt)
          Code
            ::icon(fa fa-code)
          Audio
            ::icon(fa fa-volume-up)
          Images
            ::icon(fa fa-image)
        MakerSuite
          ::icon(fa fa-edit)
          Gemini for Text
            ::icon(fa fa-file-alt)
          Gemini for Chat
            ::icon(fa fa-comments)
          Embeddings
            ::icon(fa fa-tasks)
    \`\`\`
            ` },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });
  }

  handleUserMessage(event: any) {
    // ignore empty prompts
    if (this.model.prompt.trim().length == 0) {
      event.preventDefault();
      return;
    }

    this.addUserMessage(this.model.prompt);
    setTimeout(() => {
      this.model.prompt = ''; // reset input
    });
  }

  // Helpers
  private async addUserMessage(text: string) {
    //let txt = text.replaceAll('\n', '\\n');

    // Split the text into code and non-code sections
    let sections = text.split(/(```[^`]+```)/);

    // Process non-code sections and replace new lines with <br>
    for (let i = 0; i < sections.length; i++) {
      if (i % 2 === 0) { // Non-code sections
        sections[i] = sections[i].replace(/\n/g, "<br>");
      }
    }

    // Join the sections back together
    let txt = sections.join('');

    this.messages.push({
      id: uuid.v4(),
      text: txt,
      sender: '@gerardsans',
      avatar: "https://i.imgur.com/pU0z5Xt.jpeg",
    } as any);
    this.scrollToBottom();

    this.loading = true;

    let response;
    let answer;
    if (this.disabled) {
      answer = 'Test reply!';
    } else {
      const result = await this.chat.sendMessage(this.TrimToFit(text));
      answer = (await result.response).text();
      this.loading = false;
    }
    if (answer) {
      this.addBotMessage(answer);

      // let newTitle = this.extractTitle(answer);
      // if (newTitle) {
      //   this.title = `Conversation: ${newTitle}`;
      // }
    }
    //this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.messages.push({
      id: uuid.v4(),
      text: text,
      sender: 'Bot',
      avatar: "/gemini.svg",
    });
    //this.scrollToBottom();
  }

  private addBotMessageLocal(text: string) {
    this.messages.push({
      id: uuid.v4(),
      text,
      sender: 'Bot',
      avatar: "/gemini.svg",
    });
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      const top = this.bottom.nativeElement.offsetTop;
      this.scroll.nativeElement.scrollTop = top;
    });
  }

  private extractTitle(text: string): string | null {
    const jsonPattern = /{[^]*?}/; // Regular expression to match a JSON object

    const match = text.match(jsonPattern);
    if (match) {
      try {
        const jsonObject = JSON.parse(match[0]);
        if (typeof jsonObject === 'object' && jsonObject !== null) {
          return jsonObject?.title;
        }
      } catch (error) {
        // JSON parsing error
      }
    }
    return null;
  }

  retry(text: string) {
    if (this.isUserMessage(text)) {
      this.addUserMessage(text); /* retry exact prompt */
    }
  }
  isUserMessage(text: string) {
    //find original message
    const message = this.messages.find((message: any) => message.text === text);
    return (message && message.sender /* user message */);
  }

  showReply(text: string) {
    // only if it is a user prompt (it has a sender)
    return this.messages.find((message: any) => message.text === text && message.sender);
  }

  trackByFn(i: number, element: any) {
    return element.id;
  }

  delete(id: string) {
    this.messages = this.messages.filter((message: any) => message.id !== id);
  }

  ngAfterViewChecked() {
    //fix odd issue with mermaidjs icons: class="node-icon-0 fa&nbspfa-edit"
    document.querySelectorAll("[class^=node-icon-]").forEach(elem => {
      let classSanitised = elem.className.replace(/\s/g, ' ');
      elem.className = classSanitised;
    })
  }

  buildMessages(): Array<Message> {
    const byteSize = (str: string) => new TextEncoder().encode(str).length;
    let totalBytes = 0;
    let messages: Array<Message> = [];
    
    // Keep most recent messages (reversed order)
    const reversedMessages = this.messages.slice().reverse();
    reversedMessages.forEach((message: ChatMessage) => {
      totalBytes += byteSize(message.text);
      if (totalBytes <= this.MAX_SIZE_BYTES) {
        messages.push({ content: message.text });
      } else {
        if (messages.length === 0) {
          //  single message overflowing max length (ignore)
          //messages.push({ content: this.TrimToFit(message.text) });
        } else {
          //  past message that we can further trim to fit max size (automatically making room)
          //   instead of just discarding it altogether
          messages.push({ content: this.TrimToFit(message.text, Math.abs(this.MAX_SIZE_BYTES - totalBytes) ) });
        }
      } 
    });
    return messages.reverse();
  }

  TrimToFit(text: string, maxSize: number = this.MAX_SIZE_BYTES): string {
    if (maxSize > this.MAX_SIZE_BYTES) { 
      maxSize = this.MAX_SIZE_BYTES;
    }
    const marker = "...";

    const byteEncoder = new TextEncoder();
    const byteDecoder = new TextDecoder();

    const inputBytes = byteEncoder.encode(text);

    if (inputBytes.length <= maxSize) {
      return text;
    }

    const remainingBytes = maxSize - byteEncoder.encode(marker).length;
    const trimmedBytes = inputBytes.slice(0, remainingBytes);
    console.log("Warning. Message was trimmed to fit max capacity: ", maxSize);

    return byteDecoder.decode(trimmedBytes) + marker;
  }


}

window.document.addEventListener('copy', function (event) {
  const selection = window.getSelection();
  if (selection?.isCollapsed) {
    return;  // default action OK
  }
  const fragment = selection?.getRangeAt(0).cloneContents();
  const katexs = fragment?.querySelectorAll('.katex');
  if (katexs?.length === 0) {
    return;  // default action OK
  }
  katexs?.forEach(function (element) {
    const texSource = element.querySelector('annotation');
    if (texSource) {
      element.replaceWith(texSource);
      texSource.innerHTML = '$' + texSource.innerHTML + '$';
    }
  });
  fragment?.querySelectorAll('.katex-display annotation').forEach(function (element) {
    element.innerHTML = '$' + element.innerHTML + '$';
  })
  event?.clipboardData?.setData('text/plain', fragment?.textContent || "");
  event?.clipboardData?.setData('text/html', selection?.getRangeAt(0).cloneContents().textContent || "");
  event.preventDefault();
})

# Mini-Gemini Chatbot Angular client using Gemini API (via API key and Google AI Studio)

### Features
- Support for Gemini 2.0 via Google AI API
- Gemini API (generateContent, startChat and sendMessage)
- Demonstration of Gemini for Text with text-to-speech (ElevenLabs)
- Demonstration of Gemini for Chat with Rich Media support (markdown, code, emojis, formulas and diagrams)
- Demonstration of Gemini for Images with Rich Media support (markdown, code, emojis, formulas and diagrams)

### Libraries
- Angular Material
- Gemini for Text:
  - ngx-quill - Angular QuillJS wrapper, a Rich Text Editor
  - QuillJS. Custom non-editable block (embed blot) to handle model responses.
  - ElevenLabs API - High quality natural voices
- Gemini for Chat:
  - ngx-markdown - Markdown renderer with support for multiple extensions (code fences and highlighting, emojis, Katex mathematic formulas, MermaidJS diagrams and more)
- Gemini for Images:
  - ngx-markdown - Markdown renderer with support for multiple extensions (code fences and highlighting, emojis, Katex mathematic formulas, MermaidJS diagrams and more)
  

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Project Set-up
Run this Angular CLI command to get the local environment setup:

```
ng g environments
```

This will create the following files for `development` and `production`:
```
src/environments/environment.development.ts
src/environments/environment.ts
```

Change these files to include your environment setup accordingly. For the examples below we will use the `development` file:

```ts
// src/environments/environment.development.ts
export const environment = {
  /// your setup
};
```

### Setup for Gemini API access via API key (Google AI Studio)

Get an [API key from Google AI Studio](https://makersuite.google.com/app/apikey), then configure it here. 

> Note that access [may be restricted](https://ai.google.dev/gemini-api/docs/available-regions) depending in your country. Use a VPN to overcome this limitation.

```ts
// src/environments/environment.development.ts
export const environment = {
  API_KEY: "<<YOUR-API-KEY-FROM-GOOGLE-AI-STUDIO>>",
};
```

### ElevenLabs Setup
This project supports the `regular` and `streamed` APIs for faster responsiveness.

You can use the newest `eleven_multilingual_v2`, a single foundational model supporting 28 languages including English, Chinese, Spanish, Hindi, Portuguese, French, German, Japanese, Arabic, Korean, Indonesian, Italian, Dutch, Turkish, Polish, Swedish, Filipino, Malay, Romanian, Ukrainian, Greek, Czech, Danish, Finnish, Bulgarian, Croatian, Slovak, and Tamil; or `eleven_monolingual_v1`, a low-latency model specifically trained for English speech.

You need to [generate your API key](https://elevenlabs.io/speech-synthesis) (Sign In/Profile).

#### Picking a voice
Using your API key you can either use [Voice Lab](https://elevenlabs.io/app/voice-lab) to listen to the voices, once you pick one, click on "View" to access its "ID" (bottom right) or use the API `https://api.elevenlabs.io/v1/voices`.

Pick a voice from the response 
```
{
  "voices": [
    {
      "voice_id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "category": "premade",
      "labels": {
        "accent": "american",
        "description": "calm",
        "age": "young",
        "gender": "female",
        "use case": "narration"
      },
      "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3",
      ...
    },
  ]
}
```

Once you have the `API key` and `voice-id` you can fill in the remaining entries in the environment file.

```ts
// src/environments/environment.development.ts
export const environment = {
  ELEVEN_LABS_API_KEY: "<<ELEVEN-LABS-API-KEY>>",
  ELEVEN_LABS_VOICE_ID: "<<ELEVEN-LABS-VOICE-ID>>",
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

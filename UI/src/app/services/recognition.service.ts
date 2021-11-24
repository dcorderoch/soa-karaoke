import { Injectable } from "@angular/core";

import { metaphone } from "metaphone";

@Injectable({
  providedIn: "root",
})
export class RecognitionService {
  private static recognition: SpeechRecognition;
  ALPHA_REGEX: RegExp = /[^a-z\s]/gi;
  DOUBLESPACES_REGEX: RegExp = /\s\s+/g;

  constructor() {}

  getRecognition(): SpeechRecognition {
    if (RecognitionService.recognition) {
      return RecognitionService.recognition;
    }

    const recognition = new (window["SpeechRecognition"] ||
      window["webkitSpeechRecognition"] ||
      window["mozSpeechRecognition"] ||
      window["msSpeechRecognition"])() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;

    return recognition;
  }
  /**
   * Calculates number of word matches between speech and last 5 lines of lyrics
   * @param {string} speech Spoken text
   * @param {string[]} lines Last 5 lines of song lyrics
   * @returns {number} Number of exact matches found
   * @memberOf PlayerService
   */
  public countMatches(speech: string, lines: string[]): number {
    let matches = 0;

    const speechWordsList = speech
      .trim()
      .toLowerCase()
      .replace(this.ALPHA_REGEX, "")
      .replace(this.DOUBLESPACES_REGEX, " ")
      .split(" ");

    const linesWordsList = lines
      .map((line) =>
        line
          .trim()
          .toLowerCase()
          .replace(this.ALPHA_REGEX, "")
          .replace(this.DOUBLESPACES_REGEX, " ")
          .split(" ")
      )
      .reduce((a, b) => a.concat(b), []);

    speechWordsList.forEach((wordFromSpeech) => {
      const indexInLyrics = linesWordsList.findIndex(
        (wordFromLyrics) =>
          wordFromSpeech === wordFromLyrics ||
          metaphone(wordFromSpeech) === metaphone(wordFromLyrics)
      );

      if (indexInLyrics >= 0) {
        linesWordsList.splice(indexInLyrics, 1);
        matches++;
      }
    });

    return matches;
  }
}

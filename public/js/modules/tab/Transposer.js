/**
 * A utility class that contains all of the functions required to transpose a chord
 */
export class Transposer {

  /**
   * Transposes a specified guitar chord by a specified number of semitones
   * @param {string} chord The chord to transpose
   * @param {number} semitones The number of semitones to transpose the chord by
   * @returns A transposed chord
   */
  static transpose(chord, semitones) {

    // If this is an inversion chord, use a special transposing function
    if (this.isInversion(chord)) {
      return this.transposeInversionChord(chord, semitones);
    }

    // Otherwise, if this is a normal chord.  Transpose it normally.
    return this.transposeNormalChord(chord, semitones);
  }

  /**
   * This function takes an inversion chord and transposes it
   * @param {string} chord The chord to transpose
   * @param {number} semitones The number of semitones to transpose the chord by
   * @returns A transposed inversion chord
   */
  static transposeInversionChord(chord, semitones) {
    let [chord1, chord2] = this.destructureInversion(chord);

    chord1 = this.transposeNormalChord(chord1, semitones);
    chord2 = this.transposeNormalChord(chord2, semitones);

    return this.restructureInversion(chord1, chord2);
  }

  /**
   * This function takes a normal chord (a non inversion chord) and transposes it
   * @param {string} chord The chord to transpose
   * @param {number} semitones The number of semitones to transpose the chord by
   * @returns A transposed chord
   */
  static transposeNormalChord(chord, semitones) {
    // Determine which chord in the list this chord is (ignoring things like m or sus4)
    let chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let chordLength = 1;
    let chordIndex;

    if (chord.charAt(1) === "#") {
      chordLength = 2;
    }

    chordIndex = chords.indexOf(chord.slice(0, chordLength)) + semitones;

    // Put the chord to a transposable range, if applicable
    while (chordIndex > chords.length - 1) {
      chordIndex -= chords.length;
    }

    while (chordIndex < 0) {
      chordIndex += chords.length;
    }

    // Return the transposed chord
    return chords[chordIndex] + chord.slice(chordLength);
  }

  /**
   * Gets whether or not a chord is an inversion
   * @param {string} chord The chord to check for an inversion
   * @returns Whether or not the chord is an inversion
   */
  static isInversion(chord) {
    return chord.indexOf("/") >= 0;
  }

  /**
   * Destructures an inversion chord into 2 normal chords
   * @param {string} chord The inversion chord to destructure
   * @returns An array with 2 normal chords
   */
  static destructureInversion(chord) {
    return chord.split('/');
  }

  /**
   * Takes 2 normals chords and restructures them into an inversion
   * @param {string} chord1 Normal chord number 1, the one that should come before the slash
   * @param {string} chord2 Normal chord number 2, the one that should come after the slash
   * @returns An inversion chord
   */
  static restructureInversion(chord1, chord2) {
    return chord1 + "/" + chord2;
  }
}

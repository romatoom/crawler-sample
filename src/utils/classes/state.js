import { Storage } from "#utils/classes/storage.js";

class State {
  init(sourceName) {
    this.sourceName = sourceName;
    this.storage = new Storage(sourceName);
  }
}

const state = new State();
export default state;

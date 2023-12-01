import { Storage } from "#utils/classes/storage.js";
import { Database } from "#utils/classes/database.js";
import { Statistic } from "#utils/classes/statistic.js";

class State {
  async init(sourceName) {
    this.sourceName = sourceName;
    this.storage = new Storage(sourceName);
    this.db = await Database.build(sourceName);
    this.statistic = new Statistic()
  }
}

const state = new State();
export default state;

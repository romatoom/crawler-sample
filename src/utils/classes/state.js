import { Storage } from "#utils/classes/storage.js";
import { Database } from "#utils/classes/database.js";
import { Statistic } from "#utils/classes/statistic.js";
import { Serializer } from "#utils/classes/serializer.js";
import { Exporter } from "#utils/classes/exporter.js";

class State {
  async init(sourceName) {
    this.sourceName = sourceName;
    this.storage = new Storage(sourceName);
    this.statistic = new Statistic();
    this.serializer = new Serializer(sourceName);
    this.db = await Database.build(sourceName);
    this.exporter = new Exporter(sourceName, this.db);
  }
}

const state = new State();
export default state;

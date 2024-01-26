import { Storage } from "#utils/classes/storage.js";
import { Database } from "#utils/classes/database.js";
import { Statistic } from "#utils/classes/statistic.js";
import { Serializer } from "#utils/classes/serializer.js";
import { DataPreparer } from "#utils/classes/dataPreparer.js";
import { Exporter } from "#utils/classes/exporter.js";
import { Paths } from "#utils/classes/paths.js";

class State {
  async init(source) {
    this.sourceName = source.name;
    this.storage = new Storage(this.sourceName);
    this.statistic = new Statistic();
    this.serializer = new Serializer(this.sourceName);
    this.db = await Database.build(this.sourceName);
    this.exporter = new Exporter(source, this.db);
    this.dataPreparer = new DataPreparer(source);
    this.paths = new Paths(this.sourceName);
    this.variables = {};
  }
}

const state = new State();
export default state;

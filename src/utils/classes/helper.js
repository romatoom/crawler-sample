export class Helper {
  static arrayItemsInString(str, items, defaultValue) {
    for (const item of items) {
      if (str.includes(item)) return item;
    }
    return defaultValue;
  }
}

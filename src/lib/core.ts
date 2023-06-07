export function createFactory<T, R extends any[]>(_class: new (...args: R) => T, ...args: R): T {
  return new _class(...args);
}

export function initializeDate(value?: string | number | Date) {
  return new Date(value);
}

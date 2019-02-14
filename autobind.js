// Adapted from https://github.com/sindresorhus/auto-bind
module.exports = (self) => {
  const proto = self.constructor.prototype
  for (let key of Reflect.ownKeys(proto)) {
    if (key === 'constructor') { continue }
    const descriptor = Reflect.getOwnPropertyDescriptor(proto, key)
    if (descriptor && typeof descriptor.value === 'function') {
      self[key] = self[key].bind(self)
    }
  }
  return self
}

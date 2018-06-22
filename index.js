'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  // 传入的middleware必须是数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 检测middleware中的各项，每项都需是函数
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  // compose函数调用之后的匿名函数
  return function (context, next) {
    // last called middleware #
    // 初始下标为-1
    let index = -1
    // 开始执行第一个中间件
    return dispatch(0)
    function dispatch (i) {
      // 当 i <= index的时候，意味着一个中间件被要求执行两次，这是不允许的，故抛出一个错误
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // 执行一次next函数之后，将index于i设置为相等
      index = i
      // 取索引为i的中间件函数
      let fn = middleware[i]
      // i与中间件数组长度一致时，将fn赋值为next，此时的next是undefined,但是fn也已经是undefined了啊，为什么要还要重设一下呢？
      if (i === middleware.length) fn = next
      // 中间件执行结束，返回Promise，即可以compose()().then(() => {}) 使用
      if (!fn) return Promise.resolve()
      try {
        // 将中间件fn的执行结果通过Promise包裹，即外部可以通过await 或者next().then去获取值
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        // 错误捕获
        return Promise.reject(err)
      }
    }
  }
}

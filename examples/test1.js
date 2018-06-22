const compose = require('../index')

const one = (ctx, next) => {
  console.log('第一')
  next()
  console.log('第一end')
}

const two = (ctx, next) => {
  console.log('第二')
  next()
  console.log('第二end')
}

const three = (ctx, next) => {
  console.log('第三')
  next()
  console.log('第三end')
}

const mids = compose([ one, two, three ])

mids()
  .then(() => {
    console.log('end')
  })
var penguin_meat = function () {
  function chunk() {

  }

  function compact(array) {
    if (!array) {
      return []
    }
    var res = []
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        res.push(array[i])
      }
    }
    return res
  }

  function difference(array, value) {
    var res = [] //建一个新的数组存储
    for (var i = 0; i < array.length; i++) {
      if (!array[i].include(value[i])) {
        //如果不在value里面 那么添加到新的数组里 
        res.push(array[i])
      }
    }
    return res

  }
  //https://www.lodashjs.com/docs/lodash.sum 
  function sum(array) {
    var sum = 0

    for (var i = 0; i < array.length; i++) {
      sum += array[i]
    }
    return sum

  }

  //https://www.lodashjs.com/docs/lodash.isNaN
  function isNaN(value) {
    return value == NaN

  }


  //https://www.lodashjs.com/docs/lodash.indexOf
  function indexOf(array, value, number) {
    for (var i = number; i < array.length; i++) {
      if (array[i] == value) {
        return i
      }
    }
    return -1

  }

  //https://www.lodashjs.com/docs/lodash.slice
  function slice(array, start, end) {
    var res = []
    var end = array.length
    for (var i = start; i < end - 1; i++) {
      res.push(array[i])
    }
    return res
  }

  //https://www.lodashjs.com/docs/lodash.drop
  function drop(array, number = 1) {
    var res = []
    for (var i = number; i < array.length; i++) {
      res.push(array[i])
    }
    return res

  }


  //https://www.lodashjs.com/docs/lodash.dropRight
  function dropRight(array, number = 1) {
    if (n > array.length) {
      return []
    } else {
      return array.slice

    }

  }

  //https://www.lodashjs.com/docs/lodash.concat
  function concat(array, value) {
    var newArray = []

  }

  //https://www.lodashjs.com/docs/lodash.isUndefined
  function isUndefined(value) {
    return value == undefined
  }


  //https://www.lodashjs.com/docs/lodash.isNil
  function isNill(value) {
    return (value == null || value == undefined ? true : false)
  }

  //https://www.lodashjs.com/docs/lodash.isNull
  function isNull(value) {
    return value == null
  }





  return {
    chunk: chunk,
    compact: compact,
    difference: difference,
    sum: sum,
    isNaN: isNaN,
    indexOf: indexOf,
    slice: slice,
    drop: drop,
    dropRight: dropRight,
    concat: concat,
    isUndefined: isUndefined,
    isNill: isNill,
    isNull: isNull,

  }

}()
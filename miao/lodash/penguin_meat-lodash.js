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
  function indexOf(array, value, number = 0) {
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
    if (number > array.length) {
      return []
    } else {
      return array.slice(0, array.length - number)
    }

  }

  //https://www.lodashjs.com/docs/lodash.concat
  function concat(array, value) {
    var newArray = []

  }

  //https://www.lodashjs.com/docs/lodash.isUndefined
  function isUndefined(value) {
    return value === undefined
  }


  //https://www.lodashjs.com/docs/lodash.isNil
  function isNill(value) {
    return (value === null || value === undefined ? true : false)
  }

  //https://www.lodashjs.com/docs/lodash.isNull
  function isNull(value) {
    return value === null
  }

  //https://www.lodashjs.com/docs/lodash.last
  function last(array) {
    var l = array.length
    return array[l - 1]
  }

  //https://lodash.com/docs/4.17.15#head
  function head(array) {
    if (!array) {
      return []
    } else {
      return array[0]
    }
  }


  //https://www.lodashjs.com/docs/lodash.lastIndexOf
  function lastIndexOf(arr, value, index = arr.length - 1) {
    for (i = index; i >= 0; i--) {
      if (arr[i] == value) {
        return i
      }
    }
    return -1
  }


  //https://www.lodashjs.com/docs/lodash.max
  function max(arr) {
    var max = -Infinity
    if (arr.length == 0) {
      return undefined
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
      }
    }
    return max
  }

  //https://www.lodashjs.com/docs/lodash.min
  function min(arr) {
    if (arr.length == 0) {
      return undefined
    }
    var min = Infinity
    for (var i = 0; i < arr.length; i++) {
      if (min > arr[i]) {
        min = arr[i]
      }
    }
    return min
  }


  //https://www.lodashjs.com/docs/lodash.reverse
  function reverse(arr) {
    var rev = []
    for (var i = arr.length - 1; i >= 0; i--) {
      rev.push(arr[i])
    }
    return rev
  }

  //https://www.lodashjs.com/docs/lodash.add
  function add(a, b) {
    return a + b
  }

  //https://www.lodashjs.com/docs/lodash.divide
  function divide(a, b) {
    return a / b
  }

  //https://www.lodashjs.com/docs/lodash.subtract
  function subtract(a, b) {
    return a - b
  }

  //https://www.lodashjs.com/docs/lodash.mean
  function mean(arr) {
    var sum = 0
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i]
    }
    return sum / arr.length
  }

  //https://www.lodashjs.com/docs/lodash.nth
  function nth(arr, number) {
    if (number < 0) {
      number = arr.length + number
      return arr[number]
    }
  }

  //https://www.lodashjs.com/docs/lodash.initial
  function initial(arr) {
    return arr.slice(0, arr.length - 1)

  }



  //https://www.lodashjs.com/docs/lodash.pull
  function pulll(arr, value) {

  }

  //https://www.lodashjs.com/docs/lodash.take
  function take(arr, n = 1) {
    if (n == 0) {
      return []
    }
    if (n > arr.length) {
      return arr
    } else {
      return arr.slice(0, n)
    }
  }



  //https://www.lodashjs.com/docs/lodash.takeRight
  function takeRight(arr, n = 1) {
    if (n == 0) {
      return []
    }
    if (n > arr.length) {
      return arr
    }
    return arr.slice(arr.length - 1, n)

  }

  //https://www.lodashjs.com/docs/lodash.sortedIndexOf
  function sortedIndexOf(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (value == arr[i]) {
        return i
      }
    }
    return -1
  }



  //https://www.lodashjs.com/docs/lodash.sortedIndex
  function sortedIndex(arr, value) {

  }



  //https://www.lodashjs.com/docs/lodash.sortedLastIndex
  function sortedLastIndex(arr, value) {


  }



  //https://www.lodashjs.com/docs/lodash.tail
  function tail(arr) {
    var brr = []
    for (var i = 1; i < arr.length; i++) {
      brr.push(arr[i])
    }
    return brr
  }



  //https://www.lodashjs.com/docs/lodash.uniq
  function uniq(arr) {

  }

  //https://www.lodashjs.com/docs/lodash.gt
  function gt(value, other) {
    return value > other ? true : false
  }


  function 123{

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
    isNil: isNil,
    isNull: isNull,
    last: last,
    head: head,
    lastIndexOf: lastIndexOf,
    max: max,
    min: min,
    reverse: reverse,
    add: add,
    divide: divide,
    mean: mean,
    subtract: subtract,
    nth: nth,
    initial: initial,
    take: take,
    takeRight: takeRight,
    sortedIndexOf: sortedIndexOf,
    tail: tail,
    gt: gt,






  }

}()
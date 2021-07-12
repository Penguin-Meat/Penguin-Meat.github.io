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
    return (value == NaN ? true : false)

  }




  return {
    chunk: chunk,
    compact: compact,
    difference: difference,
    sum: sum,
    isNaN: isNaN,
  }



}()
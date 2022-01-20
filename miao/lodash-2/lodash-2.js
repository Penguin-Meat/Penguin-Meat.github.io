


var Richrice = function () {

  //object ={'a':[{'b':{'c':3}}]}   
  //'a[0].b.c'  =>3
  //['a','0','b','c']    =>3
  //'a.b.c',default    =>3
  function get(object, path, defaultVal = undefined) {
    path = toPath(path)    //将'a[0].b.c'   转换为 ['a','0','b','c']    'a.b.c'  转换为 ['a','b','c']
    for (var i = 0; i < path.length; i++) {
      if (object == undefined) {
        return defaultVal
      } else {
        object = object[path[i]]
      }
    }
    return object
  }

  function toPath(val) {    //'a[0].b.c[0][3][4].foo.bar'
    if (Array.isArray(val)) {   //如果已经是数组了就返回本身
      return val
    }
    else {
      return val.split('][')
        .reduce((ary, it) => ary.concat(it.split('].')), [])
        .reduce((ary, it) => ary.concat(it.split('[')), [])
        .reduce((ary, it) => ary.concat(it.split('.')), [])
    }
  }

  function bind(f, thisArgs, ...fixedArgs) {    //bind(f,{},1,2,_,3,_,4)
    return function (...args) {
      var ary = fixedArgs.slice()    //将  1,2,_,3,_,4复制一份给ary
      var j = 0
      for (var i = 0; i < ary.length; i++) {   //循环遍历ary 
        if (Object.is(ary[i], bind.placeholder)) {   //若发现ary有哪一个是_
          if (j < args.length) {   //发现是_并且若传入的绑定的实际参数数组还没被遍历完的时候
            ary[i] = args[j++]   //使_的元素按照传入的绑定的实际参数数组的顺序赋值为指定参数
          }
          else {
            ary[i] = undefined   //如果_还有剩余但是传入的绑定的实参个数用完了  那多出来的_赋为undefined
          }
        }
      }

      while (j < args.length) {  //如果_没了但是传入的绑定的实参个数还有的多  那多出来的实参push进ary
        ary.push(args[j++])
      }
      return f.apply(thisArgs, ary)
    }
  }
  bind.placeholder = window

  function isMatch(object, source) {      //判断source对象是不是object对象的子集  是返回true 不是返回false
    if (object == source) {
      return true
    }
    if (typeof object !== 'object' || typeof source !== 'object') {   //当比较的双方有一方不是对象直接false
      return false
    }
    for (var key in source) {
      if (source[key] && typeof source[key] !== 'object') {
        if (object[key] !== source[key]) {
          return false
        }
      }
      else {
        if (!isMatch(object[key], source[key])) {
          return false
        }
      }
    }
    return true

  }


  function property(prop) {
    // return get.bind(null, 跳过, prop)
    return function (obj) {
      // return obj[prop]    //返回的是对象的传入的key的那个值
      return get(obj, prop)
    }
  }


  //判断两个对象的值是否相等
  function matches(src) {    //传入的是一个对象
    return function (obj) {
      //   for (var key in obj) {
      //     if (obj[key] !== src[key]) {
      //       return false//返回的是true  或者  false
      //     }
      //   }
      //   return true
      return isMatch(obj, src)
    }
  }
  //判断传入的属性和值在对象里是否存在
  function matchesProperty(ary) {     //传入的是一个数组
    var key = ary[0]
    var val = ary[1]
    return function (obj) {
      return obj[key] == val   //返回的是true  或者  false
    }
  }

  function iteratee(maybePredicate) {
    if (typeof maybePredicate === 'function') {
      return maybePredicate
    }
    if (typeof maybePredicate === 'string') {
      return property(maybePredicate)
    }
    if (Array.isArray(maybePredicate)) {
      return matchesProperty(maybePredicate)
    }
    if (typeof maybePredicate === 'object') {
      return matches(maybePredicate)
    }
  }


  function map(collection, mapper) {
    mapper = iteratee(mapper)
    var res = []
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        res.push(mapper(collection[i], i, collection))
      }
    } else if (typeof collection == 'object') {
      for (var key in collection) {
        res.push(mapper(collection[key], key, collection))
      }
    }
    return res
  }

  function filter(collection, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var key in collection) {
      if (predicate(collection[key], key, collection) === true) {
        res.push(collection[key])
      }
    }
    return res

  }

  function chunk(arr, num) {
    var res = []
    for (var i = 0; i < arr.length; i += num) {
      var temp = []
      for (var j = i; j < i + num && j < arr.length; j++) {
        temp.push(arr[j])
      }
      res.push(temp)
    }
    return res
  }

  function compact(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] == "false" || arr[i] == "" || isNaN(arr[i])) {
        arr.splice(i, 1)
        len--
        i--
      }
    }
    return arr
  }

  function concat(arr) {
    var args = Array.from(arguments).slice(1)
    if (args.length < 2) {
      arr.push(args[0])
    }
    else {
      for (var i = 0; i < args.length; i++) {
        if (!Array.isArray(args[i])) {
          arr.push(args[i])
        }
        else {
          for (var j = 0; j < args[i].length; j++) {
            arr.push(args[i][j])
          }
        }
      }
    }
    return arr

  }

  function uniq(arr) {
    var res = []
    for (var i = 0; i < arr.length; i++) {
      if (res.includes(arr[i])) {
        continue
      }
      else {
        res.push(arr[i])
      }
    }
    return res
  }

  /////////////////////////////////////////////////////////////////////////////////////
  function uniqueBy(arr, predicate) {
    iteratee(predicate)
    var res = []
    var seen = new Set()
    for (var i = 0; i < arr.length; i++) {
      var computed = predicate(arr[i], i, arr)
      if (!seen.includes[computed]) {
        res.push(arr[i])
        seen.add(computed)
      }
    }
    return res
  }
  function flatten(arr) {
    var res = []
    for (var item of arr) {
      if (!Array.isArray(item)) {
        res.push(item)
      } else {
        for (var item2 of item) {
          res.push(item2)
        }
      }
    }
    return res


  }
  function flattenDeep(arr) {
    var res = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (Array.isArray(item)) {
        item = flattenDeep(item)
        for (var j = 0; j < item.length; j++) {
          res.push(item[j])
        }
      }
      else {
        res.push(item)
      }
    }
    return res
  }

  function flattenDepth(arr, Depth = 1) {
    if (Depth == 0) {
      return arr
    }
    var res = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (Array.isArray(item)) {
        item = flattenDepth(item, Depth - 1)
        for (var j = 0; j < item.length; j++) {
          res.push(item[j])
        }
      }
      else {
        res.push(item)
      }
    }
    return res
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  function groupBy(arr, f) {
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
      var item
      if (typeof arr[i] == 'number') {
        item = f(arr[i])
      }
      else {
        item = arr[i][f]
      }
      if (item in obj) {
        obj[item].push(arr[i])
      }
      else {
        obj[item] = [arr[i]]
      }
    }
    return obj
  }

  function keyBy(arr, f) {
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
      if (typeof f == 'string') {
        obj[arr[i][f]] = arr[i]
      }
      else {
        obj[f(arr[i])] = arr[i]
      }
    }

    return obj

  }

  function forEach(collection, predicate) {
    predicate = iteratee(predicate)
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        predicate(collection[i], i, collection)
      }
    }
    else if (typeof collection == 'object') {
      for (var key in collection) {
        predicate(collection[key], key, collection)
      }
    }
    return collection
  }

  function forEachRight(collection, predicate) {
    predicate = iteratee(predicate)
    if (Array.isArray(collection)) {
      for (var i = collection.length - 1; i >= 0; i--) {
        predicate(collection[i], i, collection)
      }
    }
    else if (typeof collection == 'object') {
      for (var key in collection) {
        predicate(collection[key], key, collection)
      }
    }
    return collection
  }

  function reduce(collection, predicate, initial) {
    predicate = iteratee(predicate)
    if (Array.isArray(collection)) {
      startIdx = 0
      if (arguments.length == 2) {
        initial = collection[0], startIdx = 1
      }
      for (var i = startIdx; i < collection.length; i++) {
        initial = predicate(initial, collection[i])
      }
    }
    else if (typeof collection == 'object') {
      if (arguments.length == 2) {
        var keysArr = Object.keys(collection)
        initial = collection[keysArr[0]]
      }
      for (var key in collection) {
        initial = predicate(initial, collection[key], key)
      }
    }
    return initial
  }


  function reduceRight(collection, predicate, initial) {
    predicate = iteratee(predicate)
    if (Array.isArray(collection)) {
      startIdx = 0
      if (arguments.length == 2) {
        initial = collection[0], startIdx = 1
      }
      for (var i = collection.length - 1; i >= 0; i--) {
        initial = predicate(initial, collection[i])
      }
    }
    else if (typeof collection == 'object') {
      if (arguments.length == 2) {
        var keysArr = Object.keys(collection)
        initial = collection[keysArr[0]]
      }
      for (var key in collection) {
        initial = predicate(initial, collection[key], key)
      }
    }
    return initial
  }
  function zip() {
    var res = []
    var args = Array.from(arguments)
    for (var i = 0; i < args[0].length; i++) {
      var temp = []
      for (var j = 0; j < args.length; j++) {
        temp.push(args[j][i])
      }
      res.push(temp)
    }

    return res

  }

  function unzip(arr) {
    var res = []
    for (var i = 0; i < arr[0].length; i++) {
      var temp = []
      for (var j = 0; j < arr.length; j++) {
        temp.push(arr[j][i])
      }
      res.push(temp)
    }
    return res

  }

  function unzipWith(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var i = 0; i < arr[0].length; i++) {
      var temp = []
      for (var j = 0; j < arr.length; j++) {
        temp.push(arr[j][i])
      }
      res.push(temp)
    }
    var needadd = res[0]
    for (var i = 1; i < res.length; i++) {
      needadd = predicate(needadd, res[i])
    }
    return needadd
  }





  function keys(obj) {
    var arr = []
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        arr.push(i)
      }
    }
    else {
      for (var k in obj) {
        arr.push(k)
      }

    }
    return arr
  }
  function values(obj) {
    var arr = []
    if (typeof obj == 'string' || Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        arr.push(obj[i])
      }
    }
    else {
      for (var k in obj) {
        arr.push(obj[k])
      }

    }
    return arr
  }
  function sortBy(arr, predicate) {
    predicate = iteratee(predicate[0])
    for (var i = 0; i < arr.length - 1; i++) {
      var minIndex = i
      for (var j = i + 1; j < arr.length; j++) {
        if (predicate(arr[j]) < predicate(arr[minIndex])) {
          // if (arr[j] < arr[minIndex]) {
          minIndex = j
        }
      }
      var temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
    }
    return arr
  }

  function isEqual(a, b) {
    if (a === b) {   //只是字面量相等
      return true
    }
    var typea = typeof a, typeb = typeof b
    if (typea !== typeb) {
      return false
    }
    else {
      if (typeof a == 'object') {
        if (Array.isArray(a) && !Array.isArray(b) || Array.isArray(b) && !Array.isArray(a)) {
          return false
        }
        else {               //如果同为数组或者对象
          if (Array.isArray(a)) {
            if (a.length !== b.length) {
              return false
            }
          }
          else {
            var keya = Object.keys(a)
            var keyb = Object.keys(b)
            if (keya.length !== keyb.length) {
              return false
            }
          }

          for (var k in a) {
            if (!(k in b)) {
              return false
            }
            if (!(isEqual(a[k], b[k]))) {
              return false
            }
          }
          return true

        }

      }
      else {
        return false
      }
    }
  }
  function fill(arr, content, start = 0, end = arr.length) {
    for (var i = start; i < end; i++) {
      arr[i] = content
    }
    return arr
  }
  function reverse(arr) {
    for (var i = 0; i < arr.length / 2; i++) {
      var temp = arr[i]
      arr[i] = arr[arr.length - i - 1]
      arr[arr.length - i - 1] = temp
    }
    return arr

  }
  function countBy(arr, f) {
    var res = {}
    if (typeof f == 'function') {
      for (var i = 0; i < arr.length; i++) {
        item = f(arr[i])
        if (!(item in res)) {
          res[item] = 0
          res[item] += 1
        } else {
          res[item] += 1
        }
      }
    }
    else {
      for (var i = 0; i < arr.length; i++) {
        item = arr[i][f]
        if (!(item in res)) {
          res[item] = 0
          res[item] += 1
        } else {
          res[item] += 1
        }
      }
    }

    return res
  }
  function shuffle(arr, size = arr.length) {
    lastIndex = arr.length - 1;
    for (var i = 0; i < size; i++) {
      var rand = Math.floor(Math.random() * (lastIndex - i + 1)) + i
      var temp = arr[rand]
      arr[rand] = arr[i]
      arr[i] = temp
    }
    arr.length = size
    return arr
  }
  function isNaN(val) {
    if ((val !== val) || (typeof val == 'object' && val.__proto__.constructor.name == "Number")) {
      return true;
    }
    return false;
  }
  function isNull(val) {
    if (!val && typeof val !== 'undefined' && val != 0) {
      return true
    }
    return false

  }

  function isUndefined(val) {
    if (typeof val === 'undefined') {
      return true
    }
    return false

  }

  function isNil(val) {
    if ((!val && typeof val !== 'undefined' && val != 0) || (typeof val === 'undefined')) {
      if (val !== val) {
        return false
      }
      return true
    }
    return false
  }

  function toArray(val) {
    var res = []
    if ((typeof val === 'object') || (typeof val === 'string')) {
      for (var k in val) {
        res.push(val[k])
      }
    }
    return res
  }
  function sum(arr) {
    return sumBy(arr)

  }

  function sumBy(arr, predicate = it => it) {
    predicate = iteratee(predicate)
    var sum = 0
    for (var i = 0; i < arr.length; i++) {
      sum += predicate(arr[i])
    }
    return sum
  }
  function difference(arr1, ...arr2) {     //第一个数组中存在后面所有数组中的值  则在第一个数组中将其删除
    var needArr = [].concat(...arr2)
    for (var i = 0, len = arr1.length; i < len; i++) {
      if (needArr.includes(arr1[i])) {
        arr1.splice(i, 1)
        len--;
        i--
      }
    }
    return arr1
  }
  function differenceBy(arr1, ...arr2) {
    var predicate = arr2.pop()
    if (Array.isArray(predicate)) {
      arr2.push(predicate)
      var needArr = [].concat(...arr2)
      for (var i = 0, len = arr1.length; i < len; i++) {
        if (needArr.includes(arr1[i])) {
          arr1.splice(i, 1)
          len--;
          i--
        }
      }
      return arr1
    } else {
      predicate = iteratee(predicate)
      var needArr = [].concat(...arr2)
      needArr = needArr.map(it => predicate(it))
      var needArr1 = arr1.slice()
      for (var i = 0, len = needArr1.length; i < len; i++) {
        if (needArr.includes(predicate(needArr1[i]))) {
          arr1.splice(i, 1)
          needArr1.splice(i, 1)
          len--;
          i--
        }
      }
      return arr1
    }
  }
  function differenceWith(arr1, ...arr2) {
    var predicate = arr2.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...arr2)
    var res = []
    for (var i = 0, len = arr1.length; i < len; i++) {
      var flag = true
      for (var item of needArr) {
        if (!predicate(arr1[i], item)) {
          flag = false
        }
      }
      if (!flag) {
        res.push(arr1[i])
      }
    }
    return res

  }
  function isEmpty(val) {
    if (typeof val == 'boolean' || typeof val == 'undefined' || val !== val || typeof val == 'number' || val == null) {
      return true
    }
    else {
      if (typeof val == 'object') {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            return false
          }
          else {
            return true
          }
        }
        else {
          if (Object.keys(val).length > 0) {
            return false
          } else {
            return true
          }
        }
      }
    }
  }

  function isElement(val) {
    if (Object.is(val, null) || Object.is(val, null)) {
      return false
    }
    if (val.nodeType !== undefined) {
      return true
    }
    else {
      return false
    }
  }

  function drop(arr, n = 1) {
    var res = arr.slice(n)
    return res

  }
  function dropRight(arr, n = 1) {
    return arr.slice(0, arr.length - n <= 0 ? 0 : arr.length - n)
  }

  function dropRightWhile(arr, predicate) {
    predicate = iteratee(predicate)
    var index = 0
    for (var i = arr.length - 1; i >= 0; i--) {
      if (!predicate(arr[i])) {
        index = i
        break
      }
    }
    return arr.slice(0, i + 1)
  }

  function dropWhile(arr, predicate) {
    predicate = iteratee(predicate)
    var index = 0
    for (var i = 0; i < arr.length; i++) {
      if (!predicate(arr[i])) {
        index = i
        break
      }

    }
    return arr.slice(i)
  }

  function head(arr) {
    return arr[0]
  }
  function last(arr) {
    return arr[arr.length - 1]
  }
  function indexOf(arr, val, fromIndex = 0) {
    for (var i = fromIndex; i < arr.length; i++) {
      if (arr[i] == val) {
        return i
      }
    }
    return -1
  }

  function lastIndexOf(arr, val, fromIndex = arr.length - 1) {
    for (var i = fromIndex; i >= 0; i--) {
      if (arr[i] == val) {
        return i
      }
    }
    return -1
  }
  function join(array, separator = ',') {
    var res = ''
    for (var i = 0; i < array.length; i++) {
      if (i == array.length - 1) {
        res += array[i].toString()
      }
      else {
        res += array[i].toString() + separator.toString()
      }
    }
    return res
  }

  function initial(arr) {
    return arr.slice(0, arr.length - 1)
  }


  function findIndex(arr, predicate) {
    predicate = iteratee(predicate)
    for (var i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        return i
      }
    }
    return -1
  }

  function find(arr, predicate) {
    predicate = iteratee(predicate)
    for (var item of arr) {
      if (predicate(item)) {
        return item
      }
    }
  }

  function findLastIndex(arr, predicate) {
    predicate = iteratee(predicate)
    for (var i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i]) == true) {
        return i
      }
    }
    return -1
  }

  function intersection(...arr) {
    var arr1 = arr.shift()
    var res = []
    for (var itme of arr1) {
      var flag = true
      for (var item2 of arr) {
        if (!item2.includes(itme)) {
          flag = false
        }
      }
      if (flag) {
        res.push(itme)
      }
    }
    return res
  }


  function intersectionBy(...arr) {
    var predicate = arr.pop()
    predicate = iteratee(predicate)
    var arr1 = arr.shift()
    var res = []
    arr = arr.map(it => it.map(item => predicate(item)))
    for (var itme of arr1) {
      var flag = true
      for (var item2 of arr) {
        if (!item2.includes(predicate(itme))) {
          flag = false
        }
      }
      if (flag) {
        res.push(itme)
      }
    }
    return res
  }




  function toPairs(obj) {    //toPairs({"a":1,"b":2})   [["a",1],["b",2]]
    var res = []
    for (var key in obj) {
      res.push([key, obj[key]])
    }
    return res
  }

  function fromPairs(arr) { //fromPairs([['fred', 30], ['barney', 40]]);  { 'fred': 30, 'barney': 40 }
    var obj = {}
    for (var item of arr) {
      obj[item[0]] = item[1]
    }
    return obj

  }

  function isArray(content) {
    return Object.prototype.toString.call(content) == "[object Array]"

  }

  function nth(arr, nth) {
    if (nth > 0) {
      for (var i = 0; i < arr.length; i++) {
        if (i == nth) {
          return arr[i]
        }
      }
    } else {
      needArr = arr.slice()
      needArr.reverse()
      nth = -nth
      for (var i = 0; i < needArr.length; i++) {
        if (i + 1 == nth) {
          return needArr[i]
        }
      }
    }
    return undefined
  }

  function pull(arr, ...content) {
    var res = []
    for (var item of arr) {
      if (!content.includes(item)) {
        res.push(item)
      }
    }

    return res

  }

  function pullAll(arr, ...content) {
    var res = []
    var needArr = [].concat(...content)
    for (var item of arr) {
      if (!needArr.includes(item)) {
        res.push(item)
      }
    }
    return res
  }

  function pullAllBy(arr, ...content) {
    var predicate = content.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...content)
    needArr = needArr.map(it => predicate(it))
    var res = []
    for (var item of arr) {
      if (!needArr.includes(predicate(item))) {
        res.push(item)
      }
    }
    return res
  }
  function pullAllWith(arr, ...content) {
    var predicate = content.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...content)
    var res = []
    for (var item of arr) {
      var flag = true
      for (var items of needArr) {
        if (predicate(item, items)) {
          flag = false
        }
      }
      if (flag) {
        res.push(item)
      }
    }
    return res
  }

  function intersectionWith(...arr) {
    var predicate = arr.pop()
    predicate = iteratee(predicate)
    var arr1 = arr.shift()
    var res = []
    for (var item of arr1) {
      var flag = false
      for (var items of arr) {
        for (var itemss of items) {
          console.log(itemss, item)
          if (predicate(itemss, item)) {
            flag = true
          }
        }
      }
      if (flag) {
        res.push(item)
      }
    }
    return res
  }

  function sortedIndex(arr, num) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] < num) {
        return i + 1
      }
      else if (arr[i] == num) {
        return i
      }
    }
  }

  function sortedIndexBy(arr, num, predicate) {
    predicate = iteratee(predicate)
    num = predicate(num)
    for (var i = 0; i < arr.length; i++) {
      if (predicate(arr[i]) < num) {
        return i + 1
      }
      else if (predicate(arr[i]) == num) {
        return i
      }
    }
  }

  function sortedIndexOf(arr, value) {
    for (var i = 0; i < arr.length; i++)
      if (arr[i] == value) return i
    return -1
  }


  function sortedLastIndexBy(arr, num, predicate) {
    predicate = iteratee(predicate)
    num = predicate(num)
    for (var i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i]) == num) {
        return i + 1
        break
      }
    }
    return undefined
  }

  function tail(arr) {
    arr.shift()
    return arr

  }
  function take(arr, num = 1) {
    return arr.slice(0, num)

  }
  function union(...arr) {
    var needArr = [].concat(...arr)
    var set = new Set(needArr)
    return Array.from(set)
  }

  function xor(...arr) {
    var needArr = [].concat(...arr)
    var resObj = {}
    for (var i = 0; i < needArr.length; i++) {
      if (!resObj[needArr[i]]) {
        resObj[needArr[i]] = 1
      } else {
        resObj[needArr[i]]++
      }
    }
    var res = []
    for (var key in resObj) {
      if (resObj[key] == 1) {
        res.push(Number(key))
      }
    }
    return res
  }


  function xorBy(...arr) {
    predicate = arr.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...arr)
    var obj = {}
    var resNeed = []
    //  2    1    4   2
    //[2.1, 1.2, 4.3, 2.4]
    var copyArr = needArr.map(it => predicate(it))
    for (var i = 0; i < copyArr.length; i++) {
      if (!obj[copyArr[i]]) {
        obj[copyArr[i]] = [i]
      } else {
        obj[copyArr[i]].push(i)
      }
    }
    for (var key in obj) {
      if (obj[key].length != 1) {
        for (var item of obj[key]) {
          needArr[item] = 0
        }
      }
    }
    return needArr.filter(it => it != 0)
  }
  function without(arr, ...num) {
    var res = []
    for (var item of arr) {
      if (!num.includes(item)) {
        res.push(item)
      }
    }
    return res
  }

  function xorWith(...arr) {
    predicate = arr.pop()
    predicate = iteratee(predicate)

    var needArr = [].concat(...arr)
    var res = []
    var obj = {}


  }

  function every(arr, predicate) {
    predicate = iteratee(predicate)
    for (var item of arr) {
      if (!predicate(item)) {
        return false
      }
    }
    return true
  }
  function some(arr, predicate) {
    predicate = iteratee(predicate)
    for (var item of arr) {
      if (predicate(item)) {
        return true
      }
    }
    return false
  }

  function findLast(arr, predicate) {
    predicate = iteratee(predicate)
    for (var i = arr.length; i >= 0; i--) {
      if (predicate(arr[i])) {
        return i + 1
      }
    }
    return undefined
  }
  function trim(str, code = ' ') {
    str = str.split('')
    code = code.split('')
    var res = []
    for (var item of str) {
      if (!code.includes(item)) {
        res.push(item)
      }
    }
    return res.join('')
  }

  function invert(obj) {
    var newObj = {}
    for (var key in obj) {
      newObj[obj[key]] = key
    }
    return newObj
  }

  function invertBy(obj, predicate) {
    if (arguments.length == 1) {
      var newObj = {}
      for (var key in obj) {
        if (!newObj[obj[key]]) {
          newObj[obj[key]] = [key]
        } else {
          newObj[obj[key]].push(key)
        }
      }
    } else {
      predicate = iteratee(predicate)
      var newObj = {}
      for (var key in obj) {
        if (!newObj[predicate(obj[key])]) {
          newObj[predicate(obj[key])] = [key]
        } else {
          newObj[predicate(obj[key])].push(key)
        }
      }
    }

    return newObj
  }


  function keysIn(obj) {
    var arr = []
    for (var key in obj) {
      arr.push(key)
    }
    return arr
  }
  function mapKeys(obj, predicate) {


  }
  function size(content) {
    if (typeof content == 'string' || Array.isArray(content)) {
      return content.length
    } else if (typeof content == 'object') {
      var arr = Object.keys(content)
      return arr.length
    }
  }

  function defer(func, ...args) {
    var timer = setTimeout(() => {
      func(...args)
    })
    return timer - 1

  }
  function toLower(str) {
    str = str.split('')
    var res = []
    for (var i = 0; i < str.length; i++) {
      var item = str[i]
      item = item.charCodeAt()
      if (item >= 65 && item <= 90) {
        item += 32
      }
      item = String.fromCharCode(item)
      res.push(item)
    }
    res = res.join('')
    return res
  }
  function toUpper(str) {
    str = str.split('')
    var res = []
    for (var i = 0; i < str.length; i++) {
      var item = str[i]
      item = item.charCodeAt()
      if (item >= 97 && item <= 122) {
        item -= 32
      }
      item = String.fromCharCode(item)
      res.push(item)
    }
    res = res.join('')
    return res
  }
  function startsWith(str = '', target, position = 0) {
    str = str.split('')
    return str[position] == target
  }
  function replace(str, target, replacer) {
    str = str.split(target)
    str = str.join(replacer)
    return str
  }
  function pad(str = '', length = 0, chars = ' ') {


  }

  function repeat(str = '', count = 0) {
    var str1 = str
    if (count == 0) {
      return ''
    }
    for (var i = 0; i < count - 1; i++) {
      str += str1
    }
    return str
  }

  function sample(content) {
    if (Array.isArray(content)) {
      var index = Math.floor(Math.random() * (content.length - 0 + 1)) + 0
      return content[index]
    } else if (typeof content == 'object') {
      var arr = Object.keys(content)
      var index = Math.floor(Math.random() * (content.length - 0 + 1)) + 0
      return content[arr[index]]
    }
  }

  function reject(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var item of arr) {
      if (!predicate(item)) {
        res.push(item)
      }
    }
    return res
  }

  function partition(arr, predicate) {
    predicate = iteratee(predicate)
    var trueArr = []
    var falseArr = []
    for (var item of arr) {
      if (predicate(item)) {
        trueArr.push(item)
      }
      else {
        falseArr.push(item)
      }
    }

    return [trueArr, falseArr]

  }

  function includes(content, target, index = 0) {
    if (typeof content == 'string') {
      var startContent = content
      resContent = content.split(target)
      if (resContent != startContent) {
        return true
      }
    } else if (Array.isArray(content)) {
      for (var i = index; i < content.length; i++) {
        if (content[i] == target) {
          return true
        }
      }

    } else if (typeof content == 'object') {
      for (var key in content) {
        if (content[key] == target) {
          return true
        }
      }
    }
    return false
  }

  function invokeMap(collection, methodas, ...args) {
    if (typeof methodas == 'string') {
      return collection.map(val => {
        return val[methodas](...args)
      });
    } else if (typeof methodas == 'function') {
      return collection.map(val => methodas.call(val, ...args));
    }
  }

  function flatMap(arr, predicate) {


  }
  function takeRight(arr, num = 1) {
    var res = []
    for (var i = arr.length - 1; i >= arr.length - num; i--) {
      res.push(arr[i])
    }
    return res.reverse().filter(it => it != undefined)
  }

  function takeRightWhile(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i])) {
        res.push(arr[i])
      }
      else {
        break
      }
    }
    return res.reverse().filter(it => it != undefined)
  }

  function takeWhile(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        res.push(arr[i])
      }
      else {
        break
      }
    }
    return res.filter(it => it != undefined)
  }



  function sortedUniq(arr) {
    var set = new Set(arr)
    var resArr = Array.from(set)
    return resArr.sort((a, b) => {
      return a - b
    })
  }

  function sortedUniqBy(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var item of arr) {
      if (!res.map(it => predicate(it)).includes(predicate(item))) {
        res.push(item)
      }
    }
    return res.sort((a, b) => {
      return a - b
    })
  }
  function unionBy(...arr) {
    var predicate = arr.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...arr)
    var res = []
    for (var item of needArr) {
      if (!res.map(it => predicate(it)).includes(predicate(item))) {
        res.push(item)
      }
    }
    return res
  }
  function sortedIndexOf(arr, val) {
    return sortedIndex(arr, val)
  }

  function sortedLastIndex(arr, val) {
    var index = 0
    for (var i = arr.length; i >= 0; i--) {
      if (arr[i] == val) {
        return index = i + 1
        break
      }
    }
    return undefined
  }
  function sortedLastIndexOf(arr, val) {
    var index = 0
    for (var i = arr.length; i >= 0; i--) {
      if (arr[i] == val) {
        return index = i
        break
      }
    }
    return undefined
  }


  function zipObject(arr1, arr2) {
    var obj = {}
    for (var i = 0; i < arr1.length; i++) {
      obj[arr1[i]] = arr2[i]
    }
    return obj
  }

  function zipObjectDeep(arr1, arr2) {

  }



  function unionWith(...arr) {
    predicate = arr.pop()
    predicate = iteratee(predicate)
    var needArr = [].concat(...arr)
    var res = []
    for (var item of needArr) {
      var flag = true
      for (var items of res) {
        if (predicate(items, item)) {
          flag = false
        }
      }
      if (flag) {
        res.push(item)
      }
    }
    return res
  }

  function uniqBy(arr, predicate) {
    predicate = iteratee(predicate)
    var compareArr = []
    var needArr = []
    for (var item of arr) {
      if (!compareArr.includes(predicate(item))) {
        compareArr.push(predicate(item))
        needArr.push(item)
      }
    }
    return needArr
  }

  function uniqWith(arr, predicate) {
    predicate = iteratee(predicate)
    var res = []
    for (var item of arr) {
      var flag = true
      for (var items of res) {
        if (predicate(items, item)) {
          flag = false
        }
      }
      if (flag) {
        res.push(item)
      }
    }
    return res
  }







  return {
    chunk: chunk,
    compact: compact,
    concat: concat,
    uniq: uniq,
    reject: reject,
    uniqueBy: uniqueBy,
    uniqWith: uniqWith,
    flattenDepth: flattenDepth,
    flattenDeep: flattenDeep,
    groupBy: groupBy,
    zipObject: zipObject,
    keyBy: keyBy,
    uniqBy: uniqBy,
    forEach: forEach,////////////
    filter: filter,///////////////
    map: map,///////////////
    reduce: reduce,/////////////
    reduceRight: reduceRight,
    zip: zip,
    unzip: unzip,
    keys: keys,
    sortedUniq: sortedUniq,
    sortedUniqBy: sortedUniqBy,
    values: values,
    sortBy: sortBy,////////////
    isEqual: isEqual,//////
    fill: fill,
    reverse: reverse,
    countBy: countBy,
    shuffle: shuffle,
    isNaN: isNaN,
    isNull: isNull,
    isNil: isNil,
    isUndefined: isUndefined,
    toArray: toArray,
    sum: sum,
    sumBy: sumBy,
    difference: difference,
    differenceBy: differenceBy,
    differenceWith: differenceWith,
    isEmpty: isEmpty,
    isElement: isElement,
    dropRight: dropRight,
    dropRightWhile: dropRightWhile,
    dropWhile: dropWhile,
    drop: drop,
    fromPairs: fromPairs,
    head: head,
    indexOf: indexOf,
    initial: initial,
    join: join,
    last: last,
    lastIndexOf: lastIndexOf,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    flatten: flatten,
    isArray: isArray,
    intersection: intersection,
    intersectionBy: intersectionBy,
    intersectionWith: intersectionWith,
    toPairs: toPairs,
    nth: nth,
    pull: pull,
    pullAll: pullAll,
    pullAllBy: pullAllBy,
    pullAllWith: pullAllWith,
    sortedIndex: sortedIndex,
    sortedIndexBy: sortedIndexBy,
    sortedLastIndexOf: sortedLastIndexOf,
    sortedLastIndex: sortedLastIndex,
    sortedIndexOf: sortedIndexOf,
    sortedLastIndexBy: sortedLastIndexBy,
    tail: tail,
    take: take,
    takeRight: takeRight,
    takeRightWhile: takeRightWhile,
    takeWhile: takeWhile,
    union: union,
    unionBy: unionBy,
    unionWith: unionWith,
    unzipWith: unzipWith,
    without: without,
    xor: xor,
    every: every,
    xorBy: xorBy,
    zipObjectDeep: zipObjectDeep,
    // zipWith: zipWith,
    find: find,
    findLast: findLast,
    flatMap: flatMap,
    // flatMapDeep: flatMapDeep,
    // flatMapDepth: flatMapDepth,
    forEachRight: forEachRight,
    includes: includes,
    invokeMap: invokeMap,
    // orderBy: orderBy,
    partition: partition,
    // reject: reject,
    // sampleSize: sampleSize,
    size: size,
    some: some,
    // delay: delay,
    get: get,
    // bind: bind,
    matches: matches,
    property: property,
    isMatch: isMatch,
    matchesProperty: matchesProperty,
    toPath: toPath,
    trim: trim,
    invert: invert,
    invertBy: invertBy,
    keysIn: keysIn,
    defer: defer,
    toLower: toLower,
    toUpper: toUpper,
    pad: pad,
    repeat: repeat,
    replace: replace,
    startsWith: startsWith,
    sample: sample,

  }

}()



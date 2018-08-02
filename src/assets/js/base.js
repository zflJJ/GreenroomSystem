export const add0 = m => {
  return m < 10 ? '0' + m : m
}
export const format = shijianchuo => {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return (
    y +
    '-' +
    add0(m) +
    '-' +
    add0(d) +
    ' ' +
    add0(h) +
    ':' +
    add0(mm) +
    ':' +
    add0(s)
  )
}

export const dispostTime = item => {
  // console.log(item)
  // let miunte = ''
  if (item.startTime != '' && item.endTime == '') {
    return
  } else if (item.startTime == '' && item.endTime != '') {
    item.messageInfo = '请录入开始时间，谢谢'
    item.miunte = ''
  } else if (item.startTime && item.endTime) {
    let start_time = item.startTime.split(':')
    let end_time = item.endTime.split(':')
    // console.log(start_time, end_time)
    let startHours = Number(start_time[0])
    let endHours = Number(end_time[0])
    let startMin = Number(start_time[1])
    let endMin = Number(end_time[1])
    // 小时数相等的时候
    if (startHours == endHours) {
      if (startMin == endMin) {
        item.messageInfo = '当前时间不合法'
        item.miunte = ''
      } else if (startMin > endMin) {
        item.messageInfo = '次日'
        item.miunte = 24 * 60 - Number(startMin - endMin)
        // console.log(miunte)
      } else {
        item.miunte = Number(endMin - startMin)
        // console.log(miunte)
        item.messageInfo = '当天'
      }
    } else if (startHours < endHours) {
      // 开始时间 < 结束时间
      item.messageInfo = '当天'
      if (startMin == endMin) {
        item.miunte = Number(endHours - startHours) * 60
        // console.log(miunte)
      } else if (startMin < endMin) {
        item.miunte =
          Number(endHours - startHours) * 60 + Number(endMin - startMin)
        // console.log(miunte)
      } else if (startMin > endMin) {
        item.miunte =
          Number(endHours - startHours) * 60 + Number(startMin - endMin)
        // console.log(miunte)
      }
    } else if (startHours > endHours) {
      // 开始时间  > 结束时间
      item.messageInfo = '次日'
      if (startMin == endMin) {
        item.miunte = Number(endHours + 24 - startHours) * 60
      } else if (startMin < endMin) {
        item.miunte =
          Number(endHours + 24 - startHours) * 60 + Number(endMin - startMin)
      } else if (startMin > endMin) {
        item.miunte =
          Number(endHours + 24 - startHours) * 60 + Number(startMin - endMin)
      }
    }
    // console.log(item)
  }
}

/**
 * @function 对提交的时间做校验
 * @returns flag  校验成功与否   arr为一个数组
 * @param  item 表示传递过来的一个数组对象
 *  怎么处理  对时间判断， 是否超过24 小时
 *  对 startTime 和 endtime 判断是否为空
 *  对 messageInfo 判断是   z正确是否
 */
export const proofTime = params => {
  // 怎么处理  对时间判断， 是否超过24 小时
  // 对 startTime 和 endtime 判断是否为空
  // 对 messageInfo 判断是   z正确是否
  // startTime: '',
  //   endTime: '',
  //     messageInfo: '',
  //       miunte: '',
  let arr = [],
    flag = false,
    miuntes = 0
  for (let item of params) {
    if (
      !item.startTime ||
      !item.endTime ||
      !item.messageInfo ||
      !item.miunte ||
      item.messageInfo == '请录入开始时间，谢谢' ||
      item.messageInfo == '当前时间不合法'
    ) {
      return {
        arr: arr,
        flag: flag
      }
    } else {
      arr.push(item.startTime + '-' + item.endTime)
      miuntes = miuntes + item.miunte
    }
  }
  if (miuntes >= 1440) {
    arr = []
    return {
      arr: arr,
      flag: flag
    }
  } else {
    flag = true
    return {
      arr: arr,
      flag: flag
    }
  }
}

/**
 * @function 用来验证天数和时间
 * @param  day  时间 对象
 * @param fee 费用 对象
 */
export const dataValidation = (day, fee) => {
  console.log(day)
  // 天数判断  和 金额设置
  let flag = false
  let packageAmount = ''
  let arritem = []
  // if (
  //   (!day.day1 &&
  //     !day.day2 &&
  //     !day.day3 &&
  //     !day.day4 &&
  //     !day.day5 &&
  //     !day.day6) ||
  //   (fee.day1=='' && fee.day2=='' && fee.day3=='' && fee.day4=='' && fee.day5=='' && fee.day6=='')
  // ) {
  //   packageAmount = '天数 和 金额 的设置 不能为空'
  //   return { flag: flag, packageAmount: packageAmount }
  // }
  if (
    !day.day1 &&
    !day.day2 &&
    !day.day3 &&
    !day.day4 &&
    !day.day5 &&
    !day.day6
  ) {
    packageAmount = '天数需输入大于等于1整数'
    return { flag: flag, packageAmount: packageAmount }
  } else if (
    fee.day1 == '' &&
    fee.day2 == '' &&
    fee.day3 == '' &&
    fee.day4 == '' &&
    fee.day5 == '' &&
    fee.day6 == ''
  ) {
    packageAmount = '金额需输入大于等于0的整数'
    return { flag: flag, packageAmount: packageAmount }
  }
  // 逻辑是： 判断天数 是否为空 不为空的时候在判断 数据的首个是否为0   不满足就会返回数据
  // 存在的天数，先存储到一个数组中  存储的是 day?
  for (let item in day) {
    if (day[item]) {
      if (day[item][0] != 0) {
        arritem.push(item)
      } else {
        packageAmount = '天数需输入大于等于1整数'
        return { flag: flag, packageAmount: packageAmount }
      }
    }
  }

  // 判断对应的 费用 是否满足当前是否为空  并且首个不为0的要求
  for (let i = 0, len = arritem.length; i < len; i++) {
    let items = arritem[i]
    console.log(fee[items], fee[items][0])
    if (fee[items] != '') {
      continue
    } else {
      packageAmount = '金额需输入大于等于0的整数'
      return { flag: flag, packageAmount: packageAmount }
    }
  }

  // 到了这里开始处理数据
  let dayItemArr = [],
    feeItemArr = []
  for (let i = 0, len = arritem.length; i < len; i++) {
    let item = arritem[i]
    dayItemArr.push(day[item])
    feeItemArr.push(fee[item])
  }
  flag = true
  packageAmount = dayItemArr.join(',') + '-' + feeItemArr.join(',')
  return { flag: flag, packageAmount: packageAmount }
}

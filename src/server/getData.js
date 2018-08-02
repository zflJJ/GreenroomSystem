import axios from 'axios';
import { getAxios } from './axios.js';
import baseUrl from './baseURL';

const URL = baseUrl.requestUrl;

//获取地区列表的数据 area/{parentId}
export const getAreaId = (id) => {
  let data = getAxios('get',
    URL + 'area/' + id
  );
  return data;
};

//获取小区详情 parklot/{id}
export const getParklotId = (id) => {
  let data = getAxios('get',
    URL + 'parklot/'+id
  );
  return data;
};


// 小区删除图片  parklot/pic/remove
export const removeImgId = (params) => {
  let data = getAxios('post',
    URL + 'parklot/pic/remove',params);
  return data;
};

//提交预约费用 fee/rule/add/reserve
export const setReserveData= (params) => {
  let data = getAxios('post',
    URL + 'fee/rule/add/reserve',params
  );
  return data;
};

//提交预约费用 fee/rule/add/parking
export const setParkingData = (params) => {
  let data = getAxios('post',
    URL + 'fee/rule/add/parking',params
  );
  return data;
};

// 获取预约费用 fee/rule/reserve/pageable
export const getReserveData = (params) => {
  let data = getAxios('post',
    URL + 'fee/rule/reserve/pageable',params
  );
  return data;
};

// 获取停车费用 getParkingData fee/rule/parking/pageable
export const getParkingData = (params) => {
  let data = getAxios('post',
    URL + 'fee/rule/parking/pageable',params
  );
  return data;
};
//获取个人常用车场信息
export const getMyUsualParks = (userId) => {
  let data = getAxios('post',
    URL + 'apiread/parklot/usual/get', {
      user_id: userId,
      timestamp: String(new Date().getTime()),
    }
  );
  return data;
};

//设置个人常用停车场
export const setMyUsualParks = (userId, parklotId) => {
  let data = getAxios('post',
    URL + 'apiwrite/parklot/usual/set', {
      user_id: userId,
      parklot_id: parklotId,
      timestamp: String(new Date().getTime()),
    }
  );
  return data;
};




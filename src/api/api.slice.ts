import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {trackPromise} from 'react-promise-tracker';

import {handleAxiosError, reactApi} from './utils';
import {Authorization} from './types';
import {setData} from './apiStore';
import {useSelector} from 'react-redux';

const REACT_APP_LARAVEL_BACKEND = 'https://api.sultangold.net/public/api';

const login = createAsyncThunk(
  'authorization/login',
  async (body: any, {dispatch, rejectWithValue}) => {
    try {
      const result = await trackPromise(
        reactApi({
          type: 'POST',
          data: body,
          url: `${REACT_APP_LARAVEL_BACKEND}/auth/login`,
        }),
      );
      if (result.status === 200) {
        dispatch(setData(result.data));
      }
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const register = createAsyncThunk(
  'authorization/registerApi',
  async (body: any, {rejectWithValue}) => {
    try {
      const result = await trackPromise(
        reactApi({
          type: 'POST',
          data: body,
          url: `${REACT_APP_LARAVEL_BACKEND}/auth/register`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllCategories = createAsyncThunk(
  'client/getAllCategories',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/category/getAllData`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getCategoryById = createAsyncThunk(
  'client/getCategoryById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/category/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getItemByCategoryId = createAsyncThunk(
  'client/getItemByCategoryId',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/item-by-category/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getItemOncePriceLatest = createAsyncThunk(
  'client/getItemOncePriceLatest',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/prices/item-once-price/latest`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getCart = createAsyncThunk(
  'user/getCart',
  async (tokenProp: any, {rejectWithValue, getState}: any) => {
    try {
      const token = tokenProp;
      console.log('token:', JSON.stringify(token, null, 2));
      console.log('token2:', JSON.stringify(tokenProp, null, 2));
      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/cart/get`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const geItemById = createAsyncThunk(
  'admin/geItemById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/item-by-id/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const geItemImagesById = createAsyncThunk(
  'client/geItemImagesById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/item-image/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const removeCart = createAsyncThunk(
  'user/removeCart',
  async (body: any, {rejectWithValue}: any) => {
    try {
      const token = body?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'DELETE',
          url: `${REACT_APP_LARAVEL_BACKEND}/cart/delete/${body?.id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllNews = createAsyncThunk(
  'client/getAllNews',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/news/getAllData`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getNewById = createAsyncThunk(
  'client/getNewById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/getNew/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllNewsCategoryById = createAsyncThunk(
  'client/getAllNewsCategoryById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/news-category/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getNewArticleById = createAsyncThunk(
  'client/getNewArticleById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/new-article/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllTips = createAsyncThunk(
  'client/getAllTips',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/tips/getAllData`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getTipById = createAsyncThunk(
  'client/getTipById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/tips/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllTipsCategoryById = createAsyncThunk(
  'client/getAllTipsCategoryById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/tips-by-tip-category/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getTipArticleById = createAsyncThunk(
  'client/getTipArticleById',
  async (id: any, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/tip-article/${id}`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getInternationalGoldPriceLatest = createAsyncThunk(
  'client/getInternationalGoldPriceLatest',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/prices/international-price/latest`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getOfferItem = createAsyncThunk(
  'client/getOfferItem',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/offer/getItem`,
        }),
      );

      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllItems = createAsyncThunk(
  'client/getAllItems',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/allItems`,
        }),
      );

      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getAllSlider = createAsyncThunk(
  'client/getAllSlider',
  async (_, {rejectWithValue, getState}: any) => {
    try {
      const token = getState()?.authorization?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/home-page/slider/getAllData`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const addCart = createAsyncThunk(
  'user/addCart',
  async (body: any, {rejectWithValue, getState}: any) => {
    try {
      const token = body?.token;

      const result = await trackPromise(
        reactApi({
          token,
          type: 'POST',
          data: body?.data,
          url: `${REACT_APP_LARAVEL_BACKEND}/cart/add`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

const getUserOrder = createAsyncThunk(
  'user/rejectOrder',
  async (token: any, {rejectWithValue, getState}: any) => {
    try {
      const result = await trackPromise(
        reactApi({
          token,
          type: 'GET',
          url: `${REACT_APP_LARAVEL_BACKEND}/user/get-orders`,
        }),
      );
      return result;
    } catch (e) {
      return rejectWithValue(handleAxiosError(e as AxiosError<any>));
    }
  },
);

export const authorizationActions = {
  login,
  register,
  getAllCategories,
  getCategoryById,
  getItemByCategoryId,
  getItemOncePriceLatest,
  getCart,
  geItemById,
  geItemImagesById,
  removeCart,
  addCart,
  getAllNews,
  getNewById,
  getAllNewsCategoryById,
  getNewArticleById,
  getAllTips,
  getTipById,
  getAllTipsCategoryById,
  getTipArticleById,
  getInternationalGoldPriceLatest,
  getOfferItem,
  getAllItems,
  getAllSlider,
  getUserOrder,
};

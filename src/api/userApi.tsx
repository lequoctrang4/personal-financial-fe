import axios from "axios";
import { URL } from "@env";

export const checkTokenExpired = async (token: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/checkTokenExpired`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const signIn = async (formValue: {
  email: string | undefined;
  phone_number: string | undefined;
  password: string;
}) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/signIn`,
      data: formValue,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const signUp = async (formValue: {
  phone_number?: string;
  user_name?: string;
  email: string;
  identification?: string;
  password: string;
  confirm_password?: string;
}) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/signUp`,
      data: formValue,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const changePassword = async (
  token: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const res = await axios({
      method: "patch",
      url: `${URL}/changePassword`,
      data: { oldPassword, newPassword, confirmPassword },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const setProfile = async (
  token: string,
  phone_number: string,
  name: string,
  id: string
) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/setProfile`,
      data: { phone_number, name, id },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const deleteUser = async (token: string) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${URL}/deleteUser`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const createGrantToken = async (
  formValue: { url: string },
  token: string
) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/createGrantToken`,
      data: formValue,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getBankhubToken = async (
  formValue: {
    public_token: string;
    number_month: number;
  },
  token: string
) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/getBankhubToken`,
      data: formValue,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getAccounts = async (token: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/account/getAccounts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getAllTransactions = async (
  token: string,
  fromDate: string | undefined,
  toDate: string | undefined,
  castIn: number | undefined,
  castOut: number | undefined,
  limit: number | undefined,
  message?: string | undefined,
  offset?: number | undefined,
  account_number?: string | undefined
) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getAllTransactions?${
        fromDate && toDate ? "fromDate=" + fromDate + "&toDate=" + toDate : ""
      }&${castIn ? "castIn=" + castIn : ""}&${
        castOut ? "castOut=" + castOut : ""
      }&${message ? "message=" + message : ""}&${
        limit ? "limit=" + limit : ""
      }&${offset ? "offset=" + offset : ""}&${
        account_number ? "account_number=" + account_number : ""
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const searchTransaction = async (
  token: string,
  fromDate: string | undefined,
  toDate: string | undefined,
  limit: number | undefined,
  message?: string | undefined
) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/searchTransaction?${
        fromDate && toDate ? "fromDate=" + fromDate + "&toDate=" + toDate : ""
      }&${message ? "message=" + message : ""}&${
        limit ? "limit=" + limit : ""
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getBalanceUserInMonth = async (
  token: string,
  month: number,
  year: number
) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getBalanceUserInMonth/${month}/${year}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getBalanceUserInDate = async (token: string, day: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getBalanceUserInDate/${day}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getDataAnalysisLinearChart = async (
  token: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getDataAnalysisLinearChart?fromDate=${fromDate}&toDate=${toDate}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getDataAccumulatedLinearChart = async (
  token: string,
  fromDate: string,
  toDate: string
) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getDataAccumulatedLinearChart?fromDate=${fromDate}&toDate=${toDate}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const deleteAccounts = async (
  token: string,
  id_financial: number,
  id_account: number
) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${URL}/account/deleteAccount?id_financial=${id_financial}&id_account=${id_account}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getAllFiAccount = async (token: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getAllFiAccount`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const syncTransaction = async (token: string, fi_account_id: number) => {
  try {
    const res = await axios({
      method: "patch",
      url: `${URL}/syncTransaction`,
      data: { fi_account_id },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const getProfile = async (token: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `${URL}/getProfile`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const signInWithGoogle = async (googleToken: string) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/signInWithGoogle`,
      data: { googleToken },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};


export const createOTP = async (email: string) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/createOTP`,
      data: { email },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const verifiedOTP = async (email: string, otp: string) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/verifiedOTP`,
      data: { email, otp},
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const createNewPassword = async (password: string, token: string) => {
  try {
    const res = await axios({
      method: "patch",
      url: `${URL}/createNewPassword`,
      data: { password },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const createPaymentLink = async () => {
  try {
    const res = await axios({
      method: "post",
      url: `http://localhost:3002/order/create`,
      data: { },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
};

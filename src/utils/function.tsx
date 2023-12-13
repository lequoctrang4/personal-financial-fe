import AsyncStorage from "@react-native-async-storage/async-storage";

export function isValidEmail(value: string) {
  let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(value);
  return value && valid;
}

export const storeData = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
  console.log("Dữ liệu đã được lưu trữ thành công");
};

export const setObjectValue = async (key: string, value: string[]) => {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
  console.log("Dữ liệu Object đã được lưu trữ thành công");
};

// Truy xuất dữ liệu
export const getData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  // console.log(value);
  return value;
};

export const getMyObject = async (key: string) => {
  const jsonValue = await AsyncStorage.getItem(key);
  if (jsonValue !== null) {
    return JSON.parse(jsonValue);
  } else {
    console.log("Không tìm thấy dữ liệu Object");
    return null;
  }
};

// Xóa dữ liệu
export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
  console.log("Dữ liệu đã được xóa thành công, trường dữ liệu: ", key);
};

export const removeObject = async (key: string) => {
  await AsyncStorage.removeItem(key);
  console.log("Xóa Object thành công");
};

// Ví dụ sử dụng
export const performAsyncOperations = async () => {
  console.log("Bắt đầu");
  await storeData("myKey", "Hello, AsyncStorage!");
  await getData("myKey");
  await removeData("myKey");
  console.log("Kết thúc");
};

export const formatArray = async (arr: any) => {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i].search) === -1) {
      newArr.push(arr[i].search);
    }
  }
  console.log("Dữ liệu mảng định dạng: ", newArr);
  return newArr;
};

export const currencyFormat = (num: number) => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const getTime = (month: any) => {
  let date: any = new Date().getDate();
  let year: any = new Date().getFullYear();
  if (month <= 9) {
    month = "0" + month.toString();
  }
  if (date <= 9) {
    date = "0" + date;
  }
  if (
    month == 1 ||
    month == 3 ||
    month == 5 ||
    month == 7 ||
    month == 8 ||
    month == 10 ||
    month == 12
  ) {
    if (date >= 32) {
      date = 31;
    }
  } else {
    if (date >= 31) {
      date = 30;
    }
  }
  return year + "-" + month + "-" + date;
};

export const getLastDateofBeforeMonth = () => {
  var d = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  let date = d.toString().slice(8, 10);
  let month = d.toString().slice(4, 7);
  let year = d.toString().slice(13, 15);
  switch (month) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
    default:
      break;
  }
  return date + "/" + month + "/" + year;
};

export const getDateofBeforeMonth = (monthPara: any) => {
  var d = new Date(new Date().getFullYear(), monthPara, 0);
  let date = d.toString().slice(8, 10);
  let month = d.toString().slice(4, 7);
  let year = d.toString().slice(11, 15);
  switch (month) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
    default:
      break;
  }
  return year + "-" + month + "-" + date;
};

export const getDateofCurrentMonth = (monthPara: any) => {
  var d = new Date(new Date().getFullYear(), monthPara, 0);
  let date = d.toString().slice(8, 10);
  let month = d.toString().slice(4, 7);
  let year = d.toString().slice(11, 15);
  switch (month) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
    default:
      break;
  }
  return year + "-" + month + "-" + date;
};
export const getBeforeMonth = (month2: any) => {
  let m = `${month2}`;
  let year = new Date().getFullYear();

  return m + "/" + year;
};

export const FormatDate = (data: any) => {
  let date = data.slice(8, 10);
  let month = data.slice(5, 7);
  let year = data.slice(2, 4);

  return date + "/" + month + "/" + year;
};

export const FormatDateCalendar = (data: any) => {
  let date = data.slice(8, 10);
  let month = data.slice(5, 7);
  let year = data.slice(0, 4);

  return year + "-" + month + "-" + date;
};

export const FormatThu = (data: any) => {
  let date = data.slice(8, 10);
  let month = data.slice(5, 7);
  let year = data.slice(0, 4);

  let d = new Date(year, month - 1, date);

  let Thu = d.toString().slice(0, 3);
  switch (Thu) {
    case "Mon":
      Thu = "Thứ Hai";
      break;
    case "Tue":
      Thu = "Thứ Ba";
      break;
    case "Wed":
      Thu = "Thứ Tư";
      break;
    case "Thu":
      Thu = "Thứ Năm";
      break;
    case "Fri":
      Thu = "Thứ Sáu";
      break;
    case "Sat":
      Thu = "Thứ Bảy";
      break;
    case "Sun":
      Thu = "Chủ Nhật";
      break;
    default:
      break;
  }
  return Thu;
};

export function formatMoney(amount: number): string {
  const suffixes: string[] = ["", "k", "m", "b"];
  let suffixIndex: number = 0;

  while (amount >= 1000 && suffixIndex < suffixes.length - 1) {
    amount /= 1000;
    suffixIndex++;
  }

  const roundedAmount: number = Math.round(amount);

  let formattedAmount: string;
  if (suffixIndex > 0) {
    formattedAmount = roundedAmount.toString() + suffixes[suffixIndex];
  } else {
    formattedAmount = roundedAmount.toString();
  }

  return formattedAmount;
}

export const currentRouteName = ({ routeName }: { routeName: any }) => {
  return routeName;
};

export const timeCurrent = () => {
  let curYear = new Date().getFullYear();
  let curMonth: any = String(new Date().getMonth() + 1).padStart(2, "0");
  let curDate: any = String(new Date().getDate()).padStart(2, "0");
  let curHour: any = String(new Date().getHours()).padStart(2, "0");
  let curMinute: any = String(new Date().getMinutes()).padStart(2, "0");
  let curSecond: any = String(new Date().getSeconds()).padStart(2, "0");

  return (
    curYear +
    "-" +
    curMonth +
    "-" +
    curDate +
    " " +
    curHour +
    ":" +
    curMinute +
    ":" +
    curSecond
  );
};
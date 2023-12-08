import { removeData } from "./function";
// import { setAlert } from "../redux/alert";
// import { useDispatch } from "react-redux";
export function handleError(error: any, setAlert: any, dispatch: any, navigation: any) {
  // const dispatch = useDispatch();
 if (error.message === "Bạn không có phân quyền truy cập vào dữ liệu!") {
   removeData("token");
   dispatch(
     setAlert({
       showConfirm: false,
       showCancel: true,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
         navigation.navigate("SignIn");
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       confirmTextColor: undefined,
       cancelText: "Đăng nhập",
       title: "Phiên đăng nhập đã hết hạn!",
       message: "Vui lòng đăng nhập lại!",
       show: true,
     })
   );
 } else if (error.message === "Bạn chưa liên kết tài khoản") {
   dispatch(
     setAlert({
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
         navigation.navigate("AddAccount");
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       confirmTextColor: undefined,
       confirmText: "Thêm tài khoản",
       title: "Bạn chưa liên kết tài khoản!",
       message: "Vui lòng liên kết tài khoản!",
       show: true,
     })
   );
 } else if (error.message === "Liên kết tài khoản thất bại") {
   dispatch(
     setAlert({
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       confirmText: "Quay lại",
       title: "Liên kết tài khoản thất bại!",
       message: "Vui lòng thử lại sau!",
       show: true,
     })
   );
   navigation.navigate("Home");
 } else if (error.message === "Tài khoản ngân hàng đã được liên kết!") {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       confirmText: "Quay lại",
       title: "Tài khoản đã được liên kết trước đó",
       message: "",
       show: true,
     })
   );
   navigation.navigate("Home");
 } else if (error.message === "Không có giao dịch!") {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       confirmText: "Quay lại",
       title: "Không tìm thấy giao dịch",
       message: "",
       show: true,
     })
   );
 } else if (error.message === "Email không đúng!") {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       confirmText: "Quay lại",
       title: "Email không đúng",
       message: "Vui lòng nhập lại",
       show: true,
     })
   );
 } else if (error.message === "Người dùng không tồn tại") {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       confirmText: "Quay lại",
       title: "Email không tồn tại",
       message: "Vui lòng nhập email đã được đăng ký",
       show: true,
     })
   );
 } else if (error.message === "Mã xác thực không đúng") {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: true,
       showCancel: false,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       confirmText: "Quay lại",
       title: "Mã xác thực không đúng",
       message: "Vui lòng nhập lại",
       show: true,
     })
   );
 } else {
   dispatch(
     setAlert({
       onConfirmPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       onCancelPressed: () => {
         dispatch(setAlert({ show: false }));
       },
       showConfirm: false,
       showCancel: true,
       confirmButtonColor: undefined,
       cancelButtonColor: undefined,
       cancelTextColor: undefined,
       confirmTextColor: undefined,
       cancelText: "Ok",
       title: "Something went wrong!",
       message: "Vui lòng thử lại sau!",
       show: true,
     })
   );
 }
}

export interface alertType {
  show: boolean;
  title?: string;
  message?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancelPressed?: () => void;
  onConfirmPressed?: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  confirmTextColor?: string;
  cancelTextColor?: string;
  onDismiss?: () => void;
  customView?: React.ReactNode | JSX.Element;
  titleStyle?: any 
}
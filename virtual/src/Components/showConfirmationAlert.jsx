import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


export const showConfirmationAlert = (title, text, icon, showCancelButton = false, confirmButtonText = 'OK', cancelButtonText = 'Cancel') => {
    return MySwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
  };

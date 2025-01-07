import {toast} from "react-toastify";

const errorMiddleware = ({ dispatch }) => next => action => {
    if (action.error || action.payload instanceof Error) {
        const errorMessage = action.payload || 'Произошла ошибка';
        toast.error(errorMessage);
    }
    return next(action);
};

export default errorMiddleware;
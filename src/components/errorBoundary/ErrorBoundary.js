//Отлавливаем ошибки, чтобы при их появлении работал другой код и сайт не падал
import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    //static getDerivedStateFromError(error) {//Умеет только обновлять состояния
    //    return {error: true};
    //}

    componentDidCatch(error, errorInfo) {//Будет рабоотать, если будет ошибка
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {//Условие работы
        if (this.state.error) {
            return <ErrorMessage/>
        }
        //БУдет работать, кода не будет ошибок
        return this.props.children;
    }
}

export default ErrorBoundary;
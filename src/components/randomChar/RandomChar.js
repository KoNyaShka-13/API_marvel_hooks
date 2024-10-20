import { Component } from 'react';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelServices';
  
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    //constructor(props) {//Чтобы новый персонаж отобразился, данный вариант не правильный со стороны семантики, потом его изменю
    //    super(props);
    //    this.updateChar();
    //}
    state = {
    //    name: null,
    //    description: null,
    //    thumbnail: null,
    //    homepage: null,
    //    wiki: null
        char: {},
        loading: true,
        error: false
    }

     marvelService = new MarvelService();//Этим действием создаем новое свойство

     componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {//При вводе имени персонажа добавляем окно загрузки, чтобы окно не пустовало
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({ 
            loading: false,
            error: true
        })
    }

    updateChar = () => {//Для получения рандомного героя 
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);//Рандомайзер
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)//Получаем данные при помощи кода, что в MarbelServices
            .catch(this.onError);//Ловим ошибку и срабатывает функция onError
    }
    
    render() {//В этой части логика
        const {char, loading, error} = this.state;//Из свойства char мы вытаскиваем нужные нам свойства именно в данной функции, в другом месте можем вытащить другие свойства
        const errorMessage = error ? <ErrorMessage/> : null;//Создаем здесь условия, чтобы не засорять верстку, а так, данную логику разрешено размещать в верстке
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
//        if (loading) {
//            return <Spinner/>
//        }
        
    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={this.updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
    }
    }

    const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = {'objectFit' : 'contain'};
    }

    return (//В этой части загрузка
    <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
    }

export default RandomChar;
import { useState, useEffect } from 'react';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelServices';
  
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    //constructor(props) {//Чтобы новый персонаж отобразился, данный вариант не правильный со стороны семантики, потом его изменю
    //    super(props);
    //    this.updateChar();
    //}
//    state = {
    //    name: null,
    //    description: null,
    //    thumbnail: null,
    //    homepage: null,
    //    wiki: null

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
//    }

    const marvelService = new MarvelService();//Этим действием создаем новое свойство

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    }, [])

    const onCharLoaded = (char) => { 
        setLoading(false);
        setChar(char);    
    }

    const onCharLoading = () => {//При вводе имени персонажа добавляем окно загрузки, чтобы окно не пустовало
        setLoading(true);
    }

    const onError = () => { 
        setLoading(false);
        setError(true);
    }

    const updateChar = () => {//Для получения рандомного героя 
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);//Рандомайзер
        onCharLoading();
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)//Получаем данные при помощи кода, что в MarbelServices
            .catch(onError);//Ловим ошибку и срабатывает функция onError
    }
    
    //render() {//В этой части логика
        //const {char, loading, error} = this.state;//Из свойства char мы вытаскиваем нужные нам свойства именно в данной функции, в другом месте можем вытащить другие свойства
        const errorMessage = error ? <ErrorMessage/> : null;//Создаем здесь условия, чтобы не засорять верстку, а так, данную логику разрешено размещать в верстке
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;
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
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
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
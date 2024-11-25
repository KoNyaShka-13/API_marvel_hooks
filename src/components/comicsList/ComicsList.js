import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelServices';
import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {//useEffect запускается после рендера, по этому нестрашно, если он находится выше запроса, что в нем находится
        onRequest();
    }, [])

    const onRequest = (offset, initial) => {//Запрос с нужными отступами, которые можно изменять по мере необходимости
        initial ? setNewItemLoading(false) : setNewItemLoading(true);//Чтобы не обновлялся список героев всегда, даже когда не нужно
        getAllComics(offset)
            .then(onComicsListLoaded)
                  
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {//Проверка, если в последний раз загрузилось меньше 9 персонажей, значит в массиве данных больше не осталось их, а значит, ставим пометку, что они закончились, чтобы сделать кнопу не активной
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);//Каждое состояние в данный момент - это отдельная переменная
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    function renderItems (arr) {
        const items = arr.map(item => {
            return (//Поиск отдельного комикса будем осуществлять через id
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

        const items = renderItems(comicsList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;
        

        return (
            <div className="comics__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicsEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

export default ComicsList;
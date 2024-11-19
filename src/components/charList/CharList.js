import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelServices';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

//    state = {//Каждый state будем оборачивать в useState
//        charList: [],
//        loading: true,//Первичная загрузка 
//        error: false,
//        newItemLoading: false,//Загрузка персонажей дополнительных
//        offset: 210,//Не путать с отсупом в MarvelServices
//        charEnded: false,//Значение, когда закончились персонажи
//    }
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {//useEffect запускается после рендера, по этому нестрашно, если он находится выше запроса, что в нем находится
        onRequest();
    }, [])

    //componentDidMount() {//Запрос, когда компонент был создан на странице
    //   this.onRequest();//Код один и тот же, по этому данный компонент вызывает onReaquest, но без отступа offset, аргумент будет пустой и использоваться, что задан раньше в MarvelServices
    //}

    const onRequest = (offset, initial) => {//Запрос с нужными отступами, которые можно изменять по мере необходимости
        initial ? setNewItemLoading(false) : setNewItemLoading(true);//Чтобы не обновлялся список героев всегда, даже когда не нужно
        getAllCharacters(offset)
            .then(onCharListLoaded)
            
           
    }

    //onCharListLoading = () => {//Начался процесс загрузки
    //    this.setState({
    //        newItemLoading: true
    //    })
    //}
 
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {//Проверка, если в последний раз загрузилось меньше 9 персонажей, значит в массиве данных больше не осталось их, а значит, ставим пометку, что они закончились, чтобы сделать кнопу не активной
            ended = true;
        }

        //this.setState(({offset, charList}) => ({
        //    charList: [...charList, ...newcharList],
        //    loading: false,
        //    newItemLoading: false,//Когда персонажи загрузились, загрузка завершается
        //    offset: offset + 96,
        //    charEnded: ended
        //}))
        setCharList(charList => [...charList, ...newCharList]);//Каждое состояние в данный момент - это отдельная переменная
        //setLoading(loading => false);//Можно через коллбэк функцию, как указано  тут, а можно просто фолс оставить, так как неважно, какое значение было раньше, до обновления в данном случае
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    

    //Пример использования ref
    //itemRefs = [];
    const itemRefs = useRef([]);//Рефы без каррент нельзя использовать, в отличие от обычных рефов

    //setRef = (ref) => {
    //    this.itemRefs.push(ref);
    //}

    const focusOnItem = (id) => {
        //Но рефами можно пользоваться только в конкретных случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}//Делаем обычный перебор, так как пуш может дать ошибку, а здесь есть возможность использовать его
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    
        
        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;
        

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

CharList.propTypes = {//Проверка пропса и функции, которая относится к нему
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
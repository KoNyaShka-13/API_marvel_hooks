import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelServices';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,//Первичная загрузка 
        error: false,
        newItemLoading: false,//Загрузка персонажей дополнительных
        offset: 210,//Не путать с отсупом в MarvelServices
        charEnded: false,//Значение, когда закончились персонажи
    }
    
    marvelService = new MarvelService();

    componentDidMount() {//Запрос, когда компонент был создан на странице
        this.onRequest();//Код один и тот же, по этому данный компонент вызывает onReaquest, но без отступа offset, аргумент будет пустой и использоваться, что задан раньше в MarvelServices
    }

    onRequest = (offset) => {//Запрос с нужными отступами, которые можно изменять по мере необходимости
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {//Начался процесс загрузки
        this.setState({
            newItemLoading: true
        })
    }
 
    onCharListLoaded = (newcharList) => {
        let ended = false;
        if (newcharList.length < 9) {//Проверка, если в последний раз загрузилось меньше 9 персонажей, значит в массиве данных больше не осталось их, а значит, ставим пометку, что они закончились, чтобы сделать кнопу не активной
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newcharList],
            loading: false,
            newItemLoading: false,//Когда персонажи загрузились, загрузка завершается
            offset: offset + 96,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    //Пример использования ref
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        //Но рефами можно пользоваться только в конкретных случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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

    render() {

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {//Проверка пропса и функции, которая относится к нему
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
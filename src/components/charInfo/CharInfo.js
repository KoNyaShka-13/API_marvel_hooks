import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelServices';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';


const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    
    const {loading, error, getCharacter, clearError} = useMarvelService();

   
    useEffect(() => {
        updateChar()
    }, [props.charId])//Обновление происходит по этим параметрам
 
    
    const updateChar = () => {
        
        const {charId} = props;
        if(!charId) {
            return;
        }
        
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
            setChar(char); 
            
    }

        const skeleton = char || loading || error ? null : <Skeleton/>;//Если ничего нету у нас из списка : ни char, ни loading, ни error, то используется skeleton
        const errorMessage = error ? <ErrorMessage/> : null;//Создаем здесь условия, чтобы не засорять верстку, а так, данную логику разрешено размещать в верстке
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <>
        <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character'}
                    {
                        comics.map((item, i) =>{
                            if (i > 9) return; 
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                            
                        })
                    }
                    
                    
                </ul>
        </>
    )
}

CharInfo.propTypes = {//Предохранитель
    charId: PropTypes.number
}

export default CharInfo;
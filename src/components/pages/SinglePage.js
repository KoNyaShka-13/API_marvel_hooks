import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelServices';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";


const SinglePage = ({Component, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {loading, error, getComic, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateData()
    }, [id])
    
    const updateData = () => {
        clearError();
        //Условия для комиксов и персонажей через свич для уменьшения количества строк
        switch (dataType) {
            case 'character':
                getCharacter(id).then(onDataLoaded);
                break;
            case 'comic':
                getComic(id).then(onDataLoaded);
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}//Вынесли отображение комикса отдельно и так же сделали с пресонажем

export default SinglePage;
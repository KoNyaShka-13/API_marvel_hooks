import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) =>{

        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});//Формируем тут форму запроса
            
            if(!response.ok) {//Если будет ошибка
                throw new Error(`Could not fetch ${url},status: ${res.status}`);

            }

            const data = await response.json();//Данные трансформируем в ответ

        } catch(e) {

        }

    }, [])
}
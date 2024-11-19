import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) =>{//Получаем чистые данные от Api

        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});//Формируем тут форму запроса
            
            if(!response.ok) {//Если будет ошибка
                throw new Error(`Could not fetch ${url},status: ${response.status}`);

            }

            const data = await response.json();//Данные трансформируем в ответ
            setLoading(false);
            return data;

        } catch(e) {
            setLoading(false);//Если будет ошибка, то загрузка будет не законченой показываться
            setError(e.message);//Оставляем сообщение
            throw e;//Очищаем ошибку
        }

    }, []);

    const clearError = useCallback(() => setError(null), []);//Очищаем ошибку, чтобы она не мешала работе в дальнейшем

    return {loading, request, error, clearError}
}
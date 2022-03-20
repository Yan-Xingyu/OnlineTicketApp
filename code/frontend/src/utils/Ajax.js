import storage from "../storage/Storage";

export const postByParam = (url, params, callback) => {
    storage.load({key: "token"})
        .then(ret => {
            const options = {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer "+ret.token
                }
            }

            url = generateUrl(url, params)

            fetch(url, options)
                .then(request =>request.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
        .catch(error=>{
            const options = {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer "
                }
            }

            url = generateUrl(url, params)
            console.log(url)

            fetch(url, options)
                .then(request =>request.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
}

export const postByBody = (url, body, callback) => {
    storage.load({key: "token"})
        .then(ret => {
            console.log("token",ret.token)
            const options = {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ret.token
                }
            }

            fetch(url, options)
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
        .catch(error=>{
            const options = {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "
                }
            }

            fetch(url, options)
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
}

export const postByParamAndBody = (url, params, body, callback) => {
    storage.load({key: "token"})
        .then(ret => {
            const options = {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ret.token
                }
            }

            url = generateUrl(url, params)

            fetch(url, options)
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
        .catch(error=>{
            const options = {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "
                }
            }

            url = generateUrl(url, params)

            fetch(url, options)
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error => console.log(error))
        })
}

const generateUrl = (url, params) => {
    url += '?'
    for(let key in params){
        if(params.hasOwnProperty(key)){
            url += key + '=' + params[key] + '&'
        }
    }
    return url
}

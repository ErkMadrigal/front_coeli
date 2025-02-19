export const fetchApi = async (url, metod, token) => {
    try {
        let res = await fetch(url,{
            method: metod,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Authorization': token
            },
        })
        // console.log(res.status)
        if(!res.ok){
            throw new Error("Respuesta erronea")
        }else{
            return await res.json()
        }
    } catch (error) {
        let respuesta = {
            "datos": [],
            "mensaje": error,
            "status": 204,
         }
        // console.log(error)        
        return respuesta
    }
}

export const refreshSession = async (dominio, token) => {
    let url = dominio+"auth/refreshSession"
    let res = await fetch(url,{
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': token
        },
    })

    // console.log(res)
    let data = await res.json()

    return await data 
}

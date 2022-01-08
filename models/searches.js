const fs = require('fs');

const axios = require('axios');

class Searches {

    history = [];
    dbPath = './DB/dataBase.json';

    constructor() {

        // TODO: leer DB si existe
        this.readDB();

    }

    get historyCapitalyzer(){

        return this.history.map( place => {

            let words = place.split(' ');
            words = words.map( w => w[0].toUpperCase() + w.substring(1));

            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }


    async cities( place = '') {

       
        try{ 
            // Petición http
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            }); 

            const resp =  await instance.get();
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                latitude: place.center[0],
                length: place.center[1]
            }));;

        } catch ( err ) {}
            
            return []; // retornar los lugares que coincidan
    
        }

        
    async placeWeather( lat, lon){

        try {

            // Peticion http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            });

            // resp.data
            const resp = await instance.get();
            const { weather, main } = resp.data;
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };

        } catch ( err ) {
            console.log(err);
        }
    }

    addToHistory( place = '' ) {

        if (this.history.includes( place.toLocaleLowerCase())){
            return;
        }
        this.history = this.history.splice(0,5);
        // revisar con gus porq no hace el unshift
        this.history.unshift( place.toLocaleLowerCase() );

        // grabar en DB
        this.saveDB();

    }

    saveDB(){

        const payload = {
            history: this.history
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payload));
    }

    readDB(){

        if (!fs.existsSync( this.dbPath)) return;

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse( info );

        this.history = data.history;
    }
}




module.exports = Searches;
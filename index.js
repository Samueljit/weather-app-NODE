require('dotenv').config();

const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");


const main = async() =>{


    let opt = 0

    console.clear();

    do {
        
        const searches = new Searches();
        
        opt = await inquirerMenu();

        switch ( opt ) {

            case 1:
                //Show message
                const term = await readInput('City:');

                //Search the places
                const places = await searches.cities( term );
                
                //Select places
                const idSelected = await listPlaces(places);
                if ( idSelected === '0' ) continue;

                const placeSelected = places.find( place => place.id === idSelected);

                 // save to DB
                 searches.addToHistory( placeSelected.name );
                 

                // weather data
                const weather = await searches.placeWeather(placeSelected.latitude, placeSelected.length);
            
                //Show results
                console.log('\nCity information\n'.cyan );
                console.log('City:', placeSelected.name );
                console.log('Latitude:', placeSelected.latitude );
                console.log('Length:', placeSelected.length );
                console.log('Tempeture:', weather.temp );
                console.log('Min:', weather.min );
                console.log('Max:', weather.max );
                console.log(`What's the weather like: ${weather.desc}`);

            break;

            case 2:
                searches.historyCapitalyzer.forEach( (place, i) => {
                    const idx = `${ i + 1}.`.cyan;
                    console.log(`${idx} ${place}`);
                })

            break;
            
            case 0:
                console.log('Salir')
            break;

        }

       

        if ( opt !== 0 ) await pause();

    } while ( opt !== 0)
    


}

main();


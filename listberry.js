import axios from 'axios';
import fs from 'fs';

const JSONWrite = (filePath, data, encoding = 'utf-8') => {
    const promiseCallback = (resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), encoding, (err) => {
            if(err) {
                
                reject(err);
                return;
            }

            resolve(true);
        });
    };
    return new Promise(promiseCallback);
};


const start = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/berry?offset=0&limit=64')
    
    const data = response.data.results.slice(0, 3);
    const  fileData = [];

    for (const item of data) {
        
        const {data} = await axios.get(item.url);

        const berry = {
            
            id: data.id,
            name: data.name,
            growthTime: data.growth_time,
            size: data.size,
            naturalGiftType: data.natural_gift_type.name,
            firmness: data.firmness.name,
            item: data.item.name,
        
        }
        
        berry.flavors = data.flavors.filter((item) => item.potency != 0).map((item) => {
            return {
                potency: item.potency, 
                flavor_name: item.flavor.name,
            }
        });
        
        fileData.push(berry);
    }

    await JSONWrite('./listaBerry.json', fileData);
    console.log('Exportado JSON!');

};

start();
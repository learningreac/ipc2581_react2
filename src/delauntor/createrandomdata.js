
const createrandomdata = (size) => {
    const randomdata = [];
    const max = 350;

    for(let i=0; i<size; i++) {
        const x = Math.floor(Math.random() * max);
        const y = Math.floor(Math.random() * max);

        randomdata.push([x,y]);
    };

    console.log('new data', randomdata);

    return randomdata;
};

export default createrandomdata;
import {transPolygonData} from '../ipc2581/utilities/transformdata.js'


test('hell', ()=>{

    let exarr=[];
    exarr.push(['input para', 'output para']);
    
    expect(transPolygonData('hh')).toBe('hh');
});
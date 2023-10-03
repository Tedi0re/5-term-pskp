const EventEmitter = require('events');


let db_data=[
{id:'1', name:"Симонов А. А.", bday:'25.02.2004'},
{id:'2', name:'Козак О. Д.', bday:'21.12.2004'},
{id:'3', name:'Климович А. С.', bday:'17.7.2003'},
];

const _select = ()=>{
    return db_data;
}

const _insert = (object)=>{
   return db_data.push(object);
}

const _delete = (object) =>{
    return db_data.splice(db_data.indexOf(object), 1);
}

const _update  = (object)=> {
    for (let dbDatum of db_data) {
        if (dbDatum.id === object.id) {
            let index = db_data.indexOf(dbDatum);
            db_data[index].name = object.name;
            db_data[index].bday = object.bday;
            return 1;
        }
    }
    return 0;
}

class DB extends EventEmitter{
    get(){return _select();};
    post(object) {
        for (const dbDatum of db_data) {
            if(dbDatum.id === object.id)
                throw new Error("POST: Duplicate id!");
            if(object.id.trim() === "" || object.id.trim() === undefined){
                throw new Error("POST: void id!")
            }
        }
        _insert(object)};

    put(object) {
        for (const dbDatum of db_data) {
            if(dbDatum.id === object.id) {
                _update(object)
                return;
            }
        }
        throw new Error(`PUT: No such object with id = ${object.id}`);
    }

    delete(object){
        for (let dbDatum of db_data) {
            if(object.id === dbDatum.id){
                let str = dbDatum;
                _delete(dbDatum);
                return str;
            }
        }
    }

}


// class DB extends EventEmitter{
//     get(){return db_data;};
//     post(object) {db_data.push(object);};
//
//     put(object) {
//         for (let dbDatum of db_data) {
//             if(object.id === dbDatum.id){
//                 let index = db_data.indexOf(dbDatum);
//                 db_data[index].name = object.name;
//                 db_data[index].bday = object.bday;
//             }
//         }
//     }
//
//     delete(object){
//         for (let dbDatum of db_data) {
//             if(object.id === dbDatum.id){
//                 db_data.splice(db_data.indexOf(dbDatum), 1);
//             }
//         }
//     }
//
// }

exports.DB = DB;
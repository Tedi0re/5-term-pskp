const EventEmitter = require('events');


let db_data=[
{id:'1', name:"Симонов А. А.", bday:'2004-02-25'},
{id:'2', name:'Козак О. Д.', bday:'2004-12-21'},
{id:'3', name:'Климович А. С.', bday:'2003-07-21'},
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
                var now = new Date()
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
                var BDayValue = new Date(object.bday); // Преобразование строки в объект Date
                var BDayTimestamp = BDayValue.valueOf(); // Преобразование даты в метку времени

                if (BDayTimestamp > today) {
                    throw new Error("Invalid Date");
                }
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
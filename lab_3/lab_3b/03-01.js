const {v4:uuidv4} = require('uuid')
const readline = require('readline');
const firstJob = () =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            let success = true
            if(success) resolve("Hello, world!");
            else reject("Error: firstJob");
        },2000);
    })
}

async function AsyncFirstJob(){
    try{
        const result =  await firstJob();
        console.log(result);
    } catch (err){
        console.log(err);
    }
}

firstJob().then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})

AsyncFirstJob();
// //-----------------------------------------------
const secondJob = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            let success = false
            if(success) resolve("Hello, world!");
            else reject("Error: secondJob");
        },3000);
    })
}
async function AsyncSecondJob(){
    try{
        const result =  await secondJob();
        console.log(result);
    } catch (err){
        console.log(err);
    }
}

secondJob().then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})

AsyncSecondJob();
// //-----------------------------------------------
const thirdJob = (data)=>{
    return new Promise((resolve, reject)=>{
        if(typeof data !== 'number'){
            reject("Error: thirdJob");
        } else if(data % 2 !== 0) {
            setTimeout(()=>{
                resolve('odd');
            }, 1000);
        } else {
            setTimeout(()=>{
                reject('even');
            },2000)
        }
    });
}

async function AsyncThirdJob(data){
    try{
        let result = await thirdJob(data);
        console.log(result);
    } catch (err){
        console.log(err);
    }
}

thirdJob(1).then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})
thirdJob(2).then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})
thirdJob('x').then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})

AsyncThirdJob(1);
AsyncThirdJob(2);
AsyncThirdJob('x');
// //-----------------------------------------------

const validateCard = (num)=>{
    console.log(`number card: ${num}`)
    return Math.round(Math.random());
};

const proceedToPayment = (numberOrder)=>{
    console.log(numberOrder);
    return new Promise((resolve, reject)=>{
        if(Math.round(Math.random())) resolve('Payment successfully');
        else reject('Payment failed');
    })
}
const createOrder = (NumberOfCard)=>{
    return new Promise((resolve, reject)=>{
        if(validateCard(NumberOfCard)){
            setTimeout(()=>{
                resolve(uuidv4(undefined, undefined, undefined));
            },5000);
        } else {
            reject("Card is not valid");
        }
    })
}

async function AsyncProceedToPayment(numberOrder){
    try{
        let result = await proceedToPayment(numberOrder);
        console.log(result);
        return result;
    } catch (err){
        console.log(err);
    }
}

async function AsyncCreateOrder(numberOfCard){
    try{
        let result = await createOrder(numberOfCard);
        AsyncProceedToPayment(result);
    } catch (err){
        console.log(err);
    }
}

AsyncCreateOrder('1234 5678 9012 3456')

createOrder('1234 5678 9012 3456').then(result =>{
    proceedToPayment(result).then(result =>{
        console.log(result);
    }).catch(err =>{
        console.log(err);
    });
}).catch(err=>{
    console.log(err);
});
// //--------------------------------------------------------


const fu2 = (n) =>{
        return new Promise((resolve, reject)=>{
            if(typeof n === "number") resolve(Math.pow(n, 2));
            else reject("Error: fu2");
        })
}
const fu3 = (n) =>{
    return new Promise((resolve, reject)=>{
        if(typeof n === "number") resolve(Math.pow(n, 3));
        else reject("Error: fu3");
    })
}
const fu4 = (n) =>{
    return new Promise((resolve, reject)=>{
        if(typeof n === "number") resolve(Math.pow(n, 4));
        else reject("Error: fu4");
    })
}
let n = 1

Promise.all([fu2(n), fu3(n), fu4(n)]).then(result=>{
    console.log(result[0]);
    console.log(result[1]);
    console.log(result[2]);
}).catch(err=>{
    console.log(err);
})
---------------------------------------
const fu2 = (n) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(typeof n === "number") resolve(Math.pow(n, 2));
            else reject("Error: fu2");
        },3000);
    });
}
const fu3 = (n) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(typeof n === "number") resolve(Math.pow(n, 3));
            else reject("Error: fu3");
        },1000);
    });
}
const fu4 = (n) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(typeof n === "number") resolve(Math.pow(n, 4));
            else reject("Error: fu4");
        },5000);
    });
}
let n = 3;

Promise.race([fu2(n), fu3('e'), fu4(n)]).then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
});

Promise.any([fu2('2'), fu3(n), fu4(n)]).then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
});
//-----------------------------------------------------
function f1(){
    console.log('f1');
}
function f2(){
    console.log('f2');
}
function f3(){
    console.log('f3');
}
function main(){
    console.log('main');
    setTimeout(f1,50);
    setTimeout(f3,30);

    new Promise((resolve, reject)=>{
        resolve("I am a Promise, right after f1 and f3! Really?");
    }).then(resolve=>console.log(resolve));

    new Promise((resolve, reject)=>{
        resolve("I am a Promise after Promise!");
    }).then(resolve=>console.log(resolve));

    f2();
}

main();
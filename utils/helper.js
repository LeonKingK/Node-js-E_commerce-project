const bcrypt=require('bcryptjs');
const Redis=require('async-redis').createClient();
const jswt=require('jsonwebtoken');

module.exports={
    comparePass: (plain,hash) => bcrypt.compareSync(plain,hash),

    encode: payload => bcrypt.hashSync(payload),

    fMsg:(res,msg="",result=[])=>res.status(200).json({con:true,msg,result}),
    
    set:async(id,value) => await Redis.set(id.toString(),JSON.stringify(value)),
    get:async(id) => JSON.parse (await Redis.get(id.toString())),
    drop:async(id) => await Redis.del(id.toString()),
    
    makeToken: (payload) => jswt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1h'}),
}


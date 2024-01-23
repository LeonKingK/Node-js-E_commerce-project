require('dotenv').config();

const express = require('express'),
    app = express(),
    server = require('http').createServer(app);
    io = require('socket.io')(server);
    helper = require('./utils/helper'),
    mongoose = require('mongoose'),
    jswt = require('jsonwebtoken'),
    fileUpload = require('express-fileupload');

app.use(express.json());
app.use(fileUpload());

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DbName}`);

const { validateToken, validateRole } = require('./utils/validator');
const permitRouter = require('./routes/permit');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const catRouter = require('./routes/category');
const subcatRouter = require('./routes/subcat');
const childcatRouter = require('./routes/childcat');
const tagRoute = require('./routes/tag');
const deliveryRoute = require('./routes/delivery');
const warrantyRoute = require('./routes/warranty');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');




app.use('/users', userRouter);
app.use('/roles', validateToken(), validateRole("Owner"), roleRouter);
app.use('/permits', permitRouter);
app.use('/cats', catRouter);
app.use('/subcats', subcatRouter);
app.use('/childcats', childcatRouter);
app.use('/tags', tagRoute);
app.use('/delis', deliveryRoute);
app.use('/warrantys', warrantyRoute);
app.use('/products', productRoute);
app.use('/orders',orderRoute);


app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({ con: false, msg: err.message })
});

io.of('/chat').use(async(socket,next)=>{
    let token=socket.handshake.query.token;
    if(token){
        let decode = jswt.verify(token, process.env.SECRET_KEY);
                    if (decode) {
                        let user = await helper.get(decode._id);
                        if (user) {
                            socket.userData=user;
                            next();
                        } else {
                            next(new Error("Tokenization Error"));
                        }
                    } else {
                        next(new Error("Tokenization Error"));
                    };
    }else{
        next(new Error("Tokenization Error"));
    }
}).on('connection',socket=>{
    require('./utils/chat').initialize(io,socket);
});


const defaultData = async () => {
    let migrator = require('./migrations/migrator');
    // await migrator.migrate();
    // await migrator.backup();
    // await migrator.rpMigrate();
    // await migrator.addOwnerRole();
};

// defaultData();



server.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));
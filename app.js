const config = require('config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use('/api/auth',require('./routes/auth.routes'));

const PORT = config.get("port") || 5000;

const start = async() => {
    try{
        await mongoose.connect(config.get('mongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(5000,() => console.log('App has been started on port' + PORT));  
    }catch(e){
        console.log('Server error ',e.message);
        process.exit(1);
    }
}

start();
    
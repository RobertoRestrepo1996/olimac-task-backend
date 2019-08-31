//port
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// DB
let urldb;

//if(process.env.NODE_ENV == 'dev'){
  //  urldb = 'mongodb://localhost:27017/task';
//} else {
    urldb = 'mongodb+srv://berserker:PFSYsrE7193aOlga@cluster0-ghpvz.mongodb.net/task';
//}

process.env.URLDB = urldb;
//mongodb+srv://berserker:<password>@cluster0-ghpvz.mongodb.net/task

// berserker

//c: PFSYsrE7193aOlga


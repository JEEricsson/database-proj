let env = process.env.NODE_ENV || 'development'

if(env === 'development' || env === 'test'){
    let conf = require('./conf.json')
    let envConf = conf[env]

    Object.keys(envConf).forEach((key) => {
        process.env[key] = envConf[key]
    })
}   

// if (env === 'development'){
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/Econ'
// } else if (env === 'test'){
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/EconTestDB'
// }
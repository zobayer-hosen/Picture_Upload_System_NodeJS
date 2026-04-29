import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("mongo-url is not defined in enviroment variable")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT-secret is not defined in enviroment variable")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("goole-client-id is not defined in enviroment variable")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Google-client-secret is not define in enviroment variables")
}
if(!process.env.GOOGLE_CLIENT_TOKEN){
    throw new Error("google-refresh-token is not define in enviromental vaiables")
}
if(!process.env.GOOGLE_CLIENT_USER){
    throw new Error("google-user is not define in enviroment variable")
}

const config ={
    MONGO_URI :process.env.MONGO_URI,
    JWT_SECRET : proccss.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_TOKEN:process.env.GOOGLE_CLIENT_TOKEN,
    GOOGLE_CLIENT_USER:process.env.GOOGLE_CLIENT_USER
}
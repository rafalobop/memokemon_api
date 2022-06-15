
var app = null;
const defineRoute = (ruta, requests) => {
  var baseRequest = "/api/";
  var route = baseRequest + ruta;
  app.use(route, requests);
};


module.exports = (appp)=>{
  app = appp;
  require('./users')(defineRoute);
  require('./games')(defineRoute);
}
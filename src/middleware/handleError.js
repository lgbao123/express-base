import createError from "http-errors";
const logError = (err, req, res) => {
   console.log('ERROR LOG ', new Date().toLocaleString());
   console.log('Request:', req.method, req.originalUrl);
   console.log('Params:', req.params);
   console.log('Body:', req.body);
   console.log('Query:', req.query);
   console.log('Error: ', err);
   console.log('Error stack: ', err.stack);
   console.log("--------------------------------------------------------------------------------------");

}
const badRequest = (res, mes) => {
   const err = createError.BadRequest(mes);
   const error = {
      DT: '',
      EC: 1,
      EM: err.message
   }
   return res.status(err.status).json(error);
}
const internalServerError = (req, res) => {
   // logError(err, req, res);
   const err = createError.InternalServerError();
   const error = {
      DT: '',
      EC: err.status,
      EM: err.message
   }
   return res.status(err.status).json(error);
}

const notFound = (req, res) => {
   const err = createError.NotFound()
   const error = {
      DT: '',
      EC: err.status,
      EM: err.message
   }
   return res.status(err.status).json(error);
}


export { badRequest, internalServerError, notFound, logError }

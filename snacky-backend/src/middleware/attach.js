const attachUserId = (req, res, next) => {
    req.body.uid = req.body.uid; 
    console.log("Attached user ID:", req.body);
    next();
};
  
module.exports = { attachUserId };
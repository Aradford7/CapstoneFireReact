const {db, admin} = require ('../util/admin') //import db  


//GET ROUTE/REACTS
exports.getAllReacts =  (req, res) => {
  db.collection('reacts')
    .orderBy('createdAt', 'desc') //order by descending timestamp! get latest first
    .get()//need access to db with admin sdk by importing on top
    .then(data =>{
      let reacts = [];
      data.forEach((doc) => {
          reacts.push({
              reactId: doc.id,
              body: doc.data().body,
              userHandle: doc.data().userHandle,
              createdAt: doc.data().createdAt  //get with get request and api/reacts see update and react obj id
              //we got reacts updated in postman now organize by latest using time
          });
      });  
      return res.json(reacts);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).json({error: err.code});
  });
}

//POST ROUTE /REACT
exports.postOneReact = (req, res) => {
    if(req.body.body.trim() === ''){
        return res.status(400).json({body: 'Body must not be empty.'});
    }
    const newReact = {
        body: req.body.body, //for postman
        userHandle: req.user.username,
        //createdAt: admin.firestore.Timestamp.fromDate(new Date()) get rid of this cuz show nanoseconds write
        createdAt: new Date().toISOString() //iso is fx will make in string
        //create dbschema.js
    };
   
      db.collection('reacts')
        .add(newReact)
        .then((doc) => {
            res.json({message: `Document ${doc.id} created Sucessfully!`});
        })
        .catch(err => {
            res.status(500).json({error:'Oh no! Something went wrong!'});
            console.error(err);
        });
}
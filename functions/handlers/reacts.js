const {db, admin} = require ('../util/admin') 


//GET ROUTE/reacts
exports.getAllReacts =  (req, res) => {
  db.collection('reacts')
    .orderBy('createdAt', 'desc') 
    .get()
    .then(data =>{
      let reacts = [];
      data.forEach((doc) => {
          reacts.push({
              reactId: doc.id,
              body: doc.data().body,
              userHandle: doc.data().userHandle,
              createdAt: doc.data().createdAt  
              
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
        body: req.body.body, 
        userHandle: req.user.username,
        createdAt: new Date().toISOString() 
    
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
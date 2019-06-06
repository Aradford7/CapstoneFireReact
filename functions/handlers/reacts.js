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
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    
    };
   
      db.collection('reacts')
        .add(newReact)
        .then((doc) => {
            const responseReact = newReact;
            responseReact.reactId = doc.id; 
            res.json(responseReact);
        })
        .catch(err => {
            res.status(500).json({error:'Oh no! Something went wrong!'});
            console.error(err);
        });
}

//fetch 1 React
exports.getReact = (req, res) => {
    let reactData = {};
    db.doc(`/reacts/${req.params.reactId}`)
    .get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({error: 'Oh no! React not found!'})
        }
        reactData = doc.data();
        reactData.reactId = doc.id;
        return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('reactId', '==', req.params.reactId)
        .get();
    })
    .then(data =>{
        reactData.comments = [];
        data.forEach(doc => {
            reactData.comments.push(doc.data());
        });
        return res.json(reactData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.code})
    })
}

//Comment on a comment

exports.commentOnReact = (req,res) =>{
    if(req.body.body.trim() === '')return res.status(400).json({comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toString(),
        reactId: req.params.reactId,
        userHandle: req.user.username,
        userImage: req.user.imageUrl
    };
    console.log(newComment);

    db.doc(`/reacts/${req.params.reactId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({error: 'React not found'});
        }
        return db.collection('comments').add(newComment);
    })
    .then(() => {
        res.json(newComment);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Oh no! Something went wrong!'})
    })
}

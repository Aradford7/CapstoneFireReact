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
        return doc.ref.update({commentCount: doc.data().commentCount +1});
    })
    .then(()=> {
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

//likes for a React
exports.likeReact = (req, res) => {
    //firebase has max of 4mb per doc so better to store smaller and multiple collections
    //more effcient to spread these properties bc like real twitter its slower if it was all in one doc
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.username)
        .where('reactId', '==', req.params.reactId).limit(1); //give array of return 1 doc array
    //need to check if like doc exist if exist return msg already liked, check if the react exist cant like a react that doesnt exist
    const reactDocument = db.doc(`/reacts/${req.params.reactId}`);
    
    let reactData;

    reactDocument.get()
    .then(doc => {
        if(doc.exists){
        reactData = doc.data();
        reactData.reactId = doc.id;
        return likeDocument.get();
    }else{
        return res.status(404).json({error: 'React not found.'});
    }
  })
  .then(data => {
      if(data.empty){
          return db.collection('likes').add({
              reactId: req.params.reactId,
              userHandle: req.user.username

          })
          //next this promise to avoid even if not empty it will still go thru avoid it by nesting
          .then(() => {
              reactData.likeCount++
              return reactDocument.update({likeCount: reactData.likeCount})
          })
          .then(() => {
              return res.json(reactData); //just return the react
          })
      } else {
          return res.status(400).json({error: 'React already liked'});
      }
  })
  .catch(err => {
      console.error(err)
      res.status(500).json({error: err.code});
  })
}

//unlike for a React

exports.unlikeReact = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.username)
    .where('reactId', '==', req.params.reactId).limit(1); 
    const reactDocument = db.doc(`/reacts/${req.params.reactId}`);

    let reactData;

    reactDocument
    .get()
    .then(doc => {
        if(doc.exists){
        reactData = doc.data();
        reactData.reactId = doc.id;
        return likeDocument.get();
    }else{
        return res.status(404).json({error: 'React not found.'});
    }
  })
    .then(data => {
        if(data.empty){
            return res.status(400).json({error: 'React not liked'});
    } else {
        return db.doc(`/likes/${data.docs[0].id}`)
        .delete()
            .then(() => {
                reactData.likeCount--;
                return reactDocument.update({likeCount: reactData.likeCount})
            })
            .then(()=>{
                res.json(reactData);
            })
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({error: err.code});
    })
}

//Delete React

exports.deleteReact = (req, res) => {
    const document = db.doc(`/reacts/${req.params.reactId}`);
    document.get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({error: 'React not found.'});
        }
        if(doc.data().userHandle !== req.user.username){
            return res.status(403).json({error: 'Unauthorized'});
        }else{
            return document.delete();
        }
    })
    .then(() => {
        res.json({message: 'React deleted successfully!'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    })
}
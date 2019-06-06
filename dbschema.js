// do this to be charge less =.=, firebase charge on reads
let db = {
    users:[
        {
            userId: 'jaknsdjndjanakjndajndjkandjandjknajkdas',
            email: 'user@email.com',
            username: 'user',
            createdAt: '2019-06-03T11:16:13.723Z',
            imageUrl: 'image/daskdnajdnasjkd',
            bio: 'Hello, my name is user, I am default in the backend db',
            website: 'https://user.com',
            github: 'https:user.github.com',
            location: 'Los Angeles, CA'
        }
    ],
    reacts: [
        {
            userHandle: 'user',
            body: 'this is the react body',
            createdAt: '2019-06-03T11:16:13.723Z', //new Date().toISOString()
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments:[
        {
            userHandle: 'user',
            reactId: 'asdknadjkan',
            body: 'test test a comment',
            createdAt: '2019-06-03T11:16:13.723Z'
        }
    ],
    notifications: [
        {
            recipent: 'user',
            sender: 'kupo',
            read: 'true | false',
            reactId: 'kansdjkandjand',
            type: 'like | comment',
            createdAt: '2019-06-03T11:16:13.723Z'
        }
    ],
};

const userDetails = {
    //Redux data
    credentials: {
        userId: 'jaknsdjndjanakjndajndjkandjandjknajkdas',
        email: 'user@email.com',
        username: 'user',
        createdAt: '2019-06-03T11:16:13.723Z',
        imageUrl: 'image/daskdnajdnasjkd',
        bio: 'Hello, my name is user, I am default in the backend db',
        website: 'https://user.com',
        github: 'https:user.github.com',
        location: 'Los Angeles, CA'
    },
    likes: [
        {
            userHandle: 'user',
            reactId: 'kajsndjkandsajkdnkajd'
        },
        {
            userHandle: 'user',
            reactId: 'askndjkansdjkandkj'
        }
    ]
}
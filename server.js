const express = require('express')
const res = require('express/lib/response')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const PORT = process.env.PORT || 3000

const User = require('./schema/schema');
require('./db/connection');

app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');  // To get the cookies on user's browser
app.use(cookieParser());
const bcrypt = require('bcrypt');
const auth = require('./middleware/auth');

http.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/register.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/login.html'))
})
app.get('/home', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/home.html'))
})
app.get('/avatar', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/avatar.html'))
})
app.get('/profile', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/profile.html'))
})

app.get('/chat/:username', auth, (req, res) => {
    let chatWith = req.params.username;
    chatWith.replace('@','');
    res.sendFile(path.join(__dirname, '/webpages/chat.html'))
})

app.get('/friendRequests', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '/webpages/friendReq.html'))
})

app.get('/fetchPosts', auth, async (req, res) => {
    const friends = req.user.friends;
    let result = [];
    for(let i=0;i<friends.length;i++)
    {
        const username = friends[i];
        const data = await User.findOne({username:username},{_id:0, name:1, username:1, avatar:1, posts:1});
        result.push(data);
    }
    const data = await User.findOne({username:req.user.username},{_id:0, name:1, username:1, avatar:1, posts:1});
    result.push(data);
    res.send(result);
})

app.post('/post', auth, async (req, res) => {
    const content = req.body.writtenText;
    if(content.length==0){
        res.sendFile(path.join(__dirname, '/webpages/home.html'))
        res.end();
        return;
    }
    const post = {
        post: content,
        likes: []
    }
    req.user.posts.push(post);
    await req.user.save();
    // res.end();
    res.sendFile(path.join(__dirname, '/webpages/home.html'))
})


app.get('/searchFriend/:username', auth, async (req, res) => {
    const username = req.params.username;
    const users = await User.find({ $or: [{ username: username }, { name: username }] });
    // res.sendFile(path.join(__dirname, '/webpages/searchRes.html'),{ info: users});
    res.send(users);
});

app.get('/sendFriendRequest/:username', auth, async (req, res) => {
    try {
        const username = req.params.username;
        if(req.user.username==username||req.user.friends.includes(username)){
            res.end();
            return;
        }
        const searchUser = await User.findOne({ username: username });
        let requests = searchUser.friendReq;
        if (!requests.includes(req.user.username)) {
            requests.push(req.user.username);
            searchUser.friendReq = requests;
            searchUser.save();
        }
        res.end();
    } catch (error) {

    }
});

app.get('/myDetails', auth, async (req, res) => {
    const user = await req.user;
    console.log(user);
    res.json(user);
});

app.get('/declineReq/:username',auth,(req,res)=>{
    const username = req.params.username;
    let requests = req.user.friendReq;
    for(let i=0;i<requests.length;i++){
        if(requests[i]==username){
            requests.splice(i,1);
            break;
        }
    }
    req.user.friendReq=requests;
    req.user.save();
    res.end();
})

app.get('/addFriend/:username', auth, async (req, res) => {
    let fUsername = req.params.username;
    let myUsername = req.user.username;
    if(fUsername==myUsername){
        res.end();
    }

    //add me to friend's list
    let searchUser = await User.findOne({ username: fUsername });
    let friends = searchUser.friends;
    friends.push(req.user.username);
    searchUser.friends=friends;
    searchUser.save();

    let currFriends = req.user.friends;
    currFriends.push(fUsername);
    let friendReq = req.user.friendReq;
    for(let i=0;i<friendReq.length;i++)
    {
        if(friendReq[i]==fUsername){
            friendReq.splice(i,1);
            break;
        }
    }
    req.user.friendReq=friendReq;
    req.user.save();
    res.end();
});

app.get('/getFriendInfo/:username', auth, async (req, res) => {
    const fUsername = req.params.username;
    const result = await User.findOne({ username: fUsername }, { _id: 0, name:1,username:1,avatar:1 });
    res.json(result);
});

app.get('/searchFriends', auth, async (req, res) => {
    const username = req.params.username;
    const users = await User.find({ $or: [{ username: username }, { name: username }] });

    res.sendFile(path.join(__dirname, '/webpages/searchRes.html'));
});

app.post('/registerMe', async (req, res) => {
    try {
        const registerMe = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });
        const token = await registerMe.generateAuthToken();
        const data = await registerMe.save();
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 50000000),   //in milliseconds 
            httpOnly: true,
            // secure: true
        }).redirect('http://localhost:3000/avatar');
        res.end();
    } catch (error) {
        console.log(error);
    }
    // res.sendFile(path.join(__dirname , '/webpages/chat.html'))
});

app.get('/getStarted/:image', auth, async (req, res) => {
    req.user.avatar = req.params.image;
    await req.user.save();
    res.redirect('http://localhost:3000/home');
})


app.post('/loginMe', async (req, res) => {

    try {
        const password = req.body.password;
        const username = req.body.username;

        const user = await User.findOne({ username: username });
        const isMatch = await bcrypt.compare(password, user.password);
        const token = await user.generateAuthToken();

        if (!isMatch) {
            res.send('Invalid login details!!');
        } else {
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 50000000),   //in milliseconds 
                httpOnly: true,
                // secure: true
            }).redirect('http://localhost:3000/home');
            res.end();
            // res.render('home');
        }
    } catch (error) {
        console.log(error);
    }

    // res.sendFile(path.join(__dirname , '/webpages/chat.html'))
});

app.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        res.clearCookie("jwt");
        await req.user.save();  //saving the cleared cookie
        console.log('logged out successfully');
        res.redirect('http://localhost:3000/login');
        res.end();
    } catch (error) {
        res.status(500).send('error ' + error);
    }
});
// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    app.get('/join/:name', (req, res) => {
        const name = req.params.name;
        socket.join(name);
        console.log(name + ' joined');
        // res.sendFile(path.join(__dirname , '/webpages/chat.html'));
        res.end();
    });
    socket.on('message', (msg) => {
        socket.join(msg.from);
        console.log('New Messanger ' + msg.from);
        console.log(`From ${ msg.from } to ${ msg.to }`);
        socket.broadcast.to(msg.to).emit('message', msg)
    })
})
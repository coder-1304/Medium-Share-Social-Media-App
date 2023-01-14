const avatars = [
    "https://cdn-icons-png.flaticon.com/512/8132/8132932.png",
    "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    "https://cdn-icons-png.flaticon.com/512/921/921124.png",
    "https://cdn-icons-png.flaticon.com/512/921/921071.png",
    "https://cdn-icons-png.flaticon.com/512/1785/1785896.png",
    "https://cdn-icons-png.flaticon.com/512/706/706816.png",
    "https://cdn-icons-png.flaticon.com/512/145/145843.png",
    "https://cdn-icons-png.flaticon.com/512/924/924874.png",
    "https://cdn-icons-png.flaticon.com/512/560/560216.png",
    "https://cdn-icons-png.flaticon.com/512/145/145867.png",
    "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
    "https://cdn-icons-png.flaticon.com/512/4322/4322992.png",
    "https://cdn-icons-png.flaticon.com/512/2423/2423830.png",
    "https://cdn-icons-png.flaticon.com/512/1154/1154448.png",
    "https://cdn-icons-png.flaticon.com/512/219/219970.png",
    "https://cdn-icons-png.flaticon.com/512/1154/1154473.png",
    "https://cdn-icons-png.flaticon.com/512/1326/1326377.png",
    "https://cdn-icons-png.flaticon.com/512/949/949666.png",
    "https://cdn-icons-png.flaticon.com/512/921/921009.png",
    "https://cdn-icons-png.flaticon.com/512/1090/1090806.png",
    "https://cdn-icons-png.flaticon.com/512/1674/1674291.png",
    "https://cdn-icons-png.flaticon.com/512/921/921107.png",
    "https://cdn-icons-png.flaticon.com/512/3749/3749784.png",
    "https://cdn-icons-png.flaticon.com/512/706/706831.png",
    "https://cdn-icons-png.flaticon.com/512/2118/2118630.png",
    "https://cdn-icons-png.flaticon.com/512/1090/1090740.png",
    "https://cdn-icons-png.flaticon.com/512/706/706843.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333640.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
];

let searchResult = [];


let i = 0;

fetch('/mydetails')
    .then((response) => response.json())
    .then((data) => {
        // console.log(data)
        document.getElementById('navbarDropdown').innerHTML = data.name;
        document.getElementById('myAvatar').src = avatars[data.avatar];
    });

async function getInfo() {

    const res = await fetch(`/myDetails`)
        .then((response) => response.json())
        .then(async (data) => {
            const requests = data.friendReq;
            // searchResult=requests;
            console.log(requests);

            for (let i = 0; i < requests.length; i++) {
                let username = requests[i];
                const list = await fetch(`/getFriendInfo/${ username }`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.username);
                        searchResult.push(data.username);
                        const main = document.querySelector('.friends');

                        const card = document.createElement('div');
                        card.classList = 'card';
                        const friendsResult = `

                <div class="friend" >
               <img src="${ avatars[data.avatar] }" alt="" class="avat">
               <div class="info">
                <div class="name">${ data.name }</div>
                <div class="username">${ data.username }</div>
               </div id="reqBtns">
              
               <img height="25" class="icons friendBtn remove" id="rmvfrd${ i }" onclick="declineFriend(this.id)" src="https://cdn-icons-png.flaticon.com/512/57/57165.png" alt="">
               <img height="40" class="friendBtn add"  id="friend${ i }" onclick="acceptFriend(this.id)" src="https://cdn-icons-png.flaticon.com/512/6911/6911758.png" alt="">
               </div>

                `;
                        card.innerHTML += friendsResult;
                        main.appendChild(card);
                    });
            }
        });
}

getInfo();
//END OF DISCUSSION



// async function searchFriends() {
//     const name = document.getElementById('searchMe').value;

//     try {
//         let list = document.getElementById('listOfFriends');
//         while (list.hasChildNodes()) {
//             list.removeChild(list.firstChild);
//         }
//     } catch (error) {

//     }

//     const res = await fetch(`/myDetails`)
//         .then((response) => response.json())
//         .then((data) => {
//             const requests = data.friendReq;
//             console.log(requests);

//             for (let i = 0; i < requests; i++) {
//                 username = requests[i];
//                 const list = fetch(`/getFriendInfo/${ username }`);
//                 console.log(list);
//             }
//         });
// }

async function acceptFriend(id) {
    const friendId = Number(id.charAt(6));
    // await fetch(`addFriend/${ searchResult[friendId] }`);
    await fetch(`addFriend/${searchResult[friendId]}`)
    console.log('add ' + searchResult[friendId]);
    window.location.href='http://localhost:3000/friendRequests';
}
async function declineFriend(id) {
    const friendId = Number(id.charAt(6));
    // await fetch(`sendFriendRequest/${ searchResult[friendId] }`);
    console.log('remove ' + searchResult[friendId]);
    console.log('remove id ' + friendId);
    await fetch(`/declineReq/${searchResult[friendId]}`)
    window.location.href='http://localhost:3000/friendRequests';
}


{/* <button class="chatBtn" id="friend$" onclick="addFriend(this.id)">Accept Request</button> */ }
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

function searchFriends() {
    console.log('here');
    const friend = document.getElementById('searchMe').value;
    console.log(friend);
    window.location.href = `http://localhost:3000/searchFriend/${ friend }`;
}
let myDetails = {};
let i=0;
let searchResult=[];

function chat (id){
    let num="";
    for(let j=6;j<=id.length;j++){
        num+=id.charAt(j);
    }
    const index = Number(num);
    console.log(index);
    // console.log(searchResult[index]);
    window.location.href=`/chat/@${searchResult[index]}`;
}

function showMyDetails() {
    fetch('/mydetails')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            document.getElementById('navbarDropdown').innerHTML = data.name;
            document.getElementById('myAvatar').src = avatars[data.avatar];
            const friends = data.friends;

            // let username = requests[i];





            for (let i = 0; i < friends.length; i++) {
                let username = friends[i];
                const list = fetch(`/getFriendInfo/${ username }`)
                    .then((response) => response.json())
                    .then((friend) => {
                        // console.log(data.username);
                        searchResult.push(friend.username);
                        const main = document.querySelector('.friends');

                        const card = document.createElement('div');
                        card.classList = 'card';
                        const friendsResult = `

                <div class="friend" >
               <img src="${ avatars[friend.avatar] }" alt="" class="avat">
               <div class="info">
                <div class="name">${ friend.name }</div>
                <div class="username">@${ friend.username }</div>
                </div>
                <button class="chatBtn" id="friend${i}" onclick="chat(this.id)">Chat</button>
                </div>

                `;
                        i++;
                        card.innerHTML += friendsResult;
                        main.appendChild(card);
                    });
            }






        });
}

showMyDetails();


// async function post(){
//     console.log('posting...');
//     // const content = document.getElementById('writtenText').value;
//     await fetch('/post');
//     console.log('posted');
// }


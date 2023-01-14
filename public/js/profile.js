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
let myPosts = {};
async function fetchMyDetails() {
    fetch('/myDetails')
        .then((response) => response.json())
        .then((data) => {
            myPosts = data.posts;
            console.log(data);
            document.getElementById('navbarDropdown').innerHTML = data.name;
            document.getElementById('myAvatar').src = avatars[data.avatar];
            document.getElementById('profileName').innerHTML = data.name;
            document.getElementById('profileUsername').innerHTML = '@' + data.username;
            document.getElementById('profileImage').src = avatars[data.avatar];
            document.getElementById('profilePosts').innerHTML = data.posts.length;
            document.getElementById('profileFriends').innerHTML = data.friends.length;
            document.getElementById('profileEmail').innerHTML = data.email;


            for (let j = myPosts.length-1;j>=0; j--) {
                const main = document.querySelector('.container');

                //create card
                const card = document.createElement('div');
                const movieCard = `
    <div class="post">
    <div class="postInfo">
          <img height="57px" id="senderAvatar" src="${ avatars[data.avatar] }" alt="">
          <div class="nameUsername">
            <div class="senderName">${ data.name }</div>
            <div class="senderUsername">@${ data.username }</div>
          </div>
        </div>
        <div id="postContent">
          ${ myPosts[j].post }
        </div>
        </div>
    `;
                card.innerHTML += movieCard;
                main.appendChild(card);


            }
        });
}
fetchMyDetails();

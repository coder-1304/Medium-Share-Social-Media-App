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

let searchResult=[];

fetch('/mydetails')
    .then((response) => response.json())
    .then((data) => {
        // console.log(data)
        document.getElementById('navbarDropdown').innerHTML = data.name;
        document.getElementById('myAvatar').src = avatars[data.avatar];
    });

async function searchFriends() {
    const name = document.getElementById('searchMe').value;

    try {
        let list = document.getElementById('listOfFriends');
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
    } catch (error) {

    }

    const res = await fetch(`/searchFriend/${name}`)
        .then((response) => response.json())
        .then((data) => {
            searchResult=[];
            for (let i = 0; i < data.length; i++) {
                searchResult.push(data[i].username);
                const main = document.querySelector('.friends');

                const card = document.createElement('div');
                card.classList = 'card';
                const friendsResult = `

                <div class="friend" >
               <img src="${avatars[data[i].avatar]}" alt="" class="avat">
               <div class="info">
                <div class="name">${ data[i].name }</div>
                <div class="username">${ data[i].username }</div>
               </div>
               <button class="chatBtn" id="friend${i}" onclick="addFriend(this.id)">Add Friend</button>
               </div>
                
                `;
                card.innerHTML += friendsResult;
                main.appendChild(card);
            }
        });
    // console.log(result[0]);
}

async function addFriend(id){
    const friendId=Number(id.charAt(6));
    let btn = document.getElementById(id);
    btn.innerText='Req Sent🗸';
    btn.style.backgroundColor='rgb(0, 255, 0)';
    await fetch(`sendFriendRequest/${searchResult[friendId]}`);
}

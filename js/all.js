const url = "https://todoo.5xcamp.us/";

const body = document.querySelector('body');
const loginAndRegisterPage = document.querySelector('.loginAndRegisterPage');
const loginForm = document.querySelector('.loginForm');
const registerForm = document.querySelector('.registerForm');
const todoPage = document.querySelector('.todoPage');

const loginBtn = document.querySelector('.loginBtn');
const toRegisterBtn = document.querySelector('.toRegisterBtn');
const registerBtn = document.querySelector('.registerBtn');
const toLoginBtn = document.querySelector('.toLoginBtn');
const logoutBtn = document.querySelector('.logoutBtn');

const emailInput = document.querySelector('#email');
const nicknameInput = document.querySelector('#nickname');
const passwordInput = document.querySelector('#password');
const passwordAgainInput = document.querySelector('#passwordAgain');

const emailLoginInput = document.querySelector('#emailLogin');
const emailAnnouncement = document.querySelector('.emailAnnouncement')
const passwordLoginInput = document.querySelector('#passwordLogin');
const passwordAnnouncement = document.querySelector('.passwordAnnouncement')

const nicknameBarNickname = document.querySelector('.nicknameBar-nickname');

const todoEmpty = document.querySelector('.todoEmpty');
const todoList = document.querySelector('.todoList');
const listContent = document.querySelector('.list');

const addContent = document.querySelector('.addContent');
const addBtn = document.querySelector('.addBtn');

const unDoneNum = document.querySelector('.unDoneNum')

let token = "";
let data = [];

toRegisterBtn.addEventListener('click', () => {
    toRegister();
})

registerBtn.addEventListener('click', () => {
    let email = emailInput.value;
    let nickname = nicknameInput.value;
    let password = passwordInput.value;
    let passwordAgain = passwordAgainInput.value;
    if (infoCheck(email, nickname, password, passwordAgain) == true){
        register(email, nickname, password);   
    }
})

loginBtn.addEventListener('click', () => {
    checkLoginInfo();
})

emailLoginInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter"){
        checkLoginInfo();
    }
})

passwordLoginInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter"){
        checkLoginInfo();
    }
})

addBtn.addEventListener('click', () => {
    if (addContent.value.replace(" ", "") == ""){
        addContent.value = "";
        return alert('內容不得為空！');
    }
    let todo = addContent.value;
    addTodo(todo, token);
})

addContent.addEventListener('keyup', (e) =>{
    if (e.key === "Enter"){
        if (addContent.value.replace(" ", "") == ""){
            addContent.value = "";
            return alert('內容不得為空！');
        }
        let todo = addContent.value;
        addTodo(todo, token);
    }
})

listContent.addEventListener('click', (e) => {
    let id = e.target.closest("li").dataset.id;
    toggleStatus(id, token);
    if (e.target.classList.contains("delete") == true){
        e.preventDefault();
        deleteTodo(id, token);
    }
});

toLoginBtn.addEventListener('click', () => {
    toLogin();
})

logoutBtn.addEventListener('click', () => {
    logout(token);
})

const toLogin = () => {
    loginAndRegisterPage.style.display = "flex";
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    todoPage.style.display = "none";

    body.style.background = "#FFD370";

    emailLoginInput.value = "";
    emailAnnouncement.style.color = "#FFD370";
    passwordLoginInput.value = "";
    passwordAnnouncement.style.color = "#FFD370";
}

const toRegister = () => {
    loginAndRegisterPage.style.display = "flex";
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
    todoPage.style.display = "none";

    email.value = "";
    nickname.value = "";
    password.value = "";
    passwordAgain.value = "";
}

const toTodo = () => {
    loginAndRegisterPage.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    todoPage.style.display = "block";

    body.style.background = "linear-gradient(#FFD370 50%, #FFFFFF 80%) no-repeat";
}

const infoCheck = (email, nickname, password, passwordAgain) => {
    if (email == "" ||
        nickname == "" ||
        password == "" ||
        passwordAgain == ""){
            return alert("資料均不得為空！");
    }
    if (email.replace(' ', '') != email ||
        nickname.replace(' ', '') != nickname ||
        password.replace(' ', '') != password ||
        passwordAgain.replace(' ', '') != passwordAgain){
        return alert("資料不得有空格！");
    }
    if (/@/.test(email) != true){
        return alert("信箱格式錯誤！");
    }
    if (/[^a-zA-Z0-9]/.test(password) != false){
        return alert("密碼只可有英文或數字！");
    }
    if (password.length < 6){
        return alert("密碼需大於六位！");
    }
    if (password != passwordAgain){
        return alert("兩次密碼必須相同！");
    }
    return true;
}

const register = (email, nickname, password) => {
    axios.post(`${url}/users/`, {
        "user":{
            "email": email,
            "nickname": nickname,
            "password": password
        }
    })
    .then(res => {
        alert(`${res.data.message}！`);
        return toLogin();
    })
    .catch(error => {
        return alert(error.response.data.error[0]);
    })
}

const checkLoginInfo = () => {
    let email = emailLoginInput.value;
    let password = passwordLoginInput.value;

    checkEmail(email);
    checkPassword(password)

    if (checkEmail(email) && checkPassword(password)){
        login(email, password);
    }
}

const checkEmail = (email) => {
    emailAnnouncement.style.color = "#FFD370";
    if (email == ""){
        emailAnnouncement.style.color = "#D87355";
        emailAnnouncement.innerHTML = "此欄位不得為空";
        return;
    }
    if (/@/.test(email) != true){
        emailAnnouncement.style.color = "#D87355";
        emailAnnouncement.innerHTML = "信箱格式錯誤";
        return;
    }
    return true;
}

const checkPassword = (password) => {
    passwordAnnouncement.style.color = "#FFD370";
    if (password == ""){
        passwordAnnouncement.style.color = "#D87355";
        passwordAnnouncement.innerHTML = "此欄位不得為空";
        return;
    }
    if (/[^a-zA-Z0-9]/.test(password) != false || password.length <6){
        passwordAnnouncement.style.color = "#D87355";
        passwordAnnouncement.innerHTML = "密碼應為六位以上英文或數字";
        return;
    }
    return true;
}

const login = (email, password) => {
    axios.post(`${url}/users/sign_in`, {
        "user":{
            "email": email,
            "password": password
        }
    })
    .then(res => {
        nicknameBarNickname.innerHTML = res.data.nickname;
        token = res.headers.authorization;
        getData(token);
        toTodo();
        return;
    })
    .catch(() => {
        return alert('信箱或密碼錯誤');
    })
}

const getData = (token) => {
    axios.get(`${url}/todos`, {
        headers:{
            'Authorization': token
        }
    })
    .then(res => {
        data = res.data.todos;
        render(data);
    })
    .catch(() => {
        return alert('授權錯誤，請重新登入');
    })
}

const render = (data) => {
    if (data.length == 0){
        todoEmpty.style.display = "block";
        todoList.style.display = "none";
    } else {
        todoEmpty.style.display = "none";
        todoList.style.display = "flex";
    }
    
    let str = "";
    let num = 0;
    data.forEach(item => {
        let {content: text, id, completed_at: checked} = item;
        if (checked != null){
            checked = "checked";
        } else {
            checked = "";
            num += 1;
        }
        str += `<li data-id="${id}">
        <label class="checkbox" for="">
          <input type="checkbox" ${checked}/>
          <span>${text}</span>
        </label>
        <a href="#" class="delete"></a>
      </li>`;
    })

    unDoneNum.innerHTML = `${num} `;
    listContent.innerHTML = str;
}

const addTodo = (todo, token) => {
    axios.post(`${url}/todos`, {
        "todo":{
            "content": todo
        }},{
        headers:{
            'Authorization': token
        }
    })
    .then(() => {
        getData(token);
        addContent.value = "";
    })
    .catch(() => {
        toLogin();
        return alert('授權狀態錯誤，請重新登入');
    })
}

const toggleStatus = (id, token) => {
    axios.patch(`${url}/todos/${id}/toggle`, {}, { //patch預設需帶值
        headers:{
            'Authorization': token
        }
    })
    .then(() =>{
        getData(token);
    })
    .catch(() => {
        toLogin();
        return alert('授權狀態錯誤，請重新登入');
    })
}

const deleteTodo = (id, token) => {
    axios.delete(`${url}/todos/${id}`, {
        headers:{
            'Authorization': token
        }
    })
    .then(() => {
        getData(token);
    })
    .catch(() => {
        toLogin();
        return alert('授權狀態錯誤，請重新登入');
    })
}

const logout = (token) => {
    axios.delete(`${url}/users/sign_out`, {
        headers:{
            'Authorization': token
        }
    })
    .then(() => {
        token = "";
        toLogin();
        return alert('登出成功！將回至登入頁面');
    })
    .catch(() => {
        toLogin();
        return alert('授權狀態錯誤，將回至登入頁面');
    })
}
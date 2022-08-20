//import "./index.css"
import axios from "axios"
let rows=0
let cols =0
let userData=[]
let currentMakeMaze=[]
let testMaze=[]
let currentHPMaze =undefined
let currentCoord= {x:undefined,y:undefined}
let hpX=undefined
let hpGameDiv=undefined
/* 
    -1- start path
    0- free path
    1- block
    2- bomb
    3- points
    4- finish
*/
let setStart={x:undefined,y:undefined}
let setFinish={x:undefined,y:undefined}
let mode='modePath';
let listOfMazes=[]
const resetEverything=()=>{
    rows=0
    cols =0
    currentMakeMaze=[]
    testMaze=[]
    currentCoord= {x:undefined,y:undefined}
    setStart={x:undefined,y:undefined}
    setFinish={x:undefined,y:undefined}
    mode='modePath';
}
const addLoginEventListeners=()=>{
    const  loginButton = document.getElementById("loginButton")
    loginButton.addEventListener('click',()=>{
        sendLoginDetails()
    })
    const swapButton = document.getElementById("swapButton")
    swapButton.addEventListener('click',()=>{
        makeSignUpPage()
        addSignupEventListeners()
    })
}
const displayHomePage=()=>{
    const root = document.getElementById('root')
    root.innerHTML=
    `
    <div id="TotalContent">
        <div id="SideBar">
            <div id="SideBarOptions">
                <p id="mymazebutton">My Maze</p>
                <p id="explorebutton">Explore</p>
                <p id="makemazesbutton">Make Mazes</p>
                <!--<p>Multiplayer</p>-->
            </div>
        </div>    
        <div id="MainContent">
            
        </div>
    </div>
    `
    displayMyMazes()
    addHomePageEventListeners()
}
const makeEmptyMazeArray =(r,c)=>{
    let Arr=[]
    for(let i=0;i<r;i++){
        let tempArr = []
        for(let j=0;j<c;j++){
            tempArr[j]=0;
        }
        Arr[i]=tempArr
    }
    return Arr
}
const registerDivClick=(e)=>{
    const crow = e.target.dataset.row
    const ccol = e.target.dataset.col
    console.log(e.target.dataset)
    if (mode==null){
        return
    }else{
        if (mode=='modeStart'){
            if(setStart.x!=undefined){
                currentMakeMaze[setStart.x][setStart.y]=0
                document.getElementById(`col ${setStart.x} ${setStart.y}`).style.backgroundColor='blue'
            }
            currentMakeMaze[crow][ccol]=-1
            setStart.x=crow
            setStart.y=ccol
            e.target.style.backgroundColor= 'green'
        }
        else if (mode=='modePath'){
            currentMakeMaze[crow][ccol]=0
            e.target.style.backgroundColor= 'blue'
        }else if(mode=='modeWall'){
            currentMakeMaze[crow][ccol]=1
            e.target.style.backgroundColor= 'grey'
        }else if(mode=='modePoints'){
            currentMakeMaze[crow][ccol]=3
            e.target.style.backgroundColor= 'yellow'
        }else if(mode=='modeFinish'){
            if(setFinish.x!=undefined){
                currentMakeMaze[setFinish.x][setFinish.y]=0
                document.getElementById(`col ${setFinish.x} ${setFinish.y}`).style.backgroundColor='blue'
            }
            setFinish.x=crow
            setFinish.y=ccol
            currentMakeMaze[crow][ccol]=4
            e.target.style.backgroundColor= 'pink'
        }else if(mode == 'modeBomb'){
            currentMakeMaze[crow][ccol]=2
            e.target.style.backgroundColor= 'red'
        }
    }
}
const generateTheNewMaze=()=>{
    const GenerateTheGrid = document.getElementById('GenerateTheGrid')
    for(let i=0;i<rows;i++){
        let rowDiv = document.createElement('div')
        GenerateTheGrid.appendChild(rowDiv)
        rowDiv.className="mazerow"
        rowDiv.id=`row ${i}`
        for(let j=0;j<cols;j++){
            let colDiv = document.createElement('div')
            rowDiv.appendChild(colDiv)
            colDiv.id=`col ${i} ${j}`
            colDiv.className="mazecol"
            colDiv.dataset.row=i
            colDiv.dataset.col=j
            colDiv.addEventListener('click',registerDivClick)
        }
    }
}
const generateExisitingMaze=()=>{
    const makeMazeContent = document.getElementById("generateTheGrid")
    makeMazeContent.innerHTML=''
    for(let i=0;i<rows;i++){
        let rowDiv = document.createElement('div')
        makeMazeContent.appendChild(rowDiv)
        rowDiv.className="mazerow"
        rowDiv.id=`row ${i}`
        for(let j=0;j<cols;j++){
            let colDiv = document.createElement('div')
            rowDiv.appendChild(colDiv)
            colDiv.id=`col ${i} ${j}`
            colDiv.className="mazecol"
            colDiv.dataset.row=i
            colDiv.dataset.col=j
            switch(currentMakeMaze[i][j]){
                case(0):
                    colDiv.style.backgroundColor='blue'
                    break;
                case(1):
                    colDiv.style.backgroundColor='grey'
                    break;
                case(2):
                    colDiv.style.backgroundColor='red'
                    break;
                case(-1):
                    colDiv.style.backgroundColor='green'
                    break;
                case(3):
                    colDiv.style.backgroundColor='yellow'
                    break;
                case(4):
                    colDiv.style.backgroundColor='pink'
                    break;
            }   
        }
    }
    if(currentCoord.x==undefined){
        currentCoord.x=setStart.x
        currentCoord.y=setStart.y
    }
    console.log(setStart,currentCoord)
    console.log()
    document.getElementById(`col ${currentCoord.x} ${currentCoord.y}`).style.backgroundColor='orange'
}
const updateUserDataAndReturn=async()=>{
    const token = window.localStorage.getItem('token')
    const resp = await axios.get("http://localhost:3001/api/login/updated",{headers:{'authorization':token}})
    console.log(resp.data.user)

    if(resp.status==200){
        userData=resp.data.user
        console.log(userData)
        let destringifiedMatrix = userData.maze.map(x=>JSON.parse(x.maze))
        userData.mazeDecoded= destringifiedMatrix
        console.log(userData)
        displayHomePage()
    }else{
        alert("enter valid credentials")
    }
}
const sendMazeToBackend=async()=>{
    const body={maze:currentMakeMaze,date:new Date()}
    const token = window.localStorage.getItem('token')
    const resp = await axios.post("http://localhost:3001/api/maze/create",body,{headers:{'authorization':token}})
    console.log(resp)
    if(resp.status==200){
        alert("Maze uploaded")
        resetEverything()
        updateUserDataAndReturn()
    }
}
const addSubmitEventListeners=()=>{
    const submitMaze = document.getElementById('submitMaze')
    const goBackOption= document.getElementById("goBackOption")
    goBackOption.addEventListener('click',()=>{
        resetEverything()
        updateUserDataAndReturn()
    })
    submitMaze.addEventListener('click',()=>{
        sendMazeToBackend()
    })
}
const showSubmitOption=()=>{
    const options = document.getElementById('options')
    options.innerHTML=`
    <p id="goBackOption">Discard and go home</p>
    <p id="submitMaze">Submit Maze</p>
    `
    addSubmitEventListeners()
}
const gameTestMazeMode =(e)=>{
    console.log(e.key)
    let newX, newY
    if(e.key == 'ArrowRight' || e.key == 'ArrowDown' || e.key == "ArrowLeft" || e.key == 'ArrowUp' ){
        switch(e.key){
            case 'ArrowRight':
                newY= parseInt(currentCoord.y)+1;
                newX= parseInt(currentCoord.x)
                break;
            case 'ArrowDown':
                newY= parseInt(currentCoord.y);
                newX= parseInt(currentCoord.x)+1
                break;
            case 'ArrowLeft':
                newY= parseInt(currentCoord.y) -1;
                newX= parseInt(currentCoord.x)
                break;
            case 'ArrowUp':
                newY= parseInt(currentCoord.y);
                newX= parseInt(currentCoord.x)-1
                break;
        }
        console.log(newX,newY)
        console.log(currentMakeMaze)
        if(currentMakeMaze[newX][newY]==0 ){
            currentCoord.x=newX
            currentCoord.y=newY
        }
        if(currentMakeMaze[newX][newY]==4){
            currentCoord.x=newX
            currentCoord.y=newY
            generateExisitingMaze()
            window.removeEventListener('keydown',gameTestMazeMode)
            showSubmitOption()
        }
        generateExisitingMaze()
    }else{
        console.log('hi')
        }
    
}
const moveTheMazeChar=()=>{
    window.addEventListener('keydown',gameTestMazeMode)
}
const testPlayMaze=()=>{
    const makeMazeContent = document.getElementById("makeMazeContent")
    makeMazeContent.innerHTML=`
    <div id="generateTheGrid">

    </div>
    <div id="options">
        <p id="goBackOption">Discard Maze</p>
    </div>
    `

    const goBackOption = document.getElementById("goBackOption")
    goBackOption.addEventListener('click',()=>{
        resetEverything()
        updateUserDataAndReturn()
    })
    generateExisitingMaze()
    moveTheMazeChar()
}
const addDisplayMazeEventListener=()=>{
    const buttonGeneratorDiv= document.getElementById('buttonGeneratorDiv')
    buttonGeneratorDiv.addEventListener('click',()=>{
        rows= document.getElementById('noOfRows').value
        cols = document.getElementById('noOfCols').value
        currentMakeMaze= makeEmptyMazeArray(rows,cols)
        generateTheNewMaze()
    })
    const confirmMazeButton = document.getElementById('confirmMazeButton')
    const modeStart = document.getElementById("modeStart")
    const modePath = document.getElementById('modePath')
    const modeWall= document.getElementById('modeWall')
    const modePoints = document.getElementById('modePoints')
    const modeBomb = document.getElementById("modeBomb")
    const modeFinish = document.getElementById('modeFinish')
    modeStart.addEventListener('click',()=>{
        mode='modeStart'
    })
    modePath.addEventListener('click',()=>{
        mode = 'modePath'
    })
    modeWall.addEventListener('click',()=>{
        mode = 'modeWall'
    })
    modePoints.addEventListener('click',()=>{
        mode = 'modePoints'
    })
    modeBomb.addEventListener('click',()=>{
        mode = 'modeBomb'
    })
    modeFinish.addEventListener('click',()=>{
        mode = 'modeFinish'
    })
    confirmMazeButton.addEventListener('click',()=>{
        testMaze = JSON.parse(JSON.stringify(currentMakeMaze))
        if(setStart.x==undefined || setFinish.x==undefined){
            alert("Enter Start and Finish Tile")
            return
        }
        testPlayMaze()
    })
}

const displayMakeMazes=()=>{
    const mainContent = document.getElementById("MainContent")
    mainContent.innerHTML=`
    <div id="makeMazes">
        <p id="makeMazesTitle">Make Mazes</p>
        <div id="makeMazeContent">
            <div class="FormStuff">
                <div class="InputContainter">
                    <p class="theInput">Enter no of rows</p>
                    <input id="noOfRows" class="theInput">
                </div>
                <div>
                    <p class="theInput">Enter no of columns</p>
                    <input id="noOfCols" class="theInput"/>
                </div>
                <div>
                    <button id="buttonGeneratorDiv" class="generateButton">Generate the grid </button>
                </div>
                <div id="GenerateTheGrid">
                    
                </div>
                <div id="gameOptions">
                    <p class="modesTitles">Modes</p>
                    <div class="modeDivContainer">
                        <p id="modeStart" class="TypeOfMode">Start</p>
                        <p id="modePath" class="TypeOfMode">Path</p>
                        <p id="modeWall" class="TypeOfMode">Wall</p>
                        <p id="modeBomb" class="TypeOfMode">Bomb</p>
                        <p id="modePoints" class="TypeOfMode">Points</p>
                        <p id="modeFinish" class="TypeOfMode">Finish</p>
                    </div>
                </div>
                <div class="submitMazeButton">
                    <button id="confirmMazeButton">Confirm Maze</button>
                </div>
            </div>
    </div>
    `
    addDisplayMazeEventListener()
}
const updateListOfOtherMazes=async()=>{
    const token = window.localStorage.getItem('token')
    const resp = await  axios.get('http://localhost:3001/api/maze',{headers:{'authorization':token}})
    listOfMazes = resp.data.maze
    updateAllUserMazes()
}
const addToYourAccount=async(x)=>{
    const body ={id:x._id}
    const token = window.localStorage.getItem('token')
    const resp= await axios.post("http://localhost:3001/api/login/addmaze",body,{"headers":{"authorization":token}})
    if(resp.status==200){
        updateUserDataAndReturn()
    }
}
const updateAllUserMazes=()=>{
    const listOfOtherMazes = document.getElementById('listOfOtherMazes')
    let counter=0
    listOfMazes.forEach(x=>{
        const mazeDiv = document.createElement('div')
        listOfOtherMazes.appendChild(mazeDiv)
        let p = document.createElement('p')
        let madeBy= document.createElement('p')
        let copy = document.createElement('p')
        mazeDiv.appendChild(p)
        mazeDiv.appendChild(madeBy)
        mazeDiv.appendChild(copy)
        copy.addEventListener('click',()=>{
            addToYourAccount(x)
        })
        p.textContent=`Maze- ${++counter}`
        madeBy.textContent=`made by ${x.by}`
        copy.textContent='copy'
        let theAcctualDiv= document.createElement('div')
        mazeDiv.appendChild(theAcctualDiv)
        let y= JSON.parse(x.maze)
        for(let i=0;i<y.length;i++){
            let rowDiv = document.createElement('div')
            theAcctualDiv.appendChild(rowDiv)
            rowDiv.className="mazerow"
            rowDiv.id=`row ${i}`
            for(let j=0;j<y[0].length;j++){
                let colDiv = document.createElement('div')
                rowDiv.appendChild(colDiv)
                colDiv.id=`col ${i} ${j}`
                colDiv.className="mazecol"
                colDiv.dataset.row=i
                colDiv.dataset.col=j
                switch(y[i][j]){
                    case(0):
                        colDiv.style.backgroundColor='blue'
                        break;
                    case(1):
                        colDiv.style.backgroundColor='grey'
                        break;
                    case(2):
                        colDiv.style.backgroundColor='red'
                        break;
                    case(-1):
                        colDiv.style.backgroundColor='green'
                        break;
                    case(3):
                        colDiv.style.backgroundColor='yellow'
                        break; 
                    case(4):
                        colDiv.style.backgroundColor='pink'
                        break;
                }   
            }
        }})
    }
const displayOtherMazes=()=>{
    const mainContent = document.getElementById("MainContent")
    mainContent.innerHTML=`
    <div id="otherMazes">
        <p class="otherMazesTitle">Other Mazes</p>
        <div id="listOfOtherMazes">
        </div>
    </div>
    `
    
    updateListOfOtherMazes()
}
const addHomePageEventListeners=()=>{
    const mymazebutton = document.getElementById('mymazebutton')
    const makemazesbutton = document.getElementById('makemazesbutton')
    const explorebutton = document.getElementById("explorebutton")
    mymazebutton.addEventListener('click',()=>{
        displayMyMazes()
    })
    makemazesbutton.addEventListener('click',()=>{
        displayMakeMazes()
    })
    explorebutton.addEventListener('click',()=>{
        displayOtherMazes()
    })
}
const updateTheMazeToGameMode=(x,theGameDiv)=>{
    theGameDiv.innerHTML=''
    currentMakeMaze=x
    for(let i=0;i<x.length;i++){
        let rowDiv = document.createElement('div')
        theGameDiv.appendChild(rowDiv)
        theGameDiv.className="mazerow"
        theGameDiv.id=`row ${i}`
        currentHPMaze=x
        for(let j=0;j<x.length;j++){
            let colDiv = document.createElement('div')
            rowDiv.appendChild(colDiv)
            colDiv.id=`col ${i} ${j}`
            colDiv.className="mazecol"
            colDiv.dataset.row=i
            colDiv.dataset.col=j
            
            switch(currentMakeMaze[i][j]){
                case(0):
                    colDiv.style.backgroundColor='blue'
                    break;
                case(1):
                    colDiv.style.backgroundColor='grey'
                    break;
                case(2):
                    colDiv.style.backgroundColor='red'
                    break;
                case(-1):
                    colDiv.style.backgroundColor='green'
                    currentCoord.x=i
                    currentCoord.y=j
                    break;
                case(3):
                    colDiv.style.backgroundColor='yellow'
                    break;
                case(4):
                    colDiv.style.backgroundColor='pink'
                    break;
            }   
        }
    }
    if(currentCoord.x==undefined){
        currentCoord.x=setStart.x
        currentCoord.y=setStart.y
    }
    console.log(setStart,currentCoord)
    console.log()
    document.getElementById(`col ${currentCoord.x} ${currentCoord.y}`).style.backgroundColor='orange'
    hpX= x
    hpGameDiv =theGameDiv
    window.addEventListener('keydown',gameTestMazeModeHomePage)
}
const gameTestMazeModeHomePage=(e)=>{
    console.log(e.key)
    let newX, newY
    if(e.key == 'ArrowRight' || e.key == 'ArrowDown' || e.key == "ArrowLeft" || e.key == 'ArrowUp' ){
        console.log( parseInt(currentCoord.y),parseInt(currentCoord.x))
        switch(e.key){
            case 'ArrowRight':
                newY= parseInt(currentCoord.y)+1;
                newX= parseInt(currentCoord.x)
                break;
            case 'ArrowDown':
                newY= parseInt(currentCoord.y);
                newX= parseInt(currentCoord.x)+1
                break;
            case 'ArrowLeft':
                newY= parseInt(currentCoord.y) -1;
                newX= parseInt(currentCoord.x)
                break;
            case 'ArrowUp':
                newY= parseInt(currentCoord.y);
                newX= parseInt(currentCoord.x)-1
                break;
        }
        console.log(newX,newY)
        console.log(currentHPMaze)
        try{
            if(currentHPMaze[newX][newY]==0 ){
                currentCoord.x=newX
                currentCoord.y=newY
            }
            if(currentHPMaze[newX][newY]==4){
                currentCoord.x=newX
                currentCoord.y=newY
                generateExisitingMaze()
                window.removeEventListener('keydown',gameTestMazeMode)
                showSubmitOption()
            }
        }catch(e){

        }
        updateTheMazeToGameMode(hpX,hpGameDiv)
    }else{
        console.log('hi')
        }
}

const displayListOfMazes=()=>{
    const userMazeContent = document.getElementById("userMazeContent")
    if(userData.maze.length==0){
        userMazeContent.innerHTML=`
            <p class="noMazeMessage">You currently have no mazes<p>
        `
    }else{
        let counter=0
        userData.mazeDecoded.forEach(x=>{
            const mazeDiv = document.createElement('div')
            userMazeContent.appendChild(mazeDiv)
            let p = document.createElement('p')
            // let play = document.createElement('p')
            mazeDiv.appendChild(p)
            // mazeDiv.appendChild(play)
            p.textContent=`Maze- ${++counter}`
            //play.textContent='Play'
            
            let theAcctualDiv= document.createElement('div')
            mazeDiv.appendChild(theAcctualDiv)
            for(let i=0;i<x.length;i++){
                let rowDiv = document.createElement('div')
                theAcctualDiv.appendChild(rowDiv)
                rowDiv.className="mazerow"
                rowDiv.id=`row ${i}`
                for(let j=0;j<x[0].length;j++){
                    let colDiv = document.createElement('div')
                    rowDiv.appendChild(colDiv)
                    colDiv.id=`col ${i} ${j}`
                    colDiv.className="mazecol"
                    colDiv.dataset.row=i
                    colDiv.dataset.col=j
                    switch(x[i][j]){
                        case(0):
                            colDiv.style.backgroundColor='blue'
                            break;
                        case(1):
                            colDiv.style.backgroundColor='grey'
                            break;
                        case(2):
                            colDiv.style.backgroundColor='red'
                            break;
                        case(-1):
                            colDiv.style.backgroundColor='green'
                            break;
                        case(3):
                            colDiv.style.backgroundColor='yellow'
                            break; 
                        case(4):
                            colDiv.style.backgroundColor='pink'
                            break;
                    }   
                }
            }
            // play.addEventListener('click',()=>{
            //     updateTheMazeToGameMode(x,theAcctualDiv)
            // })
        })
        
    }
}
const displayMyMazes=()=>{
    const mainContent = document.getElementById("MainContent")
    console.log(userData)
    mainContent.innerHTML=`
    <div id="userMazes">
        <p id="userMazesTitle">Your mazes</p>
        <div id="userMazeContent">
        
        </div>
    </div>
    `
    displayListOfMazes()
}
const sendLoginDetails=async()=>{
    const username=document.getElementById("signupusername").value
    const password = document.getElementById("signuppassword").value 
    const body ={username,password}
    const resp = await axios.post("http://localhost:3001/api/login",body)
    if(resp.status==200){
        localStorage.setItem('token','bearer '+resp.data.token)
        userData=resp.data.user
        console.log(userData)
        let destringifiedMatrix = userData.maze.map(x=>JSON.parse(x.maze))
        userData.mazeDecoded= destringifiedMatrix
        console.log(userData)
        displayHomePage()
    }else{
        alert("enter valid credentials")
    }
}
const sendSignupDetails=async()=>{
    const username=document.getElementById("signupusername").value
    const password = document.getElementById("signuppassword").value 
    const body ={username,password}
    const resp = await axios.post("http://localhost:3001/api/signup",body)
    if(resp.status==200){
        alert("account made")
        swapToLoginPage()
    }
}
const addSignupEventListeners=()=>{
    const signupButton = document.getElementById("signupButton")
    signupButton.addEventListener('click',()=>{
        sendSignupDetails()
    })
    const swapButton = document.getElementById("swapButton")
    swapButton.addEventListener('click',()=>{
        swapToLoginPage()
        addLoginEventListeners()
    })
}
const swapToLoginPage=()=>{
    const root = document.getElementById("root")
    root.innerHTML=`
    <div id="MainHoldTag">
        <div id="Login">
            <h2 id="loginHeader">Log in</h2>
            <div id="credentialTag">
                <div class="username">
                    <input placeholder="username" class="inputType" id="signupusername"></input>
                </div>
                <div class="password">
                    <input class="inputType" placeholder="password" id="signuppassword"></input>
                </div>
            </div>
            <div id="signupButtonDiv">
                <button id="loginButton">Login </button>
            </div>
            <div id="swapButtonDiv">
                <p>New Here? <span id="swapButton">Sign up</span></p>
            </div>
        </div>
    </div>
`
}


const makeSignUpPage =()=>{
    const root = document.getElementById("root")
    root.innerHTML=`
    <div id="MainHoldTag">
        <div id="Signup">
            <h2 id="SignupHeader">Sign Up</h2>
            <div id="credentialTag">
                <div class="username">
                    <input placeholder="username" class="inputType" id="signupusername"></input>
                </div>
                <div class="password">
                    <input class="inputType" placeholder="password" id="signuppassword"></input>
                </div>
            </div>
            <div id="signupButtonDiv">
                <button id="signupButton">Sign up </button>
            </div>
            <div id="swapButtonDiv">
                <p>Have an Account? <span id="swapButton">Log in</span></p>
            </div>
        </div>
    </div>
`
} 
const main=()=>{
    makeSignUpPage()
    addSignupEventListeners()
}
main()
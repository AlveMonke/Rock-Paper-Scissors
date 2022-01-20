const rulesEle = document.querySelector(".rules");
const scoreVal = document.querySelector("#score-val");

let points = 0;

window.scrollTo(0, document.body.scrollHeight);
onOpenScore();

rulesEle.onclick = (e) => {
    let clicked = rulesEle.classList.contains("clicked");

    if (clicked) {
        document.querySelector(".full-body-cover").remove();
        return;
    }

    let fullBodyCover = document.createElement("div");
    fullBodyCover.classList.add("full-body-cover");

    let htmlContent = `
    <div class="content-card">
            <div class="content-head">
                <h1>RULES</h1>
                <img src="../assets/images/icon-close.svg" width="27" height="27" alt="" id="cross-btn" />
            </div>
            <img src="../assets/images/image-rules.svg" alt="" />
    </div>
    `;

    fullBodyCover.innerHTML = htmlContent;

    document.body.appendChild(fullBodyCover);

    let crossBtn = document.querySelector("#cross-btn");
    crossBtn.onclick = () => {
        document.querySelector(".full-body-cover").remove();
    };
};

let options = document.querySelectorAll(".options");
options.forEach((e) => {
    e.onclick = () => {
        let allOptions = document.querySelector(".options-container");
        let triangle = document.querySelector("#triangle");

        allOptions.style.transition = "0.2s";
        triangle.style.transition = "0.2s";
        allOptions.style.opacity = "0";
        triangle.style.opacity = "0";

        setTimeout(() => {
            let housePicked = pickChoice();
            allOptions.remove();
            triangle.remove();

            let drumAudio = document.createElement("audio");
            drumAudio.src = "../assets/sounds/Drum Roll.mp3";
            drumAudio.volume = 0.08;
            drumAudio.play();

            let secondPageContainer = document.createElement("div");
            secondPageContainer.className = "second-container";
            secondPageContainer.innerHTML = `
            <h1>YOU PICKED</h1>
            <h1>THE HOUSE PICKED</h1>
            <div id="user-chose-cont">${e.outerHTML}</div>
            <div id="house-chose-cont"><div id="house-chose"></div></div>`;
            document.body.appendChild(secondPageContainer);

            setTimeout(() => {
                let tmpNode = document.createElement("div");
                tmpNode.appendChild(housePicked[1].cloneNode(true));
                document.querySelector("#house-chose-cont").innerHTML =
                    tmpNode.innerHTML;
                tmpNode.remove();

                setTimeout(() => {
                    let bwContainer = document.createElement("div");
                    bwContainer.style.transition = "1.2s";
                    bwContainer.style.opacity = "0";
                    setTimeout(() => {
                        bwContainer.style.opacity = "1";
                    }, 0);

                    bwContainer.id = "bw-container";
                    let strin = checkWinner(housePicked[0]);
                    bwContainer.innerHTML = `<div><h1>${strin[2]}</h1>
                    <button onclick='(() => {document.body.classList.add("close");setTimeout(() => {window.location.reload();}, 500);})();' class="${strin[1]}">PLAY AGAIN</button></div>`;

                    document.body.appendChild(bwContainer);
                    document
                        .querySelector(".second-container")
                        .classList.toggle("added");
                    let loc = document.querySelectorAll(
                        ".second-container .options"
                    );
                    if (strin[0] === 0) {
                        points += 1;
                        localStorage.setItem("points", JSON.stringify(points));
                        document.querySelector("#score-val").innerText = points;
                        loc[0].classList.add("win");
                    } else if (strin[0] === 1) {
                        loc[1].classList.add("win");
                    }
                }, 10);
            }, 800);
        }, 200);
    };
});

function onOpenScore() {
    scoreVal.style.opacity = "0";
    scoreVal.style.transition = ".1s";

    points = JSON.parse(localStorage.getItem("points"));
    !points ? (points = 0) : 0;
    scoreVal.innerText = points;

    scoreVal.style.opacity = "1";
}

function pickChoice() {
    let options = document.querySelectorAll(".options");
    let randomElement = options[Math.floor(Math.random() * options.length)];

    return [randomElement.id, randomElement];
}

function checkWinner(houseChoice) {
    let userChoice = document.querySelector(".options").id;

    let retStr = "";

    if (houseChoice == userChoice) {
        retStr = "A TIE";
    } else if (houseChoice == "scissors") {
        if (userChoice == "rock") {
            retStr = "YOU WIN";
        } else {
            retStr = "YOU LOSE";
        }
    } else if (houseChoice == "paper") {
        if (userChoice == "rock") {
            retStr = "YOU LOSE";
        } else {
            retStr = "YOU WIN";
        }
    } else if (houseChoice == "rock") {
        if (userChoice == "paper") {
            retStr = "YOU WIN";
        } else {
            retStr = "YOU LOSE";
        }
    }

    let retVal = 1;
    let retClass = "";

    if (retStr == "YOU WIN") {
        retClass = "win";
        retVal = 0;
    } else if (retStr == "A TIE") {
        retVal = 2;
        retClass = "tie";
    }

    return [retVal, retClass, retStr];
}

const inputSlider = document.querySelector('[inputSlider]');
const lengthDisplay = document.querySelector('[passwordLengthDisplay]');
const indicator = document.querySelector('[strength-indicator]');
const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector('#lowercase')
const numbersCheck = document.querySelector('#numbers')
const symbolsCheck = document.querySelector('#symbols')
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyMsg = document.querySelector('[data-copyMsg]');
const copyBtn = document.querySelector('[data-copy]');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const generateBtn = document.querySelector(".generateBtn");

const symbols = '~`!@#$%^&*()_-+={[}]|\:;"<,>.?/'


// initially 
let password = "";
passwordDisplay.value = password;
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");   // set strength circle color to grey
uncheck();

// uncheck all checkboxes initailly
function uncheck() {
    allCheckBox.forEach( (checkbox) => {
        checkbox.checked = false;
    })
}

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // or kuch bhi karna chahiye ? - HW
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (passwordLength * 100)/max + "% 100%";
}

// set color of indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

// get uppercase letter
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// get lowercase letter
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// get number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// get symbol
function generateSymbol() {
    let rndNum = getRndInteger(0, symbols.length)
    return symbols.charAt(rndNum);
}

// check strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator('#0f0');
    }   
    else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator('#ff0')
    }   
    else {
        setIndicator('#f00')
    }
}

// copy content
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    // to remove copy span after some time
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// handle checkbox change
function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    console.log('check count ' + checkCount);

    // special condition
    if (checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
}

// suffle password
function shufflePassword(array) {
    // Fisher Yates Method
    for(let i=array.length-1; i >= 0; i--) {
        // generate random number
        const j = Math.floor(Math.random() * (i+1));
        // swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach( (el) =>  (str += el))
    return str;
}

// event listeners

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
    console.log('input Slider');
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // if none of the checkbox is selected
    if (checkCount == 0) {   
        console.log('Not checked checkboxes');
        return;
    }

    // if check count is greater than password length
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
        console.log('password length smaller than check count ');
    }

    // remove old password before generating
    password = "";

    let funcArr = [];

    // check which checkboxes are ticked
    if (uppercaseCheck.checked) 
        funcArr.push(generateUpperCase);
    
    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // first put the required case
    for (i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    // put remaining characters
    for (i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // suffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
})


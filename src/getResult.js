document.getElementById("get-results").addEventListener("click", getResult);

const form1 = document.getElementById("form1");
form1.addEventListener('submit', getResult);

function getResult(event) {

    event.preventDefault();

    document.getElementById("divMessage").innerHTML = "";
    document.getElementById("divResponse").innerHTML = "";

    var userResponse = document.getElementById("answer"); //raspunsul dat de user
    var correctExpression = sessionStorage.getItem("resEx"); //expresia care apare in front

    if (validateResult(userResponse)) {
        var resultExpression = eval(correctExpression); //rezultatul corect al expresiei

        var trimUserResponse = userResponse.value.replace(/\s/g, '');

        var trimCorrectExpression = correctExpression.replace(/\s/g, '');

        var postfixExpression = infixToPostfix(trimCorrectExpression); //expresia postfixata

        var finalResponse = postfixExpression.concat(' = ', resultExpression);

        if (trimUserResponse == postfixExpression) {
            var message = "Congratulations! Your answer is correct! &#128513";
            message = message.fontcolor("green");
            document.getElementById("divResponse").innerHTML = finalResponse;
        } else {
            message = "Wrong answer. &#128542";
            message = message.fontcolor("red");
        }
        document.getElementById("divMessage").innerHTML = message;
        removeChildrenError();
        postProgress();
    }

}
/*Post progress for User*/
function postProgress() {
    fetch('./progress.js', {
            method: 'post',
            body: `id_exercise=${sessionStorage.getItem('exerciseId')}&username=${sessionStorage.getItem("loggedUserUsername")}`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            //console.log(jsonResp);
        })
        .catch(function() {
            console.log(err);
        })
}


function infixToPostfix(expression) {
    var stack = [];
    stack.push('N');
    var length = expression.length;
    let result = [];

    for (var i = 0; i < length; i++) {
        var char = expression[i];
        if (!isNaN(parseFloat(char)) && isFinite(char))
            result += char;

        else if (char == '(')

            stack.push('(');

        else if (char == ')') {
            while (stack[stack.length - 1] != 'N' && stack[stack.length - 1] != '(') {
                var c = stack[stack.length - 1];
                stack.pop();
                result += c;
            }
            if (stack[stack.length - 1] == '(') {
                var c = stack[stack.length - 1];
                stack.pop();
            }
        } else {
            while (stack[stack.length - 1] != 'N' && prec(char) <= prec(stack[stack.length - 1])) {
                var c = stack[stack.length - 1];
                stack.pop();
                result += c;
            }
            stack.push(char);
        }

    }
    while (stack[stack.length - 1] != 'N') {
        var c = stack[stack.length - 1];
        stack.pop();
        result += c;
    }
    return result;
}

function prec(c) {
    if (c == '^')
        return 3;
    else if (c == '*' || c == '/')
        return 2;
    else if (c == '+' || c == '-')
        return 1;
    else
        return -1;
}

function modify1(message) {
    var span = document.createElement('span')
    var span_text = document.createTextNode(message)
    span.appendChild(span_text);
    var original = document.getElementById('error1')
    original.append(span)
}

function removeChildrenError() {
    const myNode = document.getElementById('error1')
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

function changeHTML1(message) {
    removeChildrenError();
    modify1(message);
}

function validateResult(userResponse) {
    if (userResponse.value == "") {
        changeHTML1("*You didn't enter an answer.\n");
        return false;
    }
    return true;
}
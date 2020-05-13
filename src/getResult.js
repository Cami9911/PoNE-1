

document.getElementById("getresults").addEventListener("click", getResult);

function getResult() {

   

    document.getElementById("divMessage").innerHTML = "";
    document.getElementById("divResponse").innerHTML = "";

    var userResponse = document.getElementById("answer");
    var correctExpression = sessionStorage.getItem("resEx");

    console.log("resultExpression: ");
    var resultExpression = eval(correctExpression);
    console.log(resultExpression);

    

    var trimUserResponse=userResponse.value.replace(/\s/g, '');

    var trimCorrectExpression=correctExpression.replace(/\s/g, '');
    console.log("trim expression");
    console.log(trimCorrectExpression);

    console.log("postfix notation:");
    var postfixExpression=infixToPostfix(trimCorrectExpression);
    console.log(postfixExpression);

    var finalResponse = postfixExpression.concat(' = ',resultExpression);

    if (trimUserResponse == postfixExpression) {
        var message = "Congratulations! Your answer is correct! &#128513";
        message=message.fontcolor("green");
        document.getElementById("divResponse").innerHTML = finalResponse;
    }
    else
    {
        message = "Wrong answer. &#128542";
        message=message.fontcolor("red");
    }
    document.getElementById("divMessage").innerHTML = message;

}

  function infixToPostfix(expression){
    var stack = [];
    stack.push('N');
    var length=expression.length;
    let result = [];

    for ( var i=0;i<length;i++){
        var char=expression[i]; 
        if(!isNaN(parseFloat(char)) && isFinite(char))
            result += char;

            else if(char == '(') 
          
            stack.push('('); 

            else if(char == ')') 
            { 
                while(stack[stack.length-1] != 'N' && stack[stack.length-1] != '(') 
                { 
                    var c = stack[stack.length-1]; 
                    stack.pop(); 
                    result+= c; 
                } 
                if(stack[stack.length-1] == '(') 
                { 
                    var c = stack[stack.length-1]; 
                    stack.pop(); 
                } 
            } 
            else{ 
                while(stack[stack.length-1] != 'N' && prec(char) <= prec(stack[stack.length-1])) 
                { 
                    var c = stack[stack.length-1]; 
                    stack.pop(); 
                    result += c; 
                } 
                stack.push(char); 
            } 
      
    }
    while(stack[stack.length-1] != 'N') 
    { 
        var c = stack[stack.length-1]; 
        stack.pop(); 
        result += c; 
    } 
    return result;
}

function prec(c) 
{ 
    if(c == '^') 
    return 3; 
    else if(c == '*' || c == '/') 
    return 2; 
    else if(c == '+' || c == '-') 
    return 1; 
    else
    return -1; 
} 

/*var exp = "((((1+7-2)*5)/3)+10+9)-11"; 
   console.log( infixpushostfix(exp)); */
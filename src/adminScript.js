function adminFunction(){
    var sqlCommand = document.getElementById("sqlcommand");

    var xhhtp;
    const requestData = `command=${sqlCommand.value}`;
    console.log(requestData);

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response.resultSql);
            if (response.status === "Succes") {
                removeChildren();

                if ((sqlCommand.value.toLowerCase().search('select')) !== -1) {
                    for (var i = 0; i < response.resultSql.length; i++) {
                        var myjson = JSON.stringify(response.resultSql[i]);
                    
                        var myjson = myjson.replace(/"|{|}/g, "");
                        var myjson = myjson.replace(/,/g, " , ");
                        var myjson = myjson.replace(/:/g, ": ");

                        modifyHTML(myjson);
                    }
                }
                else {
                    var rez=response.resultSql.affectedRows;
                    var message='AffectedRows: ';
                    var rezFinal=message.concat(rez)
                    modifyHTML(rezFinal);
                }
                
            } else {
                console.log('Failure');
                modifyHTML("Incorrect command! Please try again!")
            }
        }
    };


    xhttp.open("POST", "./admin.js", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(requestData);
}

function modifyHTML(json) {
    var elem = document.createElement('div')
    var comment = document.createElement('p')
    var comm_text = document.createTextNode(json)
   
    comment.appendChild(comm_text);
   
    elem.appendChild(comment);
    elem.classList.add("comm");
    var original = document.getElementById('answer');
    original.append(elem)
}

function removeChildren() {
    const myNode = document.getElementById('answer')
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

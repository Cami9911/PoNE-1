document.getElementById("btn").addEventListener("click", adminFunction);

const form = document.getElementById("form");
form.addEventListener('submit', postCommentFunction);

function adminFunction(){
    event.preventDefault();

    var sqlCommand = document.getElementById("sqlcommand");
    const form = document.getElementById("form");

    fetch("./admin.js", {
        method: 'post',
        body: `command=${sqlCommand.value}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    }).then(function (resp) { //in resp se primeste rapunsul de la server
        return resp.json(); //se transforma in json si il trimite ca parametru la urmatoarea functie
    }).then(function (jsonResp) {
        console.log(jsonResp.message);
      
        if (jsonResp.message === "Command created") {
            removeChildren();

            if ((sqlCommand.value.toLowerCase().search('select')) !== -1) {
                for (var i = 0; i < jsonResp.resultSql.length; i++) {
                    var myjson = JSON.stringify(jsonResp.resultSql[i]);

                    var myjson = myjson.replace(/"|{|}/g, "");
                    var myjson = myjson.replace(/,/g, " , ");
                    var myjson = myjson.replace(/:/g, ": ");

                    modifyHTML(myjson);
                }
            }
            else {
                removeChildren();
                var rez = jsonResp.resultSql.affectedRows;
                var message = 'AffectedRows: ';
                var rezFinal = message.concat(rez)
                modifyHTML(rezFinal);
            }

        } else {
            console.log('Failure');
            modifyHTML("Incorrect command! Please try again!")
        }
        form.reset();


    })
    .catch(function() {
        console.log(err);
    })
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

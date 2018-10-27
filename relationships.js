function getFromWeb(url) {
    let response;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) { // on successful HTTP 200 OK response
          let xhr_result = xhr.responseText; // use JSON.Parse() if JSON responseText
          response = JSON.parse(xhr_result);
        }
      }
    }
    xhr.send();
    return response;
}

function pairCount(word1, word2) {
    let urlOr = "https://api.finna.fi/v1/search?bool0[]=OR&lookfor0[]=" + word1 + "&lookfor0[]=" + word2 + "&limit=0";
    let urlAnd = "https://api.finna.fi/v1/search?bool0[]=AND&lookfor0[]=" + word1 + "&lookfor0[]=" + word2 + "&limit=0";
    let responseOr = getFromWeb(urlOr);
    let responseAnd = getFromWeb(urlAnd);
    return ({"word1": word1, "word2": word2, "ORcount": responseOr.resultCount, "ANDcount": responseAnd.resultCount});
}

function pairs(siblingwords) {
    let array = [];
    for (let i = 0; i < siblingwords.length; i++) {
        for (let j = i + 1; j < siblingwords.length; j++) {
            let result = pairCount(siblingwords[i], siblingwords[j]);
            console.log(result);
        }
    }
    return array;
}
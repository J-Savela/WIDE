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

function getUriForWord(word) {
    let url = "http://api.finto.fi/rest/v1/search?vocab=yso&query=" + word + "&lang=fi";
    let response = getFromWeb(url);
    return response.results[0].uri;
}

function goBroader(uri) {
    let url = "http://api.finto.fi/rest/v1/yso/broader?uri=" + uri;
    let response = getFromWeb(url);
    return response.broader;
}

//todo make a function to get sibling concepts for word

console.log(goBroader(getUriForWord("peruna")));
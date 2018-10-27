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

function goNarrower(uri) {
    let url = "http://api.finto.fi/rest/v1/yso/narrower?uri=" + uri;
    let response = getFromWeb(url);
    return response;
}

function getSiblingWords(word) {
    try {
    let array = [];
    let wordUri = getUriForWord(word);
    let broaderArray = goBroader(wordUri);
    for (let i in broaderArray) {
        let broaderUri = broaderArray[i].uri;
        let siblings = goNarrower(broaderUri);
        let mapped = siblings.narrower.map(function(word) { return word.prefLabel });
        mapped = mapped.filter(sibling => word !== sibling);
        array = [...array, ...mapped];
    }

    let jsonObj = {"subject": word, "siblings": array};
    return jsonObj;
    } catch (err) {
        console.error(err);
        return({"subject": word, "siblings":[]})
    }
}


function pairCount(word1, word2) {
    let urlOr = "https://api.finna.fi/v1/search?bool0[]=OR&lookfor0[]=" + word1 + "&lookfor0[]=" + word2 + "&limit=0";
    let urlAnd = "https://api.finna.fi/v1/search?bool0[]=AND&lookfor0[]=" + word1 + "&lookfor0[]=" + word2 + "&limit=0";
    let responseOr = getFromWeb(urlOr).resultCount;
    let responseAnd = getFromWeb(urlAnd).resultCount;
    let ratio = Math.floor(responseAnd / responseOr * 100);

    return ({"word1": word1, "word2": word2, "ORcount": responseOr, "ANDcount": responseAnd, "ratio": ratio});
}

function hitsforOriginal(word1, word1ResultCount, word2) {
    let urlAnd = "https://api.finna.fi/v1/search?bool0[]=AND&lookfor0[]=" + word1 + "&lookfor0[]=" + word2 + "&limit=0";
    let responseAnd = getFromWeb(urlAnd).resultCount;
    let ratio = responseAnd / word1ResultCount;

    return ({"word1": word1, "word2": word2, "Word1Count": word1ResultCount, "ANDcount": responseAnd, "ratio": ratio});
}

function pairs(siblingwords, limit) {
    let array = [];
    if (siblingwords.length < limit) {
        limit = siblingwords.length;
    }
    for (let i = 0; i < limit; i++) {
        for (let j = i + 1; j < limit; j++) {
            let result = pairCount(siblingwords[i], siblingwords[j]);
            console.log(result);
        }
    }
    return array;
}

function resultCountForWord(word) {
    let url = "https://api.finna.fi/v1/search?&lookfor=" + word + "&limit=0";
    let response = getFromWeb(url);
    return response.resultCount;
}


function relationToMain(stuff) {
    let subject = stuff.subject;
    let resultCountForSubject = resultCountForWord(subject);
    let siblings = stuff.siblings;
    let array = [];
    for (let i in siblings) {
        let results = hitsforOriginal(subject, resultCountForSubject, siblings[i]);
        array.push(results);
    }
    array.sort(function(a,b){
        return parseFloat(a.ratio) - parseFloat(b.ratio);
    });
    return array;
}

function redbul(word) {
    let words = getSiblingWords(word);
    return relationToMain(words);
}
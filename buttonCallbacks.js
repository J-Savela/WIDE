//var keywords = ["punk", "punkki"]
//var from = 1980
//var to = 2000

// Fetches data using the finna API
// Input: keywords -- array of keywords
//        from     -- start year
//        to       -- end year
function getData(keywords, from, to) {
    var dataSets = keywords.map(function (kw) {
        return dataPointsForSubject(kw, from, to);
    })
    return dataSets;
}

function reformatDataForLineChart(datasSets) {
    var reformatted = datasSets.map(function(dataSet) {
        var dataX = dataSet.points.map(p => p.year);
        var dataY = dataSet.points.map(p => p.count);
        var data1 = {
            "label": dataSet.subject,
            "x": dataX,
            "y": dataY
        };
        return data1;
    })

        return reformatted
}

function drawLineChart() {
    var svgId = "line_chart";
    var startYearId = "startYearBox";
    var endYearId = "endYearBox";

    // fetch data from text fields
    var startYear = document.getElementById(startYearId).value;
    var endYear = document.getElementById(endYearId).value;
    var keywords = []; // TODO!!!!!!!!!!!!!!!!!!!!!!!!!

    // Query data from Finna
    var dataDets = getData(keywords, from, to);

    // Reformat data for plotting
    var reformatted = reformatDataForLineChart(dataDets);

    // Populate SVG element
    makeLineChart(svgId, reformatted)
}
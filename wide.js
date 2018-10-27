var x = 0;
var keywordArray = Array();

function add_element_to_array()
{
 keywordArray[x] = document.getElementById("text1").value;
 alert("The keyword "  + keywordArray[x] + " has been added");
 x++;
 document.getElementById("text1").value = "";
}

function display_array()
{
   var e = "<hr/>";   
    
   for (var y=0; y<keywordArray.length; y++)
   {
     e += "Search" + y + " = " + keywordArray[y] + "<br/>";
   }
   document.getElementById("Result").innerHTML = e;
}



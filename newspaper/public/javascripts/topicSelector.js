function selectBoxOneChange()
{
    var allSubCatId = document.getElementById("inputGroupSelect00_subCatId");
    var allCatId = document.getElementById("inputGroupSelect00_catId")
    var allSubCatName = document.getElementById("inputGroupSelect00_subCatName");
    var subCatSB = document.getElementById("inputGroupSelect02");
    var catSB = document.getElementById("inputGroupSelect01").value;
    subCatSB.innerHTML="";
    for (var i = 0; i < allCatId.length; i++)
    {
        if (allCatId[i].value == catSB)
        {
            var opt = document.createElement('option');
            opt.value = allSubCatId[i].value;
            opt.innerHTML = allSubCatName[i].value;
            subCatSB.appendChild(opt);
        }
    }
}

function radioChange1()
{
    var radio1 = document.getElementById("radio_1");
    var radio2 = document.getElementById("radio_2");
    if (radio1.checked == true)
    {
        radio2.checked = false;
        var div1 = document.getElementById("div2_1");
        var div2 = document.getElementById("div2_2");
        var div3 = document.getElementById("div1_1");
        div1.style.visibility = 'collapse';
        div2.style.visibility = 'collapse';
        div3.style.visibility = 'visible';
        var temp = document.getElementById("subCatNameInput");
        temp.value = '';
        var thisTag = document.getElementById("catNameInput");
        thisTag.required = true;
        temp.required = false;
    }
}
function radioChange2()
{
    var radio1 = document.getElementById("radio_1");
    var radio2 = document.getElementById("radio_2");
    if (radio2.checked == true)
    {
        radio1.checked = false;
        var div1 = document.getElementById("div2_1");
        var div2 = document.getElementById("div2_2");
        var div3 = document.getElementById("div1_1");
        div1.style.visibility = 'visible';
        div2.style.visibility = 'visible';
        div3.style.visibility = 'collapse';
        var temp = document.getElementById("catNameInput");
        temp.value = '';
        var thisTag = document.getElementById("subCatNameInput");
        thisTag.required = true;
        temp.required = false;
    }
}
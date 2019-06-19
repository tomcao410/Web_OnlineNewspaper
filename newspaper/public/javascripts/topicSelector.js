function selectBoxOneChange()
{
    var allSubCatId = document.getElementById("inputGroupSelect00_subCatId");
    var allCatId = document.getElementById("inputGroupSelect00_catId")
    var allSubCatName = document.getElementById("inputGroupSelect00_subCatName");
    var subCatSB = document.getElementById("inputGroupSelect02");
    var catSB = document.getElementById("inputGroupSelect01").value;
    alert(catSB);
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
var express = require('express');



// Get the modal
var modal = document.getElementById('id01');
			
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
	modal.style.display = "none";
	}
}

function registerClicked()
{
	var warning1 = document.getElementById("warning1");
	var warning2 = document.getElementById("warning2");
	var pass = document.getElementById("password").value;
	var confirmPass = document.getElementById("confirmPass").value;
	var email = document.getElementById("email").value;

	if (pass !== confirmPass)
	{
		warning1.style.visibility = 'visible';
	}
	if (!email.includes('@'))
	{
		warning2.style.visibility = 'visible';
	}
}

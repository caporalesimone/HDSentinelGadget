function onLoad()
{ 
	url.value = System.Gadget.Settings.readString("URL");
	refreshRate.value = System.Gadget.Settings.readString("REFRESHRATE");
	username.value = System.Gadget.Settings.readString("USERNAME");	
	password.value = System.Gadget.Settings.readString("PASSWORD");	
	var passwordRequiredTemp= System.Gadget.Settings.readString("PASSWORDREQUIRED");
	if(passwordRequiredTemp == "True")
	{ 
	usernameRow.className = "";
	passwordRequired.checked = true;
	}
	else{ 
	usernameRow.className = "hidden"; 
	passwordRequired.checked = false;
	}
	hddHealthOK.value = System.Gadget.Settings.read("HDDHEALTHOK");	
	hddHealthError.value = System.Gadget.Settings.read("HDDHEALTHERROR");
	hddTempOK.value = System.Gadget.Settings.read("HDDTEMPOK");
	hddTempError.value = System.Gadget.Settings.read("HDDTEMPERROR");
    System.Gadget.onSettingsClosing = onClose;
}

       

function onClose(event)
{
    if(event.closeAction == event.Action.commit) {
        System.Gadget.Settings.write("URL", url.value);
		System.Gadget.Settings.write("REFRESHRATE", refreshRate.value);
		System.Gadget.Settings.write("USERNAME", username.value);
		System.Gadget.Settings.write("PASSWORD", password.value);
		System.Gadget.Settings.write("PASSWORDREQUIRED", passwordRequired.checked);
		System.Gadget.Settings.write("HDDHEALTHOK",hddHealthOK.value);
		System.Gadget.Settings.write("HDDHEALTHERROR", hddHealthError.value);
		System.Gadget.Settings.write("HDDTEMPOK", hddTempOK.value);
		System.Gadget.Settings.write("HDDTEMPERROR", hddTempError.value);
        event.cancel = false;
    }
}


function toggleCredentials()
{ 
	if(passwordRequired.checked == 1)
	{ 
	usernameRow.className = ""; 
	}
	else{
	usernameRow.className = "hidden"; 
	}
}

function upOrDown(field, value)
{
    var temp = document.getElementById(field);
    temp.value = parseInt(temp.value) + value;
}

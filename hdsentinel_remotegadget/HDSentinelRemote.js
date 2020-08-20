//thanks to SimonSoft for the initial setup and concept
var xmlDoc=new ActiveXObject("Msxml2.DOMDocument");	
var cpuDisplay = 'none';
var hddDetailNumber;
var userName = "HDD";
var passWord = "";
var url = "servername:port";
var refreshRate = 10;
var hddTempOK = 41;
var hddTempError = 50;
var hddHealthOK = 50;
var hddHealthError = 25;
var passwordRequired;
var intervalID;

function settingsUpdated()
{
    url = System.Gadget.Settings.read("URL");	
	refreshRate = System.Gadget.Settings.read("REFRESHRATE");
	userName = System.Gadget.Settings.read("USERNAME");
	passWord = System.Gadget.Settings.read("PASSWORD");
	passwordRequired = System.Gadget.Settings.read("PASSWORDREQUIRED");
	hddHealthOK = System.Gadget.Settings.read("HDDHEALTHOK");	
	hddHealthError = System.Gadget.Settings.read("HDDHEALTHERROR");
	hddTempOK = System.Gadget.Settings.read("HDDTEMPOK");
	hddTempError = System.Gadget.Settings.read("HDDTEMPERROR");
	clearInterval(intervalID);
	intervalID = setInterval("update()",(refreshRate*1000));
    update();
}
function onLoad(){
	System.Gadget.settingsUI = "settings.html";
	System.Gadget.Flyout.file = "hddDetail.html";
	System.Gadget.onSettingsClosed = settingsUpdated;
	if (System.Gadget.Settings.read("URL") === "") {			
		System.Gadget.Settings.write("URL", url);
	}
	if (System.Gadget.Settings.read("REFRESHRATE") === "") {			
		System.Gadget.Settings.write("REFRESHRATE", refreshRate);
	}
	if (System.Gadget.Settings.read("USERNAME") === "") {			
		System.Gadget.Settings.write("USERNAME", userName);
	}
	if (System.Gadget.Settings.read("PASSWORD") === "") {			
		System.Gadget.Settings.write("PASSWORD", passWord);
	}
	if (System.Gadget.Settings.read("PASSWORDREQUIRED") === "") {			
		System.Gadget.Settings.write("PASSWORDREQUIRED", passwordRequired);
	}
	if (System.Gadget.Settings.read("HDDHEALTHOK") === "") {			
		System.Gadget.Settings.write("HDDHEALTHOK", hddHealthOK);
	}
	if (System.Gadget.Settings.read("HDDHEALTHERROR") === "") {			
		System.Gadget.Settings.write("HDDHEALTHERROR", hddHealthError);
	}
	if (System.Gadget.Settings.read("HDDTEMPOK") === "") {			
		System.Gadget.Settings.write("HDDTEMPOK", hddTempOK);
	}
	if (System.Gadget.Settings.read("HDDTEMPERROR") === "") {			
		System.Gadget.Settings.write("HDDTEMPERROR", hddTempError);
	}	
	url = System.Gadget.Settings.read("URL");	
	refreshRate = System.Gadget.Settings.read("REFRESHRATE");
	userName = System.Gadget.Settings.read("USERNAME");
	passWord = System.Gadget.Settings.read("PASSWORD");
	passwordRequired = System.Gadget.Settings.read("PASSWORDREQUIRED");
	hddHealthOK = System.Gadget.Settings.read("HDDHEALTHOK");	
	hddHealthError = System.Gadget.Settings.read("HDDHEALTHERROR");
	hddTempOK = System.Gadget.Settings.read("HDDTEMPOK");
	hddTempError = System.Gadget.Settings.read("HDDTEMPERROR");
    update();
    intervalID = setInterval("update()",(refreshRate*1000));
}
function toggleCPURows(){
	if (cpuDisplay=="") 
	{ 
	cpuDisplay = "none";
	}
	else { 
	cpuDisplay = "";
	}
	update();
}
function hddDetail(hddNumber){
	hddDetailNumber = hddNumber;
	System.Gadget.Flyout.show = true;
}
function update(){
	xmlDoc.async = false;		
	try {	
	if(passwordRequired)
	{	
	xmlDoc.load("http://"+userName+":"+passWord+"@"+url+"/xml");
	}
	else
	{
	xmlDoc.load("http://"+url+"/xml");
	}
	var upTime = xmlDoc.getElementsByTagName("System_Uptime")[0].childNodes[0].nodeValue;
	var pcName = xmlDoc.getElementsByTagName("Computer_Name")[0].childNodes[0].nodeValue;
	var cpuUsage = xmlDoc.getElementsByTagName("CPU_Usage")[0].childNodes[0].nodeValue;
	var physicalMemory = xmlDoc.getElementsByTagName("Physical_Memory_Size")[0].childNodes[0].nodeValue;
	var hddTempArray = xmlDoc.getElementsByTagName("Current_Temperature");
	var hddHealthArray = xmlDoc.getElementsByTagName("Health");	
    var tblCPUDiv = document.getElementById("cpuTableDiv");
	var tblHDDDiv = document.getElementById("hddTableDiv");
	var tblRAMDiv = document.getElementById("ramTableDiv");
	var tblInfoDiv = document.getElementById("infoTableDiv");
	
//////UPTIME//////
	upTime = upTime.replace("days,","d:");
	upTime = upTime.replace("hours,","h:");
	upTime = upTime.replace("minutes,","m:");
	upTime = upTime.replace("seconds","s");
	upTime = upTime.split(" ").join("");
	var infoTableContent = "<table id='tblInfo' border='0'><tr><td  class='systemInfoHeader' colSpan='2'>System Info - "+pcName+"</td><tr><td>UpTime:</td><td>"+upTime+"</td></tr></table>";
	tblInfoDiv.innerHTML = infoTableContent;
	
///////CPU//////
	var cpuArray = cpuUsage.split(",");
	var len=cpuArray.length;
	var totalCPU = 0;
	var cpuTableContent = "<table id='tblCPU' border='0'>";  
	while(tblCPUDiv.hasChildNodes())
	{
	   tblCPUDiv.removeChild(tblCPUDiv.firstChild);
	}
	for(var i=0; i<len; i++) {
		var value = cpuArray[i];
		var cpuPercentage = value.split(": ")[1].replace(" ","");		
		totalCPU = totalCPU + parseFloat(cpuPercentage.replace("%",""));
		cpuTableContent = cpuTableContent + "<tr style='display:"+cpuDisplay+";'"+"><td>Core "+(i+1)+"</td><td class='cpuContainerCell'><div class='cpuContainer'><div class='cpuBar' style='width:"+cpuPercentage+";'></div><div class='cpuUsage' id='cpuUsage'>"+cpuPercentage+"</div></div></td></tr>";
	}
	cpuTableContent = cpuTableContent + "<tr><td colSpan='2'><div class='CPUTotalDiv' onclick='toggleCPURows()'>Total CPU: "+parseInt(totalCPU/len)+"%</div></td></tr></table>";
	tblCPUDiv.innerHTML = cpuTableContent;

///////RAM////// 
	var totalRAM = physicalMemory.split(",")[0]; 
	var usedRAM = physicalMemory.split(",")[1];
	usedRAM = usedRAM.split(":")[1];
	usedRAM = usedRAM.split("(")[0];
	var percentRAM = physicalMemory.split("(")[1];
	percentRAM = percentRAM.split(")")[0];
	var ramTableContent = "<table id='tblRAM' border='0'><tr><td class='ramHeader'>Ram</td></tr>";
	ramTableContent = ramTableContent + "<tr><td class='ramContainerCell'><div class='ramContainer'><div id='ramBar' class='ramBar' style='width:"+percentRAM+";'></div><div class='ramUsage' id='ramUsage'>"+usedRAM+"/"+totalRAM+"</div></div></td></tr></table>";
	tblRAMDiv.innerHTML = ramTableContent;
	
//////HDD//////
	var hddTempLen = hddTempArray.length;	
	var hddTableContent = "<table id='tblHDD' border='0'>";
	hddTableContent = hddTableContent + "<tr><td colSpan='3' class='hddHeaderSpan'>Hard Drives</td></tr>";
	for(var j=0; j<hddTempLen; j++)
	{
		var hddTempNode = hddTempArray[j];
		if(hddTempNode.childNodes[0].nodeValue != "?"){
			var hddHealthNode = hddHealthArray[j];
			var hddHealth = hddHealthNode.childNodes[0].nodeValue;
			var hddCurrentTemp = hddTempNode.childNodes[0].nodeValue;
			hddHealth = hddHealth.replace(" %","");
			var hddCurrentTempNumberOnly = hddCurrentTemp.substring(0, hddCurrentTemp.length - 3);
			if((hddHealth <= hddHealthError) || (hddCurrentTempNumberOnly >= hddTempError)){
				var hddStatusIcon = 'error.png';
				var hddStatusAlt = 'Error';
			}
			else if(((hddHealth < hddHealthOK) && (hddHealth > hddHealthError)) || ((hddCurrentTempNumberOnly > hddTempOK) && (hddCurrentTempNumberOnly < hddTempError))){
				var hddStatusIcon = 'warning.png';
				var hddStatusAlt = 'Warning';
			}
			else{
				var hddStatusIcon = 'ok.png';
				var hddStatusAlt = 'Everything OK';
			}			
			hddTableContent = hddTableContent + "<tr><td><div onclick='hddDetail("+j+")'>Disk "+j+"</div></td><td><div onclick='hddDetail("+j+")'>"+hddCurrentTemp+"</div></td><td><img onclick='hddDetail("+j+")' src='"+hddStatusIcon+"' alt='"+hddStatusAlt+"'/></td></tr>";
		}
	}
	hddTableContent = hddTableContent + "</table>";
	tblHDDDiv.innerHTML = hddTableContent;
	
	
	document.getElementById("cpuTableDiv").style.display = '';
	document.getElementById("hddTableDiv").style.display = '';
	document.getElementById("ramTableDiv").style.display = '';

	//XML can't be opened or poor coding on my part
	} catch (e) {
		document.getElementById("infoTableDiv").innerHTML = "Not Connected";	
		document.getElementById("cpuTableDiv").style.display = 'none';
		document.getElementById("hddTableDiv").style.display = 'none';
		document.getElementById("ramTableDiv").style.display = 'none';
	}
	finally{
		resize('content', 0, 0);	
	}
}

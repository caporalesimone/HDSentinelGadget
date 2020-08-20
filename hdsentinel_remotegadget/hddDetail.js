function onLoad()
{
	var xmlVar = System.Gadget.document.parentWindow.xmlDoc;
	var number = System.Gadget.document.parentWindow.hddDetailNumber;
	var hddModelArray = xmlVar.getElementsByTagName("Hard_Disk_Model_ID");
	var hddPowerOnTimeArray = xmlVar.getElementsByTagName("Power_on_time");
	var hddHealthArray = xmlVar.getElementsByTagName("Health");
	var hddTempArray = xmlVar.getElementsByTagName("Current_Temperature");
	var hddPerformanceArray = xmlVar.getElementsByTagName("Performance");
	var hddLogicalDrivesArray = xmlVar.getElementsByTagName("Logical_Drive_s");
		
	var hddPartitionsArray = xmlVar.getElementsByTagName("Partition");
	//<Partition Drive="C: (Disk: #0)" Total_Space="76216 MB" Free_Space="54941 MB" Free_Space_Percent="72 %" /> 
	
	var hddPowerOnTime = hddPowerOnTimeArray[number].childNodes[0].nodeValue;
	hddPowerOnTime = hddPowerOnTime.replace(" days, ","d:");
	hddPowerOnTime = hddPowerOnTime.replace(" hours","h");
	var hddModel = hddModelArray[number].childNodes[0].nodeValue;
	var hddCurrentTemp = hddTempArray[number].childNodes[0].nodeValue;
	var hddHealth = hddHealthArray[number].childNodes[0].nodeValue;
	var hddPerformance = hddPerformanceArray[number].childNodes[0].nodeValue;
	var hddLogicalDrives = hddLogicalDrivesArray[number].childNodes[0].nodeValue;		
	detailContent= "<table id='detailTable'	border='0'><tr><td class='hddDetailHeader'>Hard Drive Detail</td></tr>";
	detailContent = detailContent + "<tr><td>Power On Time:</td></tr><tr><td align='right'>"+hddPowerOnTime+"</td></tr><tr><td>Model:</td></tr><tr><td align='right'>"+hddModel+"</td></tr>";
	detailContent = detailContent + "<tr><td>Current Temp: "+hddCurrentTemp+"</td></tr><tr><td>Health: "+hddHealth+"</td></tr>";
	detailContent = detailContent + "<tr><td>Performance: "+hddPerformance+"</td></tr><tr><td class='partitionHeader'>Partitions</td></tr>";
	
	
	var hddPartitionLength = hddPartitionsArray.length;
	for(var i=0; i<hddPartitionLength; i++) {
		if(hddPartitionsArray[i].getAttribute("Drive").indexOf("(Disk: #"+number+")") != -1)
		{
			var driveName = hddPartitionsArray[i].getAttribute("Drive");
			var firstParenthesis = driveName.indexOf(" (");
			driveName = driveName.substring(0,firstParenthesis);
			detailContent = detailContent + "<tr><td>"+ driveName +"</td></tr>";
			var totalSpace = hddPartitionsArray[i].getAttribute("Total_Space");
			var freeSpace = hddPartitionsArray[i].getAttribute("Free_Space");
			var freeSpacePercent = hddPartitionsArray[i].getAttribute("Free_Space_Percent");
			var usedSpacePercent = 100 - freeSpacePercent.replace(" %","");			
			detailContent = detailContent + "<tr><td class='hddDetailContainerCell'><div class='hddDetailContainer'><div id='hddDetailBar' class='hddDetailBar' style='width:"+usedSpacePercent+";'></div><div class='hddDetailUsage' id='hddDetailUsage'>"+freeSpace+"</div></div></td></tr>";
			
		}		
		}
		
	detailContent = detailContent + "</table>";			
	document.getElementById("detail").innerHTML = detailContent;
	resize('detail', 22, 22);
}
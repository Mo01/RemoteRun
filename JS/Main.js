

for (var i = 0; i < remoteMachines.length; i++) {
	var row = tableBody.insertRow(-1);
	for (var key in remoteMachines[i].htmlProperties) {
		var cell = row.insertCell(-1); 
		cell.innerHTML = remoteMachines[i].htmlProperties[key];
		if (key == "btnRun") {
			cell.align = "center";
		}
	}

	if (!pingMachine(remoteMachines[i].ip)) {
		setMachineStatus(i, "Unable to ping");
	}
}

function pingMachine(ip) {
	runShell(['%comspec% /c ping ' + ip + ' -n 1 -w 100 > ' + tempFilePath]);
	var pingOutput = readLinesFromFile(tempFilePath);
	return pingOutput.indexOf("Reply") > 0;
}

function setMachineStatus(id, status) {
	document.getElementById("machineStatus" + i).innerHTML = status;
}

function runShell(arrCommands) {
	var wshShell = new ActiveXObject("WScript.Shell");
	arrCommands.forEach(function(command) {
		wshShell.Run(command, 0, true);
	});
}

function readLinesFromFile(filePath) {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var fileHandle = fso.OpenTextFile(filePath);
	var lines = fileHandle.AtEndOfStream ? "" : fileHandle.ReadAll();
	fileHandle.Close();
	return lines;
}

function remoteDesktop(id) {
	var password = document.getElementById("txtPassword" + id).value;
	if (password == "" || password == undefined) {
		alert("Please provide a password");
		return;
	}

	runShell(['cmdkey /generic:' + remoteMachines[id].computerName +
			  ' /user:"' + remoteMachines[id].username +
			  '" /pass:"' + password + '"',
			  'mstsc /v:' + remoteMachines[id].computerName + ' /admin /fullscreen']);
}

function onTxtPasswordKeyUp(id) {
	if (event.keyCode == 13) {
		remoteDesktop(id);
	}
}

function onRunTest(id) {
	//todo: add logic to run test
	var test = tableHeaderTestName.innerHTML;
	if (test != "" && test != undefined) {
		alert('Run ' + tableHeaderTestName.innerHTML + ' on ' + remoteMachines[id].computerName);
	}
}

function onTestSelectionChanged(element) {
	tableHeaderTestName.innerHTML = element.value;
}

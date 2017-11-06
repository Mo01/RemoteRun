
function checkMachineStatus(id) {
    if (!canPingMachine(remoteMachines[id].ip)) {
		setMachineStatus(id, "Unable to ping");
	}
    else if (isSomeoneLoggedIn(id)) {
        setMachineStatus(id, "Someone is logged in");
    }
    else if (isTestExecuteRunning(id)) {
        setMachineStatus(id, "TestExecute is running");
    }
}

function canPingMachine(ip) {
	runShell(['%comspec% /c ping ' + ip + ' -n 1 -w 100 > ' + TEMP_FILE_PATH]);
	var pingOutput = readLinesFromFile(TEMP_FILE_PATH);
	return pingOutput.indexOf("Reply") > 0;
}

function isSomeoneLoggedIn(id) {
    var password = document.getElementById("txtPassword" + id).value;
    if (password == "" || password == undefined) {
		alert("Please provide a password");
		return;
	}
    
	runShell(['powershell -command Set-ExecutionPolicy Unrestricted',
              'powershell "' + LOGGED_IN_SCRIPT + ' ' + remoteMachines[id].computerName + ' ' + password + ' ' + TEMP_FILE_PATH + '"']);
	var loggedInOutput = readLinesFromFile(TEMP_FILE_PATH);
    return loggedInOutput.trim().toLowerCase() == 'true';
}

function isTestExecuteRunning(id) {
    var password = document.getElementById("txtPassword" + id).value;
    if (password == "" || password == undefined) {
		alert("Please provide a password");
		return;
	}
    
    var isRunningOutput = 'false'; //todo: create and run a script and set the correct result
    return isRunningOutput.trim().toLowerCase() == 'true';
}

function getMachineStatus(id) {
	return document.getElementById("machineStatus" + id).innerHTML;
}

function setMachineStatus(id, status) {
	document.getElementById("machineStatus" + id).innerHTML = status;
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
        checkMachineStatus(id);
        var status = getMachineStatus(id);
        if (status == "" || status == undefined) {
            remoteDesktop(id);
        }
        
        document.getElementById("txtPassword" + id).value = "";
	}
}

function onRunTest(id) {
    checkMachineStatus(id);
    var status = getMachineStatus(id);
    if (status == "" || status == undefined) {
        //todo: add logic to run test
        var test = spanTestName.innerHTML;
        if (test != "" && test != undefined) {
            alert('Run ' + spanTestName.innerHTML + ' on ' + remoteMachines[id].computerName);
        }
    }
    
    document.getElementById("txtPassword" + id).value = "";
}

function onTestSelectionChanged(element) {
	spanTestName.innerHTML = element.value.split(':')[0];
}
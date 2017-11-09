
function checkMachineStatus(id) {
    setMachineStatus(id, "");
    
    if (!canPingMachine(remoteMachines[id].ip)) {
		setMachineStatus(id, "Unable to ping");
        return;
	}
    
    var result = getPowershellStatus(id);
    if (result.split(":")[0] == "Error") {
        setMachineStatus(id, '<a href="javascript:openTmpFile()">Error Occurred</a>');
    }
    
    if (result.indexOf('TestExecute') >= 0) {
        setMachineStatus(id, result);
    }
    else if (result != "" && result != undefined) {
        setMachineStatus(id, "Logged on: " + result);
    }
}

function canPingMachine(ip) {
	runShell('%comspec% /c ping ' + ip + ' -n 1 -w 100 > ' + TEMP_FILE_PATH);
	var pingOutput = readLinesFromFile(TEMP_FILE_PATH);
	return pingOutput.indexOf("Reply") > 0;
}

function getPowershellStatus(id) {
    var password = document.getElementById("txtPassword" + id).value;
    if (password == "" || password == undefined) {
		alert("Please provide a password");
		return;
	}
    
	runShell(['powershell -command Set-ExecutionPolicy Unrestricted',
              'powershell "' + STATUS_SCRIPT + ' ' + remoteMachines[id].computerName + ' ' + password + ' ' + TEMP_FILE_PATH + '"']);
	return readLinesFromFile(TEMP_FILE_PATH);
}

function getMachineStatus(id) {
	return document.getElementById("machineStatus" + id).innerHTML;
}

function setMachineStatus(id, status) {
	document.getElementById("machineStatus" + id).innerHTML = status;
}

function runShell(command, windowStyle, waitOnReturn) {
    if (typeof(windowStyle)==='undefined') windowStyle = 0;
    if (typeof(waitOnReturn)==='undefined') waitOnReturn = true;
    
	var wshShell = new ActiveXObject("WScript.Shell");
    if (Array.isArray(command)) {
        command.forEach(function(commnd) {
            wshShell.Run(commnd, windowStyle, waitOnReturn);
        });
    }
    else {
        wshShell.Run(command, windowStyle, waitOnReturn);
    }
	
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

function openTmpFile() {
    runShell("notepad " + TEMP_FILE_PATH, 1, false);
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
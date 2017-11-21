
function checkMachineStatus(id) {
    setMachineStatus(id, '');
    
    if (!canPingMachine(remoteMachines[id].ip)) {
		setMachineStatus(id, 'Unable to ping');
        return;
	}
    
    var result = getPowershellStatus(id);
    if (result != '' && result != undefined) {
        if (result.split(':')[0] == 'Error') {
            setMachineStatus(id, '<a href="javascript:openTmpFile()">Error Occurred</a>');
        }
        else if (result.indexOf('Locked') >= 0) {
            var overrideSession = '</br><a href="javascript:remoteDesktop(' + id + ')">Override Session</a>';
            setMachineStatus(id, result + overrideSession);
        }
        else {
            setMachineStatus(id, result);
        }
    }
}

function canPingMachine(ip) {
	runShell('%comspec% /c ping ' + ip + ' -n 1 -w 100 > ' + TEMP_FILE_PATH);
	var pingOutput = readLinesFromFile(TEMP_FILE_PATH);
	return pingOutput.indexOf("Reply") > 0;
}

function getPowershellStatus(id) {
	runShell(['powershell -command Set-ExecutionPolicy Unrestricted',
              'powershell "' + STATUS_SCRIPT + ' ' + remoteMachines[id].computerName + ' ' + remoteMachines[id].password + ' ' + TEMP_FILE_PATH + '"']);
	return readLinesFromFile(TEMP_FILE_PATH);
}

function getMachineStatus(id) {
	return document.getElementById('machineStatus' + id).innerHTML;
}

function setMachineStatus(id, status) {
	document.getElementById('machineStatus' + id).innerHTML = status;
}

function runShell(command, windowStyle, waitOnReturn) {
    if (typeof(windowStyle)==='undefined') windowStyle = 0;
    if (typeof(waitOnReturn)==='undefined') waitOnReturn = true;
    
	var wshShell = new ActiveXObject('WScript.Shell');
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
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var fileHandle = fso.OpenTextFile(filePath);
	var lines = fileHandle.AtEndOfStream ? '' : fileHandle.ReadAll();
	fileHandle.Close();
	return lines;
}

function remoteDesktop(id) {
	runShell(['cmdkey /generic:' + remoteMachines[id].computerName +
			     ' /user:"' + remoteMachines[id].computerName + '\\' + remoteMachines[id].username +
			     '" /pass:"' + remoteMachines[id].password + '"',
			  'mstsc /v:' + remoteMachines[id].computerName + ' /admin /fullscreen']);
}

function openTmpFile() {
    runShell('notepad ' + TEMP_FILE_PATH, 1, false);
}

function onRemoteDesktop(id) {
    checkMachineStatus(id);
    var status = getMachineStatus(id);
    if (status == undefined || status.trim() == '') {
        remoteDesktop(id);
    }
}

function onTestSelectionChanged(element) {
	spanTestName.innerHTML = element.value.split(':')[0];
}
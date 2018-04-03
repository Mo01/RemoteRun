
function checkMachineStatus(id) {
    if (!canPingMachine(remoteMachines[id].ip)) {
		setMachineStatus(id, 'Unable to ping');
        return;
	}
    
    var result = getPowershellStatus(id);
    if (result != '' && result != undefined) {
        status = result;
        if (result.split(':')[0] == 'Error') {
            var errorOccurred = '<a href="javascript:showLastConsoleRedirect()">Error Occurred</a>';
            var connectAnyways = '</br><a href="javascript:remoteDesktop(' + id + ')">Connect anyways</a>';
            status = errorOccurred + connectAnyways;
        }
        else if (result.indexOf('Locked') >= 0 || result.indexOf('KVM') >= 0) {
            var overrideSession = '</br><a href="javascript:remoteDesktop(' + id + ')">Override Session</a>';
            status = result + overrideSession;
        }
        
        setMachineStatus(id, status);
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

function showLastConsoleRedirect() {
    alert(readLinesFromFile(TEMP_FILE_PATH));
}

function onRemoteDesktop(id) {
    var CHECKING_STATUS = 'Checking status...';
    setMachineStatus(id, CHECKING_STATUS);

    checkMachineStatus(id);

    var status = getMachineStatus(id);
    if (status == CHECKING_STATUS) {
        status = '';
        setMachineStatus(id, status);
    }
    
    if (status == undefined || status.trim() == '') {
        remoteDesktop(id);
    }
}

function onTestSelectionChanged(element) {
	spanTestName.innerHTML = element.value.split(':')[0];
}
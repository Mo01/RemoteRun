
var VERSION = '0.0.40';
var TEMP_FILE_PATH = new ActiveXObject('Scripting.FileSystemObject').GetSpecialFolder(2) +
    '\\RoctopusConsoleRedirect.tmp';
var STATUS_SCRIPT = '.\\PowershellScripts\\Invoke-GetStatus.ps1';
var LIST_SEPARATOR = '---------------------------';
var OPTION_INDENTOR = '&nbsp;&nbsp;';
var OPTION_INDENTOR2 = '&nbsp;&nbsp;&nbsp;';

var platform = {
	Desktop: 'Desktop',
	Android: 'Android',
	iOs: 'iOS'
};
		
var testType = {
	Acceptance: 'Acceptance',
	Performance: 'Performance',
	Regression: 'Regression'
};

var tests = [
    ['Select a test...', ''],
    [platform.Desktop, undefined],
    [OPTION_INDENTOR + testType.Acceptance, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.Desktop + ' ' + testType.Acceptance + ': Test 1'],
    [OPTION_INDENTOR + testType.Regression, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.Desktop + ' ' + testType.Regression + ': Test 1'],
    [OPTION_INDENTOR2 + 'Test 2', platform.Desktop + ' ' + testType.Regression + ': Test 2'],
    [LIST_SEPARATOR, undefined],
    [platform.Android, undefined],
    [OPTION_INDENTOR + testType.Acceptance, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.Android + ' ' + testType.Acceptance + ': Test 1'],
    [OPTION_INDENTOR + testType.Regression, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.Android + ' ' + testType.Regression + ': Test 1'],
	[LIST_SEPARATOR, undefined],
    [platform.iOs, undefined],
    [OPTION_INDENTOR + testType.Acceptance, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.iOs + ' ' + testType.Acceptance + ': Test 1'],
    [OPTION_INDENTOR + testType.Regression, undefined],
    [OPTION_INDENTOR2 + 'Test 1', platform.iOs + ' ' + testType.Regression + ': Test 1']
];

var architecture = {
    x64: 'x64',
    x32: 'x32'
};

var os = {
    v2008: 'Server 2008',
    v2012: 'Server 2012',
    v7: '7',
    v8: '8',
    v81: '8.1',
    v10: '10',
	v10IoT : '10 IoT'
};

var type = {
	powerPlus: 'PowerPlus',
	powerPro: 'PowerPro',
	powerProR: 'PowerProR',
	powerUltra: 'PowerUltra',
	rm1000: 'RM1000',
	rm1100: 'RM1100'
};

function RemoteMachine(sServerModel, sComputerName, sOS, sArchitecture, sIP, sUsername) {
    if (typeof(sUsername) === 'undefined') sUsername = 'Administrator';
    
    RemoteMachine.Count++;

    this.index = RemoteMachine.Count;
    this.serverModel = sServerModel;
    this.computerName = sComputerName;
    this.username = sUsername;
    this.os = sOS;
    this.architecture = sArchitecture;
    this.ip = sIP;

    var id = RemoteMachine.Count - 1;
    this.htmlProperties = {
        index: this.index,
        serverModel: this.serverModel,
        computerName: '<b>' + this.computerName + '</b>',
        os: this.os,
        architecture: this.architecture,
        ip: '<a href="javascript:onRemoteDesktop(' + id + ')" title="remote in">' + this.ip + '</a>',
        txtBoxPassword: '<input type="password" id="txtPassword' + id + '" class="form-control" onKeyUp="onTxtPasswordKeyUp(' + id + ')" />',
        status: '<span id="machineStatus' + id + '"></span>',
        btnRun: '<input type="button" id="btnRun' + id + '" class="btn btn-danger" value="Run Test" align="middle" />'
    };
}
// Static property.
RemoteMachine.Count = 0;

var remoteMachines = [
    new RemoteMachine(type.powerProR, 'WIN-HOHNKC8JBI8', os.v2012, architecture.x64, '172.18.0.100'),
    new RemoteMachine(type.powerPro, 'QA-POWERPRO-RB', os.v7, architecture.x64, '172.18.0.101'),
    new RemoteMachine(type.powerPro, 'DESKTOP-HHC3INQ', os.v10, architecture.x64, '172.18.0.102'),
    new RemoteMachine(type.rm1100, 'QA_RM1100', os.v81, architecture.x64, '172.18.0.103'),
    new RemoteMachine(type.rm1000, 'QA-RM1000', os.v7, architecture.x32, '172.18.0.104'),
    new RemoteMachine(type.powerUltra, 'QA-Ultra720-120', os.v2008, architecture.x64, '172.18.0.120'),
    new RemoteMachine(type.powerPlus, 'QA-Plus720-121', os.v2008, architecture.x64, '172.18.0.121'),
    new RemoteMachine(type.powerPlus, 'QA-Plus520-122', os.v10, architecture.x64, '172.18.0.122'),
    new RemoteMachine(type.powerPlus, 'QA-Plus510-123', os.v2012, architecture.x64, '172.18.0.123'),
	new RemoteMachine(type.powerPlus, 'QA-Plus520-124', os.v10IoT, architecture.x64, '172.18.0.124'),
    new RemoteMachine(type.powerUltra, 'QA-Ultra720-126', os.v2012, architecture.x64, '172.18.0.126')
];

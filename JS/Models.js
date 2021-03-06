
var VERSION = '0.0.48';
var TEMP_FILE_PATH = new ActiveXObject('Scripting.FileSystemObject').GetSpecialFolder(2) +
    '\\RoctopusConsoleRedirect.tmp';
var scripts= document.getElementsByTagName('script');
var path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
var ROCTOPUS_LOCATION = (path.split('/').slice(0, -2).join('\\')+'\\').replace('file:', '');
var STATUS_SCRIPT = ROCTOPUS_LOCATION + 'PowershellScripts\\Invoke-GetStatus.ps1';
var LIST_SEPARATOR = '---------------------------';
var OPTION_INDENTOR = '&nbsp;&nbsp;';
var OPTION_INDENTOR2 = OPTION_INDENTOR + '&nbsp;';

var platform = {
	Desktop: 'Desktop',
	Android: 'Android',
	iOs    : 'iOS'
};

var testType = {
	Acceptance : 'Acceptance',
	Performance: 'Performance',
	Regression : 'Regression'
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
    v2008 : 'Server 2008',
    v2012 : 'Server 2012',
    v7    : '7',
    v8    : '8',
    v81   : '8.1',
    v10   : '10',
	v10Iot: '10 IoT'
};

var type = {
    powerChoiceLp: 'PowerChoice LP',
    powerMicro   : 'PowerMicro',
	powerPlus    : 'PowerPlus',
	powerPro     : 'PowerPro',
	powerProR    : 'PowerProR',
	powerUltra   : 'PowerUltra',
    red3         : 'RED3',
	rm1000       : 'RM1000',
	rm1100       : 'RM1100',
    vm           : 'Virtual Machine'
};

function RemoteMachine(sServerModel, sComputerName, sOS, sArchitecture, sIP, sUsername, sPassword) {
    if (typeof(sUsername) === 'undefined') sUsername = 'Administrator';
    if (typeof(sPassword) === 'undefined') sPassword = 'Completeview!';
    
    RemoteMachine.Count++;

    this.id = RemoteMachine.Count;
    this.serverModel = sServerModel;
    this.computerName = sComputerName;
    this.os = sOS;
    this.architecture = sArchitecture;
    this.ip = sIP;
    this.username = sUsername;
    this.password = sPassword;

    var arrayIndex = RemoteMachine.Count - 1;
    this.htmlProperties = {
        id: this.id,
        serverModel: this.serverModel,
        computerName: '<b>' + this.computerName + '</b>',
        os: this.os,
        architecture: this.architecture,
        ip: '<a href="javascript:onRemoteDesktop(' + arrayIndex + ')" title="remote in">' + this.ip + '</a>',
        status: '<span id="machineStatus' + arrayIndex + '"></span>',
        btnRun: '<input type="button" id="btnRun' + arrayIndex + '" class="btn btn-danger" value="Run Test" align="middle" />'
    };
}
// Static property.
RemoteMachine.Count = 0;

var remoteMachines = [
    new RemoteMachine(type.powerUltra, 'QA-Ultra730-50', os.v2012, architecture.x64, '172.18.0.50'),
    new RemoteMachine(type.powerPlus, 'QA-Plus530-51', os.v2012, architecture.x64, '172.18.0.51'),
    new RemoteMachine(type.powerPro, 'QA-ProRev3230-52', os.v10Iot, architecture.x64, '172.18.0.52'),
    new RemoteMachine(type.powerChoiceLp, 'QA-CHOICELP230-53', os.v7, architecture.x64, '172.18.0.53'),
    new RemoteMachine(type.red3, 'QA-RED3-54', os.v7, architecture.x64, '172.18.0.54'),
    new RemoteMachine(type.powerMicro, 'QA-Micro3040-55', os.v7, architecture.x64, '172.18.0.55'),
    new RemoteMachine(type.powerProR, 'WIN-HOHNKC8JBI8', os.v2012, architecture.x64, '172.18.0.100'),
    new RemoteMachine(type.powerPro, 'QA-PRORB-101', os.v7, architecture.x64, '172.18.0.101', 'Administrator', 'completeview'),
    new RemoteMachine(type.powerPro, 'DESKTOP-HHC3INQ', os.v10, architecture.x64, '172.18.0.102', 'Administrator', 'completeview'),
    new RemoteMachine(type.rm1100, 'QA_RM1100', os.v81, architecture.x64, '172.18.0.103'),
    new RemoteMachine(type.rm1000, 'QA-RM1000-104', os.v7, architecture.x32, '172.18.0.104', 'Administrator', 'completeview'),
    new RemoteMachine(type.powerUltra, 'QA-Ultra720-120', os.v2008, architecture.x64, '172.18.0.120'),
    new RemoteMachine(type.powerPlus, 'QA-Plus720-121', os.v2008, architecture.x64, '172.18.0.121'),
    new RemoteMachine(type.powerPlus, 'QA-Plus520-122', os.v10, architecture.x64, '172.18.0.122'),
    new RemoteMachine(type.powerPlus, 'QA-Plus510-123', os.v2012, architecture.x64, '172.18.0.123'),
    new RemoteMachine(type.powerPlus, 'QA-Plus520-124', os.v10Iot, architecture.x64, '172.18.0.124'),
    new RemoteMachine(type.powerUltra, 'QA-Ultra720-125', os.v2012, architecture.x64, '172.18.0.125'),
    new RemoteMachine(type.powerUltra, 'QA-Ultra720-126', os.v2012, architecture.x64, '172.18.0.126'),
    new RemoteMachine(type.vm, 'QA-TC-Floater', os.v10, architecture.x64, '172.18.0.250')
];

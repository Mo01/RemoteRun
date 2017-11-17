Param(
  [string]$computer,
  [string]$password,
  [string]$outputRedirectFile # Unable to redirect output from cmd because a different encoding is used.
)

$userName = $computer + "\Administrator"
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList $userName, $securePassword

$result = Invoke-Command -Computername $computer -Credential $credential -FilePath .\PowershellScripts\GetStatus.ps1
if (-Not([string]::IsNullOrEmpty($Error[0])))
{
    $result = "Error:" + $Error[0]
}

$result | Out-File $outputRedirectFile -Encoding ASCII
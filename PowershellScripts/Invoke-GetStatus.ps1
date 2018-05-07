Param (
  [string]$computer,
  [string]$password,
  [string]$outputRedirectFile # Unable to redirect output from cmd because a different encoding is used.
)

function Get-ScriptDirectory {
    Split-Path -parent $PSCommandPath
}

$userName = $computer + "\Administrator"
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList $userName, $securePassword

$Error.Clear()
$result = Invoke-Command -Computername $computer -Credential $credential -FilePath "$(Get-ScriptDirectory)\GetStatus.ps1"
if (-Not([string]::IsNullOrEmpty($Error[0])))
{
    $result = "Error:" + $Error[0]
}

$result | Out-File $outputRedirectFile -Encoding ASCII
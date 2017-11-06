Param(
  [string]$computer,
  [string]$password,
  [string]$outputRedirectFile # Unable to redirect output from cmd because a different encoding is used.
)

$userName = $computer + "\Administrator"
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList $userName, $securePassword

$result = Invoke-Command -Computername $computer -Credential $credential -Scriptblock {quser}

$output = ""
if ([string]::IsNullOrEmpty($Error[0]))
{
    if ($result -match "Active")
    {
        $output = $true
    }
    else
    {
        $output = $false
    }
}
else
{
    $output = $Error[0]
}

$output | Out-File $outputRedirectFile -Encoding ASCII
# Author of functions below: Frank Peter
#source: http://www.out-web.net/?p=1479
<#
  .SYNOPSIS
    Returns the RDS session ID of a given user.

  .DESCRIPTION
    Leverages query.exe session in order to get the given user's session ID.

  .EXAMPLE
    Get-RDSSessionId

  .EXAMPLE
    Get-RDSSessionId -UserName johndoe

  .OUTPUTS
    System.String
#>
function Get-RDSSessionId
{
  [CmdletBinding()]
  Param
  (
  # Identifies a user name (default: current user)
    [Parameter(ValueFromPipeline = $true)]
    [System.String] 
    $UserName = $env:USERNAME
  )
  $returnValue = $null
  try
  {
    $ErrorActionPreference = 'Stop'
    $output = query.exe session $UserName |
      ForEach-Object {$_.Trim() -replace '\s+', ','} |
        ConvertFrom-Csv
    $returnValue = $output.ID
  }
  catch
  {
    $_.Exception | Write-Error
  }
  New-Object psobject $returnValue
}

<#
  .SYNOPSIS
    Returns the RDS client name

  .DESCRIPTION
    Returns the value of HKCU:\Volatile Environment\<SessionID>\CLIENTNAME

  .EXAMPLE
    Get-RDSClientName -SessionId 4

  .EXAMPLE
    Get-RDSClientName -SessionId Get-RDSSessionId

  .OUTPUTS
    System.String
#>
function Get-RDSClientName
{
  [CmdletBinding()]
  Param
  (
  # Identifies a RDS session ID
    [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
    [System.String] 
    $SessionId
  )
  $returnValue = $null
  if ($SessionId -ne 'Disc')
  {
	  $regKey = 'HKCU:\Volatile Environment\{0}' -f $SessionId
	  try
	  {
		$ErrorActionPreference = 'Stop'
		$regKeyValues = Get-ItemProperty $regKey
		$sessionName = $regKeyValues | ForEach-Object {$_.SESSIONNAME}
		if ($sessionName -ne 'Console')
		{
		  $returnValue = $regKeyValues | ForEach-Object {$_.CLIENTNAME}
		}
		else
		{
		 #Write-Warning 'Console session'
	     $returnValue = 'KVM Session' #$env:COMPUTERNAME
		}
	  }
	  catch
	  {
		$_.Exception | Write-Error
	  }
  }
  New-Object psobject $returnValue
}
# End Author of Frank Peter

function Get-LoggedInStatus
{
    $returnValue = Get-RDSSessionId | Get-RDSClientName
    if (-Not([string]::IsNullOrEmpty($Error[0])))
    {
        $returnValue = "Error:" + $Error[0]
    }
    elseif (-Not([string]::IsNullOrEmpty($returnValue)))
    {
        $returnValue = "Logged on: " + $returnValue
    }
    New-Object psobject $returnValue
}

function Get-TestExecuteStatus
{
    $returnValue = Get-Process TestExecute -ErrorAction SilentlyContinue
    if ($returnValue -ne $null)
    {
        $returnValue = "TestExecute is running"
    }
    return $returnValue
}

# Start.
$status = Get-LoggedInStatus
if ([string]::IsNullOrEmpty($status))
{
    $status = Get-TestExecuteStatus
}

$status
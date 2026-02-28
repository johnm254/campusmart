Option Explicit

Dim fso, shell, currentDir, backendZip, frontendZip
Dim backendFolder, frontendDistFolder

' Create file system and shell objects
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Shell.Application")

' Get current directory
currentDir = fso.GetAbsolutePathName(".")

' Define paths
backendFolder = currentDir & "\backend"
frontendDistFolder = currentDir & "\frontend\dist"
backendZip = currentDir & "\campusmart-backend.zip"
frontendZip = currentDir & "\campusmart-frontend.zip"

' Delete existing ZIP files if they exist
If fso.FileExists(backendZip) Then
    fso.DeleteFile backendZip
End If
If fso.FileExists(frontendZip) Then
    fso.DeleteFile frontendZip
End If

WScript.Echo "Creating ZIP files for HostPinnacle deployment..."
WScript.Echo ""

' Create backend ZIP
WScript.Echo "Creating backend ZIP..."
CreateZipFile backendZip, backendFolder
WScript.Echo "✓ Backend ZIP created: campusmart-backend.zip"

' Create frontend ZIP
WScript.Echo "Creating frontend ZIP..."
CreateZipFile frontendZip, frontendDistFolder
WScript.Echo "✓ Frontend ZIP created: campusmart-frontend.zip"

WScript.Echo ""
WScript.Echo "═══════════════════════════════════════════════════════════════"
WScript.Echo "  ZIP FILES CREATED SUCCESSFULLY!"
WScript.Echo "═══════════════════════════════════════════════════════════════"
WScript.Echo ""
WScript.Echo "Files created:"
WScript.Echo "  • campusmart-backend.zip"
WScript.Echo "  • campusmart-frontend.zip"
WScript.Echo ""
WScript.Echo "Next steps:"
WScript.Echo "  1. Upload campusmart-backend.zip to HostPinnacle"
WScript.Echo "  2. Upload campusmart-frontend.zip to HostPinnacle"
WScript.Echo "  3. Follow instructions in FINAL_INSTRUCTIONS.txt"
WScript.Echo ""
WScript.Echo "═══════════════════════════════════════════════════════════════"

' Function to create ZIP file
Sub CreateZipFile(zipPath, folderPath)
    Dim zipFile, folder, item, zipFolder
    
    ' Create empty ZIP file
    Set zipFile = fso.CreateTextFile(zipPath, True)
    zipFile.Write Chr(80) & Chr(75) & Chr(5) & Chr(6) & String(18, Chr(0))
    zipFile.Close
    
    ' Wait for ZIP file to be created
    WScript.Sleep 500
    
    ' Get folder to compress
    Set folder = fso.GetFolder(folderPath)
    
    ' Open ZIP file with Shell
    Set zipFolder = shell.NameSpace(zipPath)
    
    ' Add all items from folder to ZIP
    For Each item In folder.Files
        zipFolder.CopyHere item.Path, 4 + 16 + 1024
    Next
    
    For Each item In folder.SubFolders
        zipFolder.CopyHere item.Path, 4 + 16 + 1024
    Next
    
    ' Wait for compression to complete
    WScript.Sleep 2000
    
    ' Wait until ZIP file is ready
    Dim timeout
    timeout = 0
    Do While zipFolder.Items.Count < folder.Files.Count + folder.SubFolders.Count
        WScript.Sleep 500
        timeout = timeout + 500
        If timeout > 30000 Then Exit Do ' 30 second timeout
    Loop
End Sub

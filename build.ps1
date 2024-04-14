# https://stackoverflow.com/questions/20949892/using-powershell-as-terminal-in-intellij-idea-ides-like-pycharm-phpstorm-or-rub
# I updated the powershell.exe path in IntelliJ -> Settings -> Terminal
# Opened a powershell instance in Admin mode.
# Executed Set-ExecutionPolicy Unrestricted -Scope CurrentUser
# Restarted IntelliJ and the issue was solved.

#powershell -Command "(gc dist/index.html -Encoding UTF8) -replace '/assets/', 'assets/' | Out-File -encoding UTF8 dist/index.html"
#powershell -Command "(gc dist/assets/index.*.js -Encoding UTF8) -replace '/assets/', 'assets/' | Out-File -encoding UTF8 dist/index.html"

# replace index.*.html
(gc dist/index.html -Encoding UTF8) -replace '/assets/', 'assets/' | Out-File -encoding UTF8 dist/index.html

# replace index.*.js
$var=Get-ChildItem -Path dist/assets -Recurse -Filter 'index.*.js' | Select-Object FullName
(gc $var.FullName -Encoding UTF8) -replace '/assets/', 'assets/' | Out-File -encoding UTF8 $var.FullName

# replace index.*.css
$var=Get-ChildItem -Path dist/assets -Recurse -Filter 'index.*.css' | Select-Object FullName
(gc $var.FullName -Encoding UTF8) -replace '/assets/', '' | Out-File -encoding UTF8 $var.FullName

# replace index.*.css
$var=Get-ChildItem -Path dist/assets -Recurse -Filter 'index.*.js' | Select-Object FullName
(gc $var.FullName -Encoding UTF8) -replace '"assets/IeecloudMenuItemController', 'window.location.pathname.match(/^\/([^\/]+)/)[1]+"/assets/IeecloudMenuItemController' | Out-File -encoding UTF8 $var.FullName


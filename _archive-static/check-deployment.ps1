# Check Netlify Deployment and Form Status
# Run this script to diagnose form submission issues

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NETLIFY DEPLOYMENT & FORM CHECKER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Site ID
$siteId = "c19958dc-f3e2-4cdb-bd30-9da6d31e8da9"

# Check latest deployment
Write-Host "[1/4] Checking latest deployment..." -ForegroundColor Yellow
try {
    $deploys = netlify api listSiteDeploys --data "{`"site_id`":`"$siteId`"}" | ConvertFrom-Json
    $latest = $deploys[0]
    
    Write-Host "  Deploy ID: $($latest.id)" -ForegroundColor Green
    Write-Host "  State: $($latest.state)" -ForegroundColor Green
    Write-Host "  Created: $($latest.created_at)" -ForegroundColor Green
    Write-Host "  Context: $($latest.context)" -ForegroundColor Green
    
    if ($latest.state -eq "ready") {
        Write-Host "  ✅ Deployment is LIVE" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Deployment state: $($latest.state)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Error checking deployments: $_" -ForegroundColor Red
}

Write-Host "`n[2/4] Checking form registration..." -ForegroundColor Yellow
try {
    $forms = netlify api listSiteForms --data "{`"site_id`":`"$siteId`"}" | ConvertFrom-Json
    
    if ($forms.Count -eq 0) {
        Write-Host "  ⚠️  NO FORMS FOUND - This is the problem!" -ForegroundColor Red
        Write-Host "  The build bot did not detect any forms during deployment." -ForegroundColor Red
    } else {
        Write-Host "  ✅ Found $($forms.Count) form(s)" -ForegroundColor Green
        foreach ($form in $forms) {
            Write-Host "    - Name: $($form.name)" -ForegroundColor Cyan
            Write-Host "      ID: $($form.id)" -ForegroundColor Gray
            Write-Host "      Submissions: $($form.submission_count)" -ForegroundColor Gray
            Write-Host "      Fields: $($form.fields.Count)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  ❌ Error checking forms: $_" -ForegroundColor Red
}

Write-Host "`n[3/4] Links to check manually:" -ForegroundColor Yellow
Write-Host "  Site Dashboard: https://app.netlify.com/sites/admiralenergy" -ForegroundColor Cyan
Write-Host "  Forms Dashboard: https://app.netlify.com/sites/admiralenergy/forms" -ForegroundColor Cyan
Write-Host "  Deploys: https://app.netlify.com/sites/admiralenergy/deploys" -ForegroundColor Cyan
Write-Host "  Form Settings: https://app.netlify.com/sites/admiralenergy/settings/forms" -ForegroundColor Cyan

Write-Host "`n[4/4] Git status check:" -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "  ⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
    git status --short
} else {
    Write-Host "  ✅ Working directory clean" -ForegroundColor Green
}

$lastCommit = git log -1 --oneline
Write-Host "  Last commit: $lastCommit" -ForegroundColor Gray

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Check the Forms Dashboard link above" -ForegroundColor White
Write-Host "2. Look for 'admiral-contact' form" -ForegroundColor White
Write-Host "3. If NOT listed, the form wasn't detected during build" -ForegroundColor White
Write-Host "4. If listed, check submission count" -ForegroundColor White
Write-Host "5. Review DIAGNOSTIC_REPORT.md for detailed analysis`n" -ForegroundColor White

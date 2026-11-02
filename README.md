# RC11 GAS public deployment

This repository contains the **generated Apps Script source snapshot** of RC11, for deploying to the *existing* Apps Script project with free public GitHub Actions and [clasp](https://github.com/google/clasp).

The original `rc11-next` project, its history and the Google Sheets/Todoist data remain private. This repository was initialized with a fresh Git history. **Never commit access tokens, Google OAuth credentials, study results, `.clasp.json`, or `.clasprc.json`.**

## Current status
- GAS source: exported from private `rc11-next` commit `5a021612388f821a039de8e1fa8cd4707f97c772` (history reconciliation included).
- Automatic deployment: **not activated**. An authenticated first deployment and read-back verification are still required.
- Secrets: configure `RC11_GAS_SCRIPT_ID` (existing script ID) and `CLASPRC_JSON` (Google clasp OAuth config) in this repository's **Actions secrets**. Do not paste them in chat.
- All code updates must originate from the private source repository and be checked for embedded credentials/personal history before publishing.

## Deploy
Use Actions → `RC11 GAS deploy (manual first)` → Run workflow after secrets are configured.
The workflow verifies required RC11 functions, pushes `Code.gs` and `appsscript.json` with clasp, and then reads them back for comparison.

**Important:** `clasp push` replaces the target Apps Script project's source files. Existing script properties and spreadsheet data are not included in the source bundle, but make sure the correct Script ID is used.

Once the first manual run succeeds and live code matches, push-triggered automatic deployment can be enabled in a separate workflow change.

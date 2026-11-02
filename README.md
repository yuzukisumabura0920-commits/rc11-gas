# RC11 GAS — public deployment bridge

This repository contains **only the generated Apps Script runtime** of RC11, plus validation and deployment automation. The original **private** source repository remains `rc11-next`; learning data and Todoist credentials remain in private services.

## Deployment status

- Public repository → GitHub Actions → clasp → existing GAS: first manual push and remote source read-back **passed** (run [41481014420](https://github.com/yuzukisumabura0920-commits/rc11-gas/actions/runs/41481014420)).
- Public `Code.gs` or `appsscript.json` changes on `main`: **automatically deploy** through [deploy.yml](.github/workflows/deploy.yml); workflow dispatch remains available.
- Private `rc11-next/main` → public GAS: [sync-private.yml](.github/workflows/sync-private.yml) checks every ~30 minutes and rebuilds source on a free public runner. **Not activated until the read-only private repository secret is configured.**
- This is a source deployment, not an execution of the RC11 study-history repair function; review/Todoist operational state must be checked separately.

## One-time private source authorization

Create a **fine-grained GitHub personal access token** for only `yuzukisumabura0920-commits/rc11-next` with **Repository permissions → Contents: Read-only**. Other repository permissions do not need Write. Save it as the public repository Actions secret `RC11_PRIVATE_READ_TOKEN`.

This token is used by `sync-private.yml` to check out the private repo into a temporary runner workspace, build the latest `Code.gs`, run validation and publish only `Code.gs` and `appsscript.json`. The private source tree, study history, legacy data, test fixtures and tokens are **never committed** to the public repo.

After a new validated public source commit, the same workflow directly calls the clasp deployment workflow against that exact public commit. GitHub's built-in `GITHUB_TOKEN` does not retrigger `push` workflows, so this explicit call is necessary.

## Existing GAS authorization

The public repository's **Actions secrets** are:
- `RC11_GAS_SCRIPT_ID`: ID of the existing Apps Script project.
- `CLASPRC_JSON`: Google OAuth credentials for clasp, private to GitHub Actions.
- `RC11_PRIVATE_READ_TOKEN`: read-only access to the old source repo (still pending).

**Never commit or paste any of these values into source, issues, actions logs or chats.**

## Safety constraints

- Only commit `Code.gs` and `appsscript.json` from the private build. The sync importer enforces size, syntax, required functions and checks for recognizable credentials, email addresses and spreadsheet IDs.
- The validator is defense in depth, not proof that every possible private datum is absent. Only put approved source changes on private `main`.
- The release uses standard `ubuntu-latest` on a **public repository**, not paid larger runners.
- `clasp push --force` replaces the code files in the target project. Spreadsheet data and script properties are separate, but live code always must be validated.
- Source-sync schedules can be delayed by GitHub. The schedule is near 17 and 47 minutes past the hour, not an instant web hook.
- For emergencies, disable the `RC11 GAS deploy` and `RC11 sync private source` workflows in Actions to stop deployments.

## Manual checks

- [Public source validation](.github/workflows/source-check.yml)
- [Private source sync](.github/workflows/sync-private.yml)
- [GAS deployment](.github/workflows/deploy.yml)

// Import *only* the deployable GAS snapshot from the private source repository.
// No source history, event data, credentials, fixtures or repository files are copied.
import {readFile, writeFile} from 'node:fs/promises';
import vm from 'node:vm';

const sourcePath=process.argv[2];
if(!sourcePath) throw Error('USAGE: import-private-export.mjs source-export.txt');
const raw=await readFile(sourcePath,'utf8');
const codeMarker='==================== Code.gs ====================';
const manifestMarker='==================== appsscript.json ====================';
const endMarker='==================== END ====================';
const codeAt=raw.indexOf(codeMarker),manifestAt=raw.indexOf(manifestMarker),endAt=raw.indexOf(endMarker);
if(codeAt<0||manifestAt<codeAt||endAt<manifestAt)throw Error('MALFORMED_PRIVATE_GAS_EXPORT');
if(raw.indexOf(codeMarker,codeAt+1)!==-1||raw.indexOf(manifestMarker,manifestAt+1)!==-1)throw Error('DUPLICATE_EXPORT_SECTIONS');
const code=raw.slice(codeAt+codeMarker.length,manifestAt).trim()+'\n';
const manifestRaw=raw.slice(manifestAt+manifestMarker.length,endAt).trim();
const manifest=JSON.parse(manifestRaw);
if(code.length<100000||code.length>1000000)throw Error('GAS_EXPORT_SIZE_HOLD');
if(manifest.runtimeVersion!=='V8'||manifest.timeZone!=='Asia/Tokyo'||!Array.isArray(manifest.oauthScopes))throw Error('GAS_MANIFEST_HOLD');
if(!['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/script.external_request'].every(s=>manifest.oauthScopes.includes(s)))throw Error('GAS_OAUTH_SCOPES_HOLD');
for(const entry of ['function rc11DailyRun(','function rc11DailyRepairHistory(','function rc11DailyImportLegacy(','function rc11DailyTodoistSend_(','function rc11NextClockFiveMinutes(']){
 if(!code.includes(entry))throw Error('INCOMPLETE_GAS_SNAPSHOT');
}
// Block recognizable secrets and personal contact details in the public artifact.
// This is a defense-in-depth filter, not a substitute for source review.
const risky=[
 /AIza[0-9A-Za-z_-]{30,}/,
 /gh[pousr]_[0-9A-Za-z_]{16,}/,
 /github_pat_[0-9A-Za-z_]{20,}/,
 /xox[baprs]-[A-Za-z0-9-]{16,}/,
 /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
 /(?:^|[^A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}/,
 /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
 /\b1[A-Za-z0-9_-]{35,50}\b/
];
if(risky.some(p=>p.test(code)))throw Error('PUBLIC_SOURCE_PRIVACY_REVIEW_REQUIRED');
new vm.Script(code,{filename:'Code.gs'});
const formatted=JSON.stringify(manifest,null,2)+'\n';
const priorCode=await readFile('Code.gs','utf8').catch(()=>null);
const priorManifest=await readFile('appsscript.json','utf8').catch(()=>null);
if(priorCode===code&&priorManifest===formatted){
 console.log('RC11_SOURCE_UNCHANGED');
 process.exit(0);
}
await writeFile('Code.gs',code);
await writeFile('appsscript.json',formatted);
console.log('RC11_SOURCE_SYNC_PREPARED');

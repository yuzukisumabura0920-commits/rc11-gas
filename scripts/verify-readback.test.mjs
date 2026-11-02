import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const verifier=resolve('scripts/verify-readback.mjs');
test('readback proves checked-out source SHA, distinct from workflow trigger, and rejects mismatches',()=>{
 const dir=mkdtempSync(join(tmpdir(),'rc11-readback-'));
 try{
  const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');mkdirSync(join(dir,'pulled'));
  const manifest={runtimeVersion:'V8',timeZone:'Asia/Tokyo',oauthScopes:['scope-a','scope-b']};
  for(const path of ['Code.gs','pulled/Code.js'])writeFileSync(join(dir,path),'function fixture() {}\n');
  for(const path of ['appsscript.json','pulled/appsscript.json'])writeFileSync(join(dir,path),JSON.stringify(manifest));
  git('add','.');git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-qm','fixture');
  const run=()=>execFileSync(process.execPath,[verifier,join(dir,'pulled')],{cwd:dir,encoding:'utf8',env:{...process.env,GITHUB_SHA:'1'.repeat(40)},stdio:['ignore','pipe','pipe']});
  const result=JSON.parse(run());assert.equal(result.status,'GAS_CODE_REFLECTED');assert.equal(result.sourceCommit,git('rev-parse','HEAD'));assert.equal(result.workflowCommit,'1'.repeat(40));assert.notEqual(result.sourceCommit,result.workflowCommit);
  writeFileSync(join(dir,'pulled/Code.js'),'different');assert.throws(run,/REMOTE_GAS_CODE_MISMATCH/);
  writeFileSync(join(dir,'pulled/Code.js'),'function fixture() {}\r\n');
  writeFileSync(join(dir,'pulled/appsscript.json'),JSON.stringify({...manifest,timeZone:'UTC'}));assert.throws(run,/REMOTE_GAS_MANIFEST_MISMATCH/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

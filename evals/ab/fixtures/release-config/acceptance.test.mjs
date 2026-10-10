import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseConfig} from './module.mjs';
test('required release settings fail closed and caller input stays unchanged',()=>{
 const base={PORT:'8080',DATABASE_PATH:'/data/invoices.db',SECRET_KEY:'synthetic-secret'};
 for(const patch of [{PORT:'0'},{PORT:'65536'},{PORT:'8e2'},{PORT:'8.5'},{PORT:'no'},
  {DATABASE_PATH:''},{DATABASE_PATH:' '},{SECRET_KEY:''},{SECRET_KEY:undefined}])
   assert.throws(()=>releaseConfig({...base,...patch}));
 const input=Object.freeze({...base,PUBLIC_APP_NAME:'Invoices for friends',OTHER_SECRET:'synthetic-extra'});
 const actual=releaseConfig(input);
 assert.deepEqual(actual,{port:8080,databasePath:base.DATABASE_PATH,secretKey:base.SECRET_KEY,
   publicConfig:{appName:'Invoices for friends'}});
 assert.deepEqual(input,{...base,PUBLIC_APP_NAME:'Invoices for friends',OTHER_SECRET:'synthetic-extra'});
});

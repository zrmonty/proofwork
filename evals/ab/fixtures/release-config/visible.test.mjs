import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseConfig} from './module.mjs';
test('public configuration does not expose server capabilities',()=>{
 const config=releaseConfig({PORT:'8080',DATABASE_PATH:'/data/invoices.db',SECRET_KEY:'synthetic-secret'});
 assert.deepEqual(config.publicConfig,{appName:'Invoices'});
});

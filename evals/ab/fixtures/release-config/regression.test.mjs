import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseConfig} from './module.mjs';
test('valid existing port and database path retain their meaning',()=>{
 const result=releaseConfig({PORT:'8080',DATABASE_PATH:'/data/invoices.db',SECRET_KEY:'synthetic-secret'});
 assert.equal(result.port,8080);assert.equal(result.databasePath,'/data/invoices.db');
 assert.equal(result.secretKey,'synthetic-secret');
});

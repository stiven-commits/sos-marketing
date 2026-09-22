const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('server.js', 'utf8');
const helperStart = source.indexOf('function getStableContactIdentity');
const handlerStart = source.indexOf("app.post('/webhook/chatwoot'", helperStart);
const sandbox = {};
vm.runInNewContext(source.slice(helperStart, handlerStart), sandbox);

const firstMessage = {
  sender: { id: 44, additional_attributes: { social_instagram_user_name: 'bianca.clrack' } },
  conversation: { contact_inbox: { source_id: 'ig_psid_123', contact_id: 44 } },
};
const renamedMessage = {
  sender: { id: 44, additional_attributes: { social_instagram_user_name: 'bianca.bardo' } },
  conversation: { contact_inbox: { source_id: 'ig_psid_123', contact_id: 44 } },
};

assert.equal(
  sandbox.getStableContactIdentity(firstMessage),
  sandbox.getStableContactIdentity(renamedMessage),
);
assert.equal(
  sandbox.buildContactKey(1, '6', sandbox.getStableContactIdentity(firstMessage)),
  'chatwoot:1:6:source:ig_psid_123',
);
assert.equal(sandbox.getInstagramUsername(renamedMessage), 'bianca.bardo');
assert.equal(
  sandbox.getStableContactIdentity({ sender: { id: 44 }, conversation: { contact_inbox: { contact_id: 44 } } }),
  'contact:44',
);

console.log('contact identity tests passed');

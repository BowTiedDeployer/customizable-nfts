import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const CONTRACT_NAME = 'stacks-degens';
const MINT_URI = 'mint-uri';
const BURN_TOKEN = 'burn-token';
const GET_TOKEN_URI = 'get-token-uri';

//mint-url
Clarinet.test({
  name: 'degens_mint-uri_deployer_deployer_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(deployer.address), types.ascii(url)], deployer.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'degens_mint-uri_deployer_address_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    // console.log(`block `, block)
    // console.log(`block `, block.receipts[0].events)
  },
});

Clarinet.test({
  name: 'degens_mint-uri_address_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const sender = accounts.get('wallet_1')!;
    const receiver = accounts.get('wallet_2')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], sender.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(100);
  },
});

//get-token-uri
Clarinet.test({
  name: 'degens_get-token-uri_existendId_okUrl',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);

    const token_uri = chain.callReadOnlyFn(CONTRACT_NAME, GET_TOKEN_URI, [types.uint(1)], deployer.address);
    const token_uri_result = token_uri.result;
    token_uri_result.expectOk();
    assertEquals(token_uri_result, `(ok (some "${url}"))`);
  },
});

Clarinet.test({
  name: 'degens_get-token-uri_inexistendId_okNone',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);

    const token_uri = chain.callReadOnlyFn(CONTRACT_NAME, GET_TOKEN_URI, [types.uint(2)], deployer.address);
    const token_uri_result = token_uri.result;
    token_uri_result.expectOk();
    assertEquals(token_uri_result, `(ok none)`);
  },
});

//burn-token
Clarinet.test({
  name: 'degens_burn-token_owner_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], receiver.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'degens_burn-token_deployer_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], deployer.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(403);
  },
});

Clarinet.test({
  name: 'degens_burn-token_address_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URI, [types.principal(receiver.address), types.ascii(url)], deployer.address),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], notOwner.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(403);
  },
});

Clarinet.test({
  name: 'degens-token_address_tokenInexistent_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user = accounts.get('wallet_1')!;

    let block = chain.mineBlock([Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], user.address)]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(403);
  },
});

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const CONTRACT_NAME = 'backgrounds';
const MINT_URL = 'mint-url';
const MINT_NAME = 'mint-name';
const BURN_TOKEN = 'burn-token';
const GET_TOKEN_URI = 'get-token-uri';

Clarinet.test({
  name: 'Ensure that <...>',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let block = chain.mineBlock([
      /*
       * Add transactions with:
       * Tx.contractCall(...)
       */
    ]);
    assertEquals(block.receipts.length, 0);
    assertEquals(block.height, 2);

    block = chain.mineBlock([
      /*
       * Add transactions with:
       * Tx.contractCall(...)
       */
    ]);
    assertEquals(block.receipts.length, 0);
    assertEquals(block.height, 3);
  },
});

//mint-url
Clarinet.test({
  name: 'backgrounds_mint-url_deployer_deployer_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URL, [types.principal(deployer.address), types.ascii(url)], deployer.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'backgrounds_mint-url_deployer_address_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URL, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    // console.log(`block `, block)
    // console.log(`block `, block.receipts[0].events)
  },
});

Clarinet.test({
  name: 'backgrounds_mint-url_address_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const sender = accounts.get('wallet_1')!;
    const receiver = accounts.get('wallet_2')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URL, [types.principal(receiver.address), types.ascii(url)], sender.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(100);
  },
});

//get-token-uri
Clarinet.test({
  name: 'backgrounds_get-token-uri_existendId_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URL, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);

    const token_uri = chain.callReadOnlyFn(CONTRACT_NAME, GET_TOKEN_URI, [types.uint(1)], deployer.address);
    const token_uri_result = token_uri.result;
    token_uri_result.expectOk();
    assertEquals(token_uri_result, `(ok (some "${url}"))`);
  },
});

Clarinet.test({
  name: 'backgrounds_get-token-uri_inexistendId_no-link',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const url = 'custom-url-link';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_URL, [types.principal(receiver.address), types.ascii(url)], deployer.address),
    ]);

    const token_uri = chain.callReadOnlyFn(CONTRACT_NAME, GET_TOKEN_URI, [types.uint(2)], deployer.address);
    const token_uri_result = token_uri.result;
    token_uri_result.expectOk();
    assertEquals(token_uri_result, `(ok none)`);
  },
});

//mint-name
Clarinet.test({
  name: 'backgrounds_mint-name_deployer_deployer_existentName_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(deployer.address), types.ascii(name)],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'backgrounds_mint-name_deployer_address_existentName_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(receiver.address), types.ascii(name)],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'backgrounds_mint-name_address_address_existentName_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const sender = accounts.get('wallet_1')!;
    const receiver = accounts.get('wallet_1')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, MINT_NAME, [types.principal(receiver.address), types.ascii(name)], sender.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(100);
  },
});

Clarinet.test({
  name: 'backgrounds_mint-name_deployer_address_inexistentName_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const name = 'random-name';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(receiver.address), types.ascii(name)],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(301);
  },
});

//burn-token
Clarinet.test({
  name: 'backgrounds_burn-token_owner_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(receiver.address), types.ascii(name)],
        deployer.address
      ),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], receiver.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'backgrounds_burn-token_deployer_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(receiver.address), types.ascii(name)],
        deployer.address
      ),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], deployer.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(403);
  },
});

Clarinet.test({
  name: 'backgrounds_burn-token_address_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;
    const name = 'DarkPurple';

    let block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        MINT_NAME,
        [types.principal(receiver.address), types.ascii(name)],
        deployer.address
      ),
      Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], notOwner.address),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(403);
  },
});

Clarinet.test({
  name: 'backgrounds_burn-token_address_tokenInexistent_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user = accounts.get('wallet_1')!;

    let block = chain.mineBlock([Tx.contractCall(CONTRACT_NAME, BURN_TOKEN, [types.uint(1)], user.address)]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(403);
  },
});

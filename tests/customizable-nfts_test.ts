import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const UPGRADE_CONTRACT = 'customizable-nfts';
const GET_DISASSEMBLE_WORK_QUEUE = 'get-disassemble-work-queue';
const GET_DISASSEMBLE_HEAD_WORK_QUEUE = 'get-disassemble-head-work-queue';
const POP_DISASSEMBLE_WORK_QUEUE = 'pop-disassemble-work-queue-public';
const IS_DISASSEMBLE_FIRST_ELEMENT = 'is-disassemble-first-element-public';
const IS_DISASSEMBLE_VALUE_FOR_PRINCIPAL = 'is-disassemble-value-for-principal-public';
const FEE_PROCESSING = 'fee-processing-public';
const ADD_DISASSEMBLE_WORK_IN_QUEUE = 'add-disassemble-work-in-queue';
const DISASSEMBLE_FINALIZE = 'disassemble-finalize';

const GET_ASSEMBLE_WORK_QUEUE = 'get-assemble-work-queue';
const GET_ASSEMBLE_HEAD_WORK_QUEUE = 'get-assemble-head-work-queue';
const POP_ASSEMBLE_WORK_QUEUE = 'pop-assemble-work-queue-public';
const IS_ASSEMBLE_FIRST_ELEMENT = 'is-assemble-first-element-public';
const IS_ASSEMBLE_VALUE_FOR_PRINCIPAL = 'is-assemble-value-for-principal-public';
const ADD_ASSEMBLE_WORK_IN_QUEUE = 'add-assemble-work-in-queue';
const ASSEMBLE_FINALIZE = 'assemble-finalize';

const GET_SWAP_WORK_QUEUE = 'get-swap-work-queue';
const GET_SWAP_HEAD_WORK_QUEUE = 'get-swap-head-work-queue';
const POP_SWAP_WORK_QUEUE = 'pop-swap-work-queue-public';
const IS_SWAP_FIRST_ELEMENT = 'is-swap-first-element-public';
const IS_SWAP_VALUE_FOR_PRINCIPAL = 'is-swap-value-for-principal-public';
const ADD_SWAP_WORK_IN_QUEUE = 'add-swap-work-in-queue';
const SWAP_FINALIZE = 'swap-finalize';

const GET_MERGE_WORK_QUEUE = 'get-merge-work-queue';
const GET_MERGE_HEAD_WORK_QUEUE = 'get-merge-head-work-queue';
const POP_MERGE_WORK_QUEUE = 'pop-merge-work-queue-public';
const IS_MERGE_FIRST_ELEMENT = 'is-merge-first-element-public';
const IS_MERGE_VALUE_FOR_PRINCIPAL = 'is-merge-value-for-principal-public';
const ADD_MERGE_WORK_IN_QUEUE = 'add-merge-work-in-queue';
const MERGE_FINALIZE = 'merge-finalize';
const BURN_OLD_NFT = 'burn-old-nft-public';

const DEGEN_CONTRACT = 'stacks-degens';
const DEGEN_MINT_URI = 'mint-uri';
const BACKGROUND_CONTRACT = 'backgrounds';
const CAR_CONTRACT = 'cars';
const RIM_CONTRACT = 'rims';
const HEAD_CONTRACT = 'heads';
const COMPONENT_GET_OWNER = 'get-owner';
const COMPONENT_MINT_NAME = 'mint-name';
const MIAMI_DEGEN_CONTRACT = 'miami-degens';
const NYC_DEGEN_CONTRACT = 'nyc-degens';
const OLD_DEGEN_CLAIM = 'claim';

const DEGEN_URL = 'urlNiceDegen';
const BACKGROUND_NAME = 'DarkPurple';
const CAR_NAME = 'BentleyBlack';
const RIM_NAME = 'ClassyCream';
const HEAD_NAME = 'Miami_Syringe_Cigar';

const BACKGROUND_TYPE = 'background-type';
const CAR_TYPE = 'car-type';
const RIM_TYPE = 'rim-type';
const HEAD_TYPE = 'head-type';
const FEE_PROCESSING_VALUE = '690000';

const MIAMI_TYPE = 'miami';
const NYC_TYPE = 'nyc';

const BURN_ADDRESS = 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6';

//errors
const ERR_INVALID = 300;
const ERR_TOO_MANY_DISASSEMBLE = 200;
const ERR_NOT_OWNER = 100;
const ERR_COMPONENT_TYPE_INVALID = 501;

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

//DISASSEMBLE
//is-disassemble-value-for-principal
Clarinet.test({
  name: 'customizable-nfts_is-disassemble-value-for-principal_deployer_deployer_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_VALUE_FOR_PRINCIPAL,
        [types.tuple({ 'token-id': types.uint(1), member: types.principal(deployer.address) })],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsd `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-disassemble-value-for-principal_deployer_address_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_VALUE_FOR_PRINCIPAL,
        [types.tuple({ 'token-id': types.uint(1), member: types.principal(member.address) })],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsm `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-disassemble-value-for-principal_address_address_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_VALUE_FOR_PRINCIPAL,
        [types.tuple({ 'token-id': types.uint(1), member: types.principal(member.address) })],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//fee-processing
Clarinet.test({
  name: 'customizable-nfts_fee-processing_address_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, FEE_PROCESSING, [], member.address)]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block.receipts[0].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_fee-processing_deployer_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, FEE_PROCESSING, [], deployer.address)]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(2);
  },
});

//add-disassemble-work-in-queue
Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_address_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], receiver.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[1].events[1]['nft_burn_event']['value'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_deployer_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //no fees applied to deployer
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['nft_burn_event']['value'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_address_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], notOwner.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_deployer_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_address_tokenOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], receiver.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify first transaction was successful and correct
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[1].events[1]['nft_burn_event']['value'], token_id);

    //verify second transaction unsuccessful
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_deployer_tokenOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify first transaction was successful and correct
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['nft_burn_event']['value'], token_id);

    //verify second transaction unsuccessful
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_address_add5Tokens_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';
    const degen3 = 'urlNiceDegen3';
    const degen4 = 'urlNiceDegen4';
    const degen5 = 'urlNiceDegen5';
    const degen6 = 'urlNiceDegen6';

    let block_mint = chain.mineBlock([
      //mint degens for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen2)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen3)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen4)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen5)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen6)],
        deployer.address
      ),
    ]);

    let block_disassemble = chain.mineBlock([
      //add tokens in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(3)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(4)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(5)], receiver.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(6)], receiver.address),
    ]);

    const token_id1 = block_mint.receipts[0].events[0]['nft_mint_event']['value'];
    const token_id5 = block_mint.receipts[4].events[0]['nft_mint_event']['value'];
    const token_id6 = block_mint.receipts[5].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    assertEquals(block_disassemble.height, 3);
    assertEquals(block_disassemble.receipts.length, 6);

    block_disassemble.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block_disassemble.receipts[0].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_disassemble.receipts[0].events[1]['nft_burn_event']['value'], token_id1);

    block_disassemble.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block_disassemble.receipts[4].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_disassemble.receipts[4].events[1]['nft_burn_event']['value'], token_id5);

    block_disassemble.receipts[5].result.expectErr().expectUint(ERR_TOO_MANY_DISASSEMBLE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-disassemble-work-in-queue_deployer_add5Tokens_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';
    const degen3 = 'urlNiceDegen3';
    const degen4 = 'urlNiceDegen4';
    const degen5 = 'urlNiceDegen5';
    const degen6 = 'urlNiceDegen6';

    let block_mint = chain.mineBlock([
      //mint degens for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen2)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen3)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen4)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen5)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen6)],
        deployer.address
      ),
    ]);

    let block_disassemble = chain.mineBlock([
      //add tokens in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(3)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(4)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(5)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(6)], deployer.address),
    ]);

    const token_id1 = block_mint.receipts[0].events[0]['nft_mint_event']['value'];
    const token_id5 = block_mint.receipts[4].events[0]['nft_mint_event']['value'];
    const token_id6 = block_mint.receipts[5].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    assertEquals(block_disassemble.height, 3);
    assertEquals(block_disassemble.receipts.length, 6);

    block_disassemble.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block_disassemble.receipts[0].events[0]['nft_burn_event']['value'], token_id1);

    block_disassemble.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block_disassemble.receipts[4].events[0]['nft_burn_event']['value'], token_id5);

    block_disassemble.receipts[5].result.expectErr().expectUint(ERR_TOO_MANY_DISASSEMBLE);
  },
});

//get-disassemble-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-disassemble-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], member.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['token-id'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['token-id'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], member.address),
    ]);

    const token_id1 = block.receipts[0].events[0]['nft_mint_event']['value'];
    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], member.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], deployer.address),
    ]);

    const token_id1 = block.receipts[0].events[0]['nft_mint_event']['value'];
    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);
  },
});

//get-disassemble-head-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-disassemble-head-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], member.address);

    assertEquals(queue_head.result, `(ok none)`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-head-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], receiver.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], receiver.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['token-id'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-head-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    //verify token was correctly added to queue
    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['token-id'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-head-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], member.address),
    ]);

    const token_id1 = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], member.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['token-id'], token_id1);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-disassemble-head-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], deployer.address),
    ]);

    const token_id1 = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['token-id'], token_id1);
  },
});

//is-disassemble-first-element
Clarinet.test({
  name: 'customizable-nfts_is-disassemble-first-element_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_FIRST_ELEMENT,
        [types.tuple({ 'token-id': token_id, member: types.principal(member.address) })],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-disassemble-first-element_deployer_firstElement_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_FIRST_ELEMENT,
        [types.tuple({ 'token-id': token_id, member: types.principal(member.address) })],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-disassemble-first-element_deployer_notFirstElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], member.address),
    ]);

    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_DISASSEMBLE_FIRST_ELEMENT,
        [types.tuple({ 'token-id': token_id2, member: types.principal(member.address) })],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//pop-disassemble-work-queue
Clarinet.test({
  name: 'customizable-nfts_pop-disassemble-work-queue_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(UPGRADE_CONTRACT, POP_DISASSEMBLE_WORK_QUEUE, [], deployer.address),
    ]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue is indeed empty
    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-disassemble-work-queue_deployer_singleElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, POP_DISASSEMBLE_WORK_QUEUE, [], deployer.address),
    ]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue remains empty
    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-disassemble-work-queue_deployer_multipleElements_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], member.address),
    ]);

    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_DISASSEMBLE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    //verfiy head of queue is the second added element
    assertEquals(queue_head.result, `(ok (some {member: ${member.address}, token-id: ${token_id2}}))`);
  },
});

//disassemble-finalize
Clarinet.test({
  name: 'customizable-nfts_disassemble-finalize_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        DISASSEMBLE_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(BACKGROUND_NAME),
          types.ascii(CAR_NAME),
          types.ascii(RIM_NAME),
          types.ascii(HEAD_NAME),
        ],
        member.address
      ),
    ]);

    // console.log(`block `, block);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_disassemble-finalize_deployer_tokenNotHeadQueue_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        DISASSEMBLE_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(BACKGROUND_NAME),
          types.ascii(CAR_NAME),
          types.ascii(RIM_NAME),
          types.ascii(HEAD_NAME),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_disassemble-finalize_deployer_tokenHeadQueue_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';

    let block = chain.mineBlock([
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(degen2)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(1)], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, ADD_DISASSEMBLE_WORK_IN_QUEUE, [types.uint(2)], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        DISASSEMBLE_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(BACKGROUND_NAME),
          types.ascii(CAR_NAME),
          types.ascii(RIM_NAME),
          types.ascii(HEAD_NAME),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);
    // console.log(`events-disassemble `, block.receipts[2].events);

    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectOk().expectBool(true);

    const background_id = block.receipts[4].events[0]['nft_mint_event']['value'].split('u')[1];
    const car_id = block.receipts[4].events[1]['nft_mint_event']['value'].split('u')[1];
    const rim_id = block.receipts[4].events[2]['nft_mint_event']['value'].split('u')[1];
    const head_id = block.receipts[4].events[3]['nft_mint_event']['value'].split('u')[1];

    assertEquals(block.receipts[4].events[0]['nft_mint_event']['recipient'], member.address);
    assertEquals(block.receipts[4].events[1]['nft_mint_event']['recipient'], member.address);
    assertEquals(block.receipts[4].events[2]['nft_mint_event']['recipient'], member.address);
    assertEquals(block.receipts[4].events[3]['nft_mint_event']['recipient'], member.address);

    const background_owner = chain.callReadOnlyFn(
      BACKGROUND_CONTRACT,
      COMPONENT_GET_OWNER,
      [types.uint(background_id)],
      deployer.address
    );

    const body_owner = chain.callReadOnlyFn(CAR_CONTRACT, COMPONENT_GET_OWNER, [types.uint(car_id)], deployer.address);

    const rim_owner = chain.callReadOnlyFn(RIM_CONTRACT, COMPONENT_GET_OWNER, [types.uint(rim_id)], deployer.address);

    const head_owner = chain.callReadOnlyFn(
      HEAD_CONTRACT,
      COMPONENT_GET_OWNER,
      [types.uint(head_id)],
      deployer.address
    );

    assertEquals(background_owner.result, `(ok (some ${member.address}))`);
    assertEquals(body_owner.result, `(ok (some ${member.address}))`);
    assertEquals(rim_owner.result, `(ok (some ${member.address}))`);
    assertEquals(head_owner.result, `(ok (some ${member.address}))`);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_DISASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    //verfiy head of queue is the second added element
    assertEquals(queue_head.result, `(ok (some {member: ${member.address}, token-id: ${token_id2}}))`);
  },
});

//ASSEMBLE
//is-assemble-value-for-principal
Clarinet.test({
  name: 'customizable-nfts_is-assemble-value-for-principal_deployer_deployer_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'background-id': types.uint(1),
            'car-id': types.uint(1),
            'rim-id': types.uint(1),
            'head-id': types.uint(1),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsd `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-assemble-value-for-principal_deployer_address_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'background-id': types.uint(1),
            'car-id': types.uint(1),
            'rim-id': types.uint(1),
            'head-id': types.uint(1),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsm `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-assemble-value-for-principal_address_address_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'background-id': types.uint(1),
            'car-id': types.uint(1),
            'rim-id': types.uint(1),
            'head-id': types.uint(1),
            member: types.principal(member.address),
          }),
        ],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//add-assemble-work-in-queue
Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_address_allTokensOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block.receipts[4].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[4].events[1]['nft_burn_event']['value'], background_id);
    assertEquals(block.receipts[4].events[2]['nft_burn_event']['value'], car_id);
    assertEquals(block.receipts[4].events[3]['nft_burn_event']['value'], rim_id);
    assertEquals(block.receipts[4].events[4]['nft_burn_event']['value'], head_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_deployer_allTokensOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint tokens for address of deployer
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees not applied to deployer
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block.receipts[4].events[0]['nft_burn_event']['value'], background_id);
    assertEquals(block.receipts[4].events[1]['nft_burn_event']['value'], car_id);
    assertEquals(block.receipts[4].events[2]['nft_burn_event']['value'], rim_id);
    assertEquals(block.receipts[4].events[3]['nft_burn_event']['value'], head_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_address_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    //verify transaction was not successful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_deployer_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);

    //verify transaction was not uccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_address_allTokensOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    //verify first transaction was successful and correct
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 6);
    block.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block.receipts[4].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[4].events[1]['nft_burn_event']['value'], background_id);
    assertEquals(block.receipts[4].events[2]['nft_burn_event']['value'], car_id);
    assertEquals(block.receipts[4].events[3]['nft_burn_event']['value'], rim_id);
    assertEquals(block.receipts[4].events[4]['nft_burn_event']['value'], head_id);

    //verify second transaction unsuccessful
    block.receipts[5].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-assemble-work-in-queue_deployer_allTokensOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint tokens for address of deployer
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees not applied to deployer
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 6);
    block.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block.receipts[4].events[0]['nft_burn_event']['value'], background_id);
    assertEquals(block.receipts[4].events[1]['nft_burn_event']['value'], car_id);
    assertEquals(block.receipts[4].events[2]['nft_burn_event']['value'], rim_id);
    assertEquals(block.receipts[4].events[3]['nft_burn_event']['value'], head_id);

    //verify second transaction unsuccessful
    block.receipts[5].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

//get-assemble-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-assemble-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], receiver.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], receiver.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], deployer.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.uint(2), types.uint(2)],
        receiver.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], receiver.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    const token_tuple = tokens_list[1].expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], receiver.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.uint(2), types.uint(2)],
        deployer.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    const token_tuple = tokens_list[1].expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], deployer.address);
  },
});

//get-assemble-head-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-assemble-head-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], member.address);

    assertEquals(queue_head.result, `(ok none)`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-head-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], receiver.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], receiver.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-head-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], deployer.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-head-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        receiver.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.uint(2), types.uint(2)],
        receiver.address
      ),
    ]);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], receiver.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], receiver.address);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-assemble-head-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        deployer.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.uint(2), types.uint(2)],
        deployer.address
      ),
    ]);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();

    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], deployer.address);
  },
});

//is-assemble-first-element
Clarinet.test({
  name: 'customizable-nfts_is-assemble-first-element_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_FIRST_ELEMENT,
        [
          types.tuple({
            'background-id': types.uint(1),
            'car-id': types.uint(1),
            'rim-id': types.uint(1),
            'head-id': types.uint(1),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-assemble-first-element_deployer_firstElement_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_FIRST_ELEMENT,
        [
          types.tuple({
            'background-id': background_id,
            'car-id': car_id,
            'rim-id': rim_id,
            'head-id': head_id,
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-assemble-first-element_deployer_notFirstElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
    ]);

    block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_ASSEMBLE_FIRST_ELEMENT,
        [
          types.tuple({
            'background-id': background_id,
            'car-id': car_id,
            'rim-id': rim_id,
            'head-id': head_id,
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 4);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//pop-assemble-work-queue
Clarinet.test({
  name: 'customizable-nfts_pop-assemble-work-queue_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_ASSEMBLE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue is indeed empty
    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 0);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-assemble-work-queue_deployer_singleElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
    ]);

    let queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_ASSEMBLE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue remains empty
    tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 0);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-assemble-work-queue_deployer_multipleElements_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
    ]);

    block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.uint(2), types.uint(2)],
        member.address
      ),
    ]);

    const background_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];
    const rim_id = block.receipts[2].events[0]['nft_mint_event']['value'];
    const head_id = block.receipts[3].events[0]['nft_mint_event']['value'];

    let queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_ASSEMBLE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 4);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue remains empty
    tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['background-id'], background_id);
    assertEquals(token_tuple['car-id'], car_id);
    assertEquals(token_tuple['rim-id'], rim_id);
    assertEquals(token_tuple['head-id'], head_id);
    assertEquals(token_tuple['member'], member.address);
  },
});

//assemble-finalize
Clarinet.test({
  name: 'customizable-nfts_assemble-finalize_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ASSEMBLE_FINALIZE,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        member.address
      ),
    ]);

    // console.log(`block `, block);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_assemble-finalize_deployer_tokenHeadQueue_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      //add tokens in queue for assembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_ASSEMBLE_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.uint(1), types.uint(1)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ASSEMBLE_FINALIZE,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[4].events);
    // console.log(`events-assemble `, block.receipts[5].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 6);
    block.receipts[5].result.expectOk().expectBool(true);

    assertEquals(block.receipts[5].events[0]['nft_mint_event']['recipient'], member.address);

    const token_id = block.receipts[5].events[0]['nft_mint_event']['value'].split('u')[1];
    const degen_owner = chain.callReadOnlyFn(
      DEGEN_CONTRACT,
      COMPONENT_GET_OWNER,
      [types.uint(token_id)],
      deployer.address
    );
    assertEquals(degen_owner.result, `(ok (some ${member.address}))`);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_HEAD_WORK_QUEUE, [], deployer.address);

    //verfiy head of queue
    assertEquals(queue_head.result, `(ok none)`);
  },
});

//SWAP

//is-swap-value-for-principal
Clarinet.test({
  name: 'customizable-nfts_is-swap-value-for-principal_deployer_deployer_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'component-id': types.uint(1),
            'component-type': types.ascii(BACKGROUND_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsd `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-swap-value-for-principal_deployer_address_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'component-id': types.uint(1),
            'component-type': types.ascii(BACKGROUND_TYPE),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsm `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-swap-value-for-principal_address_address_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'component-id': types.uint(1),
            'component-type': types.ascii(BACKGROUND_TYPE),
            member: types.principal(member.address),
          }),
        ],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//add-swap-work-in-queue
Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_tokensOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[2].events);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk().expectBool(true);
    assertEquals(block.receipts[2].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[2].events[1]['nft_burn_event']['value'], degen_id);
    assertEquals(block.receipts[2].events[2]['nft_burn_event']['value'], car_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_deployer_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //no fees applied to deployer
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk().expectBool(true);
    assertEquals(block.receipts[2].events[0]['nft_burn_event']['value'], degen_id);
    assertEquals(block.receipts[2].events[1]['nft_burn_event']['value'], car_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_degenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(notOwner.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        notOwner.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_componentNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(notOwner.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        notOwner.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_componentTypeInvalid_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const invalid_component_type = 'random-type';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(invalid_component_type)],
        receiver.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_deployer_degenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_deployer_componentNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_deployer_componentTypeInvalid_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const invalid_component_type = 'random-type';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(invalid_component_type)],
        deployer.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_tokensOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 4);
    block.receipts[2].result.expectOk().expectBool(true);
    assertEquals(block.receipts[2].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[2].events[1]['nft_burn_event']['value'], degen_id);
    assertEquals(block.receipts[2].events[2]['nft_burn_event']['value'], car_id);

    //verify second transaction unsuccessful
    block.receipts[3].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_deployer_tokensOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 4);
    block.receipts[2].result.expectOk().expectBool(true);
    assertEquals(block.receipts[2].events[0]['nft_burn_event']['value'], degen_id);
    assertEquals(block.receipts[2].events[1]['nft_burn_event']['value'], car_id);

    //verify second transaction unsuccessful
    block.receipts[3].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-swap-work-in-queue_address_add5Tokens_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';
    const degen2 = 'urlNiceDegen2';
    const degen3 = 'urlNiceDegen3';
    const degen4 = 'urlNiceDegen4';
    const degen5 = 'urlNiceDegen5';
    const degen6 = 'urlNiceDegen6';

    let block_mint = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen1)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen2)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen3)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen4)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen5)],
        deployer.address
      ),
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(degen6)],
        deployer.address
      ),
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        RIM_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(RIM_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        HEAD_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(HEAD_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        BACKGROUND_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(BACKGROUND_NAME)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
    ]);

    let block_swap = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(BACKGROUND_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(3), types.uint(1), types.ascii(RIM_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(4), types.uint(1), types.ascii(HEAD_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(5), types.uint(2), types.ascii(BACKGROUND_TYPE)],
        receiver.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(6), types.uint(2), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    // console.log(`block `, block_swap);
    // console.log(`eventsadd `, block_swap.receipts);

    const degen_id1 = block_mint.receipts[0].events[0]['nft_mint_event']['value'];
    const degen_id5 = block_mint.receipts[4].events[0]['nft_mint_event']['value'];
    const degen_id6 = block_mint.receipts[5].events[0]['nft_mint_event']['value'];
    const component_id1 = block_mint.receipts[6].events[0]['nft_mint_event']['value'];
    const component_id2 = block_mint.receipts[10].events[0]['nft_mint_event']['value'];
    const component_id3 = block_mint.receipts[11].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    assertEquals(block_swap.height, 3);
    assertEquals(block_swap.receipts.length, 6);

    block_swap.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block_swap.receipts[0].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_swap.receipts[0].events[1]['nft_burn_event']['value'], degen_id1);
    assertEquals(block_swap.receipts[0].events[2]['nft_burn_event']['value'], component_id1);

    block_swap.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block_swap.receipts[4].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_swap.receipts[4].events[1]['nft_burn_event']['value'], degen_id5);
    assertEquals(block_swap.receipts[4].events[2]['nft_burn_event']['value'], component_id2);

    //verify unsuccessful transaction
    block_swap.receipts[5].result.expectErr().expectUint(ERR_TOO_MANY_DISASSEMBLE);
  },
});

//get-swap-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-swap-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[2].events);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], receiver.address);

    // console.log('queue ', queue);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();

    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();

    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[2].events);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], receiver.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    const token_tuple = tokens_list[1].expectTuple();

    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    const token_tuple = tokens_list[1].expectTuple();

    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

//get-swap-head-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-swap-head-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok none)`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-head-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], receiver.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();

    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-head-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();

    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-head-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], receiver.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();

    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-swap-head-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(deployer.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(deployer.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        deployer.address
      ),
    ]);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();

    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

//pop-swap-work-queue
Clarinet.test({
  name: 'customizable-nfts_pop-swap-work-queue_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_SWAP_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_ASSEMBLE_WORK_QUEUE, [], deployer.address);

    //verify queue is indeed empty
    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 0);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-swap-work-queue_deployer_singleElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    let queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_SWAP_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    //verify queue remains empty
    tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 0);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-swap-work-queue_deployer_multipleElements_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(receiver.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(receiver.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        receiver.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    let queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    let tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_SWAP_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 4);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_WORK_QUEUE, [], deployer.address);

    //verify queue remains only with second element
    tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['member'], receiver.address);
    assertEquals(token_tuple['degen-id'], degen_id);
    assertEquals(token_tuple['component-id'], car_id);
    token_tuple['component-type'].expectAscii(CAR_TYPE);
  },
});

//is-swap-first-element
Clarinet.test({
  name: 'customizable-nfts_is-swap-first-element_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'component-id': types.uint(1),
            'component-type': types.ascii(BACKGROUND_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-swap-first-element_deployer_firstElement_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        member.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': degen_id,
            'component-id': car_id,
            'component-type': types.ascii(CAR_TYPE),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-swap-first-element_deployer_notFirstElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        member.address
      ),
    ]);

    block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(2), types.uint(2), types.ascii(CAR_TYPE)],
        member.address
      ),
    ]);

    const degen_id = block.receipts[0].events[0]['nft_mint_event']['value'];
    const car_id = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_SWAP_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': degen_id,
            'component-id': car_id,
            'component-type': types.ascii(CAR_TYPE),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 4);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//swap-finalize
Clarinet.test({
  name: 'customizable-nfts_swap-finalize_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        SWAP_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(DEGEN_URL),
          types.ascii(CAR_NAME),
          types.ascii(CAR_TYPE),
        ],
        member.address
      ),
    ]);

    // console.log(`block `, block);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_swap-finalize_deployer_notHeadQueue_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        SWAP_FINALIZE,
        [
          types.uint(2),
          types.principal(member.address),
          types.ascii(DEGEN_URL),
          types.ascii(CAR_NAME),
          types.ascii(CAR_TYPE),
        ],
        deployer.address
      ),
    ]);

    // console.log('block ', block);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 4);
    block.receipts[3].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_swap-finalize_deployer_componentTypeInvalid_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const invalid_component_type = 'random-type';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        SWAP_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(DEGEN_URL),
          types.ascii(CAR_NAME),
          types.ascii(invalid_component_type),
        ],
        deployer.address
      ),
    ]);

    // console.log('block ', block);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 4);
    block.receipts[3].result.expectErr().expectUint(ERR_COMPONENT_TYPE_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_swap-finalize_deployer_headQueue_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(
        DEGEN_CONTRACT,
        DEGEN_MINT_URI,
        [types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
      Tx.contractCall(
        CAR_CONTRACT,
        COMPONENT_MINT_NAME,
        [types.principal(member.address), types.ascii(CAR_NAME)],
        deployer.address
      ),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_SWAP_WORK_IN_QUEUE,
        [types.uint(1), types.uint(1), types.ascii(CAR_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        SWAP_FINALIZE,
        [
          types.uint(1),
          types.principal(member.address),
          types.ascii(DEGEN_URL),
          types.ascii(CAR_NAME),
          types.ascii(CAR_TYPE),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[2].events);
    // console.log(`events-swap `, block.receipts[3].events);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 4);
    block.receipts[3].result.expectOk().expectBool(true);

    assertEquals(block.receipts[3].events[0]['nft_mint_event']['recipient'], member.address);
    assertEquals(block.receipts[3].events[1]['nft_mint_event']['recipient'], member.address);

    const degen_id = block.receipts[3].events[0]['nft_mint_event']['value'].split('u')[1];
    const degen_owner = chain.callReadOnlyFn(
      DEGEN_CONTRACT,
      COMPONENT_GET_OWNER,
      [types.uint(degen_id)],
      deployer.address
    );
    assertEquals(degen_owner.result, `(ok (some ${member.address}))`);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_SWAP_HEAD_WORK_QUEUE, [], deployer.address);

    //verfiy head of queue
    assertEquals(queue_head.result, `(ok none)`);
  },
});

//MERGE
//is-merge-value-for-principal
Clarinet.test({
  name: 'customizable-nfts_is-merge-value-for-principal_deployer_deployer_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsd `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-merge-value-for-principal_deployer_address_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(member.address),
          }),
        ],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsm `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-merge-value-for-principal_address_address_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_VALUE_FOR_PRINCIPAL,
        [
          types.tuple({
            'degen-id': types.uint(1),
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(member.address),
          }),
        ],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//burn-old-nft
Clarinet.test({
  name: 'customizable-nfts_burn-old-nft_address_validTokenType_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, BURN_OLD_NFT, [types.uint(1), types.ascii(MIAMI_TYPE)], member.address),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);
    // console.log(`eventsb `, block.receipts[1].events);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    //verify transaction was successful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    assertEquals(block.receipts[1].result.expectOk().expectSome(), token_id);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['value'], token_id);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['recipient'], BURN_ADDRESS);
  },
});

Clarinet.test({
  name: 'customizable-nfts_burn-old-nft_deployer_validTokenType_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(NYC_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(UPGRADE_CONTRACT, BURN_OLD_NFT, [types.uint(1), types.ascii(NYC_TYPE)], deployer.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify transaction was successful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    assertEquals(block.receipts[1].result.expectOk().expectSome(), token_id);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['value'], token_id);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['recipient'], BURN_ADDRESS);
  },
});

Clarinet.test({
  name: 'customizable-nfts_burn-old-nft_address_invalidTokenType_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const invalid_token_type = 'random-type';

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(UPGRADE_CONTRACT, BURN_OLD_NFT, [types.uint(1), types.ascii(invalid_token_type)], member.address),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(ERR_COMPONENT_TYPE_INVALID);
  },
});

//add-merge-work-in-queue
Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_address_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint tokens for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);
    // console.log(`eventsb `, block.receipts[1].events);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //fees applied to user
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[1].events[1]['nft_transfer_event']['value'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_deployer_tokenOwned_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsa `, block.receipts[0].events);
    // console.log(`eventsb `, block.receipts[1].events);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    //no fees applied to deployer
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['value'], token_id);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_address_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;
    const notOwner = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], receiver.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        notOwner.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_deployer_tokenNotOwned_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const receiver = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], receiver.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    //verify transaction was unsuccessful
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_address_tokenOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    //verify first transaction was successful and correct
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block.receipts[1].events[1]['nft_transfer_event']['value'], token_id);

    //verify second transaction unsuccessful
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_deployer_tokenOwned_addedTwice_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[1].events);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    //verify first transaction was successful and correct
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[1].result.expectOk().expectBool(true);
    assertEquals(block.receipts[1].events[0]['nft_transfer_event']['value'], token_id);

    //verify second transaction unsuccessful
    block.receipts[2].result.expectErr().expectUint(ERR_NOT_OWNER);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_address_add5Tokens_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block_mint = chain.mineBlock([
      //mint degens for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
    ]);

    let block_merge = chain.mineBlock([
      //add tokens in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(3), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(4), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(5), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(6), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    const token_id1 = block_mint.receipts[0].events[3]['nft_mint_event']['value'];
    const token_id5 = block_mint.receipts[4].events[3]['nft_mint_event']['value'];
    const token_id6 = block_mint.receipts[5].events[3]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    assertEquals(block_merge.height, 3);
    assertEquals(block_merge.receipts.length, 6);

    block_merge.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block_merge.receipts[0].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_merge.receipts[0].events[1]['nft_transfer_event']['value'], token_id1);

    block_merge.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block_merge.receipts[4].events[0]['stx_transfer_event']['amount'], FEE_PROCESSING_VALUE);
    assertEquals(block_merge.receipts[4].events[1]['nft_transfer_event']['value'], token_id5);

    block_merge.receipts[5].result.expectErr().expectUint(ERR_TOO_MANY_DISASSEMBLE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_add-merge-work-in-queue_deployer_add5Tokens_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block_mint = chain.mineBlock([
      //mint degens for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
    ]);

    let block_merge = chain.mineBlock([
      //add tokens in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(3), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(4), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(5), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(6), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id1 = block_mint.receipts[0].events[0]['nft_mint_event']['value'];
    const token_id5 = block_mint.receipts[4].events[0]['nft_mint_event']['value'];
    const token_id6 = block_mint.receipts[5].events[0]['nft_mint_event']['value'];

    //verify transaction was successful and correct
    assertEquals(block_merge.height, 3);
    assertEquals(block_merge.receipts.length, 6);

    block_merge.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block_merge.receipts[0].events[0]['nft_transfer_event']['value'], token_id1);

    block_merge.receipts[4].result.expectOk().expectBool(true);
    assertEquals(block_merge.receipts[4].events[0]['nft_transfer_event']['value'], token_id5);

    block_merge.receipts[5].result.expectErr().expectUint(ERR_TOO_MANY_DISASSEMBLE);
  },
});

//get-merge-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-merge-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], member.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 1);

    const token_tuple = tokens_list[0].expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], member.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], deployer.address);

    const tokens_list = queue.result.expectOk().expectList();
    assertEquals(tokens_list.length, 2);
  },
});

//get-merge-head-work-queue
Clarinet.test({
  name: 'customizable-nfts_get-merge-head-work-queue_address_emptyQueue',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], member.address);

    assertEquals(queue.result, `(ok none)`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-head-work-queue_address_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], member.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-head-work-queue_deployer_singleElement',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-head-work-queue_address_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        member.address
      ),
    ]);

    const token_id = block.receipts[0].events[3]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], member.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

Clarinet.test({
  name: 'customizable-nfts_get-merge-head-work-queue_deployer_multipleElements',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      //add token in queue for disassembling
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], deployer.address);

    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], token_id);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

//pop-merge-work-queue
Clarinet.test({
  name: 'customizable-nfts_pop-merge-work-queue_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_MERGE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], deployer.address);

    //verify queue is indeed empty
    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-merge-work-queue_deployer_singleElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(UPGRADE_CONTRACT, POP_MERGE_WORK_QUEUE, [], deployer.address),
    ]);

    //verify successful transaction
    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk().expectBool(true);

    const queue = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_WORK_QUEUE, [], deployer.address);

    //verify queue remains empty
    assertEquals(queue.result, `(ok [])`);
  },
});

Clarinet.test({
  name: 'customizable-nfts_pop-merge-work-queue_deployer_multipleElements_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([Tx.contractCall(UPGRADE_CONTRACT, POP_MERGE_WORK_QUEUE, [], deployer.address)]);

    //verify successful transaction
    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], deployer.address);

    //verfiy head of queue is the second added element
    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], deployer.address);
    assertEquals(token_tuple['degen-id'], token_id2);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

//is-merge-first-element
Clarinet.test({
  name: 'customizable-nfts_is-merge-first-element_deployer_emptyQueue_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': token_id,
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-merge-first-element_deployer_firstElement_false',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;
    const degen1 = 'urlNiceDegen1';

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id = block.receipts[0].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': token_id,
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(false);
  },
});

Clarinet.test({
  name: 'customizable-nfts_is-merge-first-element_deployer_notFirstElement_true',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      //mint degen for address of receiver
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], deployer.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        deployer.address
      ),
    ]);

    const token_id2 = block.receipts[1].events[0]['nft_mint_event']['value'];

    block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        IS_MERGE_FIRST_ELEMENT,
        [
          types.tuple({
            'degen-id': token_id2,
            'degen-type': types.ascii(MIAMI_TYPE),
            member: types.principal(deployer.address),
          }),
        ],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 3);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

//merge-finalize
Clarinet.test({
  name: 'customizable-nfts_merge-finalize_address_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        MERGE_FINALIZE,
        [types.uint(1), types.principal(member.address), types.ascii(DEGEN_URL)],
        member.address
      ),
    ]);

    // console.log(`block `, block);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_merge-finalize_deployer_tokenNotHeadQueue_error',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        UPGRADE_CONTRACT,
        MERGE_FINALIZE,
        [types.uint(1), types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(ERR_INVALID);
  },
});

Clarinet.test({
  name: 'customizable-nfts_merge-finalize_deployer_tokenHeadQueue_ok',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const member = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(MIAMI_DEGEN_CONTRACT, OLD_DEGEN_CLAIM, [], member.address),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(1), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        ADD_MERGE_WORK_IN_QUEUE,
        [types.uint(2), types.ascii(MIAMI_TYPE)],
        member.address
      ),
      Tx.contractCall(
        UPGRADE_CONTRACT,
        MERGE_FINALIZE,
        [types.uint(1), types.principal(member.address), types.ascii(DEGEN_URL)],
        deployer.address
      ),
    ]);

    // console.log(`block `, block);
    // console.log(`eventsmint `, block.receipts[0].events);
    // console.log(`eventsadd `, block.receipts[2].events);
    // console.log(`events-merge `, block.receipts[4].events);

    const token_id2 = block.receipts[1].events[3]['nft_mint_event']['value'];

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectOk().expectBool(true);

    assertEquals(block.receipts[4].events[0]['nft_mint_event']['recipient'], member.address);

    const queue_head = chain.callReadOnlyFn(UPGRADE_CONTRACT, GET_MERGE_HEAD_WORK_QUEUE, [], deployer.address);

    //verify head of queue is the second added element
    const token_tuple = queue_head.result.expectOk().expectSome().expectTuple();
    assertEquals(token_tuple['member'], member.address);
    assertEquals(token_tuple['degen-id'], token_id2);
    token_tuple['degen-type'].expectAscii(MIAMI_TYPE);
  },
});

import Contracts from '../components/Contracts';
import { EIP712Verifier } from '../typechain-types';
import { ATTEST_TYPED_SIGNATURE, Delegation, REVOKE_TYPED_SIGNATURE } from '@ethereum-attestation-service/sdk';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const {
  utils: { keccak256, toUtf8Bytes }
} = ethers;

const HARDHAT_CHAIN_ID = 31337;

let verifier: EIP712Verifier;

describe('EIP712Verifier', () => {
  beforeEach(async () => {
    verifier = await Contracts.EIP712Verifier.deploy();
  });

  it('should report a version', async () => {
    expect(await verifier.VERSION()).to.equal('0.9');
  });

  it('should return the correct domain separator', async () => {
    const delegation = new Delegation({
      address: verifier.address,
      version: await verifier.VERSION(),
      chainId: HARDHAT_CHAIN_ID
    });

    expect(await verifier.DOMAIN_SEPARATOR()).to.equal(delegation.getDomainSeparator());
  });

  it('should return the attest type hash', async () => {
    expect(await verifier.ATTEST_TYPEHASH()).to.equal(keccak256(toUtf8Bytes(ATTEST_TYPED_SIGNATURE)));
  });

  it('should return the revoke type hash', async () => {
    expect(await verifier.REVOKE_TYPEHASH()).to.equal(keccak256(toUtf8Bytes(REVOKE_TYPED_SIGNATURE)));
  });
});

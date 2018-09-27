pragma solidity ^0.4.24;

import './UAOSRing.sol';

contract AnonymousIdentityRegistry {
  /// mapping of all list ids
  mapping(string => bool) listIds;

  /// mapping of list ids to public keys
  mapping(string => uint256[20]) listIdToPubKeys;

  /// mapping of list ids to ring signature tags
  mapping(string => mapping(bytes => bool)) listIdToTags;

  /// mapping of list ids to commit hashes
  mapping(string => mapping(bytes32 => bool)) listIdToCommitHashes;

  /// mapping of list ids to anonymous identities
  mapping(string => address[]) listIdToAnonymousIds;

  /// mapping of all anonymous identities
  mapping(address => bool) anonmyousIdentitiesMap;

  /// owner of this registry
  address owner;

  event ListCreated(string listId);
  event ListItemAdded(string listId, address anonymousId);
  event ListFilled(string listId);

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, 'Unauthorized operation');
    _;
  }

  /**
   * @dev creates a new list of anonymous identities. 
   *  Only avaialble to contract owner.
   * @param _listId unique id for the list
   * @param _pkeys authorized public keys for contributing to the list
   */
  function createList(string _listId, uint256[20] _pkeys) public onlyOwner {
    require(listIds[_listId] == false, 'List already exists');
    listIds[_listId] = true;
    listIdToPubKeys[_listId] = _pkeys;
    emit ListCreated(_listId);
  }

  /**
   * @dev commits a future entry using a hash. Required before an user can add their anonymous address to a list.
   * This is to prevent others from taking others signatures from the transaction pool and use it to submit an entry.
   * @param _listId list id to add to.
   * @param _commitHash solidty sha3 hash of the linkable ring signature tag and anonymousId being added.
   */
  function commitToList(string _listId, bytes32 _commitHash) public {
    // TODO authenticate with regular ring signatures?
    require(listIds[_listId] == true, 'List does not exist');
    listIdToCommitHashes[_listId][_commitHash] = true;
  }

  /**
   * @dev adds a new anonymous identity to a list. 
   *  An unique and valid linkable ring signature must be provided.
   * @param _listId list id to add to.
   * @param _anonymousId entry to add to list.
   * @param _tag tag for testing linkability. Must be unique for the same listId to prevent double entry.
   * @param _tees part of the ring signature, needs further documentation.
   * @param _seed part of the ring signature, needs further documentation.
   */
  function addToList(
      string _listId, 
      address _anonymousId,
      uint256[2] _tag,
      uint256[10] _tees,
      uint256 _seed
    ) public returns (bool success) {
    require(listIds[_listId] == true, 'List does not exist');

    // verify ring signature
    require(UAOSRing.verify(
      listIdToPubKeys[_listId],
      _tag,
      _tees,
      _seed,
      uint256(sha256(_listId))
    ), 'Invalid signature');

    // check for duplicate identities across all lists
    require(anonmyousIdentitiesMap[_anonymousId] == false, 'Identity has already been added');

    // verify commit hash, to prevent signature being used by others
    bytes32 commitHash = keccak256(abi.encodePacked(_tees, _anonymousId));
    require(listIdToCommitHashes[_listId][commitHash] == true, "No matching commit hash");

    // verify tag uniqueness, to prevent an user from adding items more than once
    bytes memory tagBytes = abi.encodePacked(_tag);
    require(listIdToTags[_listId][tagBytes] == false, "Duplicate signature");
    listIdToTags[_listId][tagBytes] = true;

    // add entry to list
    address[] storage anonymousIds = listIdToAnonymousIds[_listId];
    anonymousIds.push(_anonymousId);
    anonmyousIdentitiesMap[_anonymousId] = true;

    emit ListItemAdded(_listId, _anonymousId);

    if (anonymousIds.length == 10) {
      emit ListFilled(_listId);
    }
    
    return true;
  }

  /**
   * @dev returns all entries of a given list.
   * @param _listId list id to query.
   */
  function getList(string _listId) public view returns (address[]) {
    return listIdToAnonymousIds[_listId];
  }
}

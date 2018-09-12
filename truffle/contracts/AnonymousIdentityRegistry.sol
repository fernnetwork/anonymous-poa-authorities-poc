pragma solidity ^0.4.24;

import './UAOSRing.sol';

contract AnonymousIdentityRegistry {
  /// mapping of list ids to public keys
  mapping(string => uint256[20]) listIdToPubKeys;

  /// mapping of list ids to anonymous identities
  mapping(string => address[]) listIdToAnonymousIds;

  /// mapping of list ids to ring signature tags
  mapping(string => mapping(bytes => bool)) listIdToTags;
  
  /// owner of this registry
  address owner;

  event ListCreated(string listId);
  event ListItemAdded(string listId, address anonymousId);

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

  /**
   * @dev creates a new list of anonymous identities. 
   *  Only avaialble to contract owner.
   * @param _listId unique id for the list
   * @param _pkeys authorized public keys for contributing to the list
   */
  function createList(string _listId, uint256[20] _pkeys) public onlyOwner {
    require(listIdToPubKeys[_listId][0] == 0, "List already exists");
    listIdToPubKeys[_listId] = _pkeys;
    emit ListCreated(_listId);
  }

  /**
   * @dev adds a new anonymous identity to a list. 
   *  An unique and valid linkable ring signature must be provided.
   * @param _listId list id to add to.
   * @param _anonymousId entry to add to list.
   * @param _pubkeys authorised list of 10 public keys (every pair represents a public key).
   * @param _tag tag for testing linkability. Must be unique for the same listId to prevent double entry.
   * @param _tees part of the ring signature, needs further documentation.
   * @param _seed part of the ring signature, needs further documentation.
   */
  function addToList(
      string _listId, 
      address _anonymousId,
      // ring signature parameters
      uint256[20] _pubkeys,
      uint256[2] _tag,
      uint256[10] _tees,
      uint256 _seed
    ) 
    public returns (bool success) {
    // verify ring signature
    require(UAOSRing.verify(
      _pubkeys,
      _tag,
      _tees,
      _seed,
      uint256(sha256(_listId))
    ), 'Invalid signature');

    // verify tag uniqueness
    bytes memory tagBytes = abi.encodePacked(_tag);
    require(listIdToTags[_listId][tagBytes] == false, "Duplicate signature");
    listIdToTags[_listId][tagBytes] = true;

    // add entry to list
    address[] storage anonymousIds = listIdToAnonymousIds[_listId];
    anonymousIds.push(_anonymousId);
    emit ListItemAdded(_listId, _anonymousId);
    
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

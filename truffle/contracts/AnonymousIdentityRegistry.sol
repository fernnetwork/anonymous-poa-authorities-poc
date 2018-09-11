pragma solidity ^0.4.24;

import './UAOSRing.sol';

contract AnonymousIdentityRegistry {

  mapping(string => uint256[20]) listIdToPubKeys;
  mapping(string => address[]) listIdToAnonymousIds;
  mapping(string => mapping(bytes => bool)) listIdToTags;
  
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

  function createList(string _listId, uint256[20] _pkeys) public onlyOwner {
    listIdToPubKeys[_listId] = _pkeys;
    emit ListCreated(_listId);
  }

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

    address[] storage anonymousIds = listIdToAnonymousIds[_listId];
    anonymousIds.push(_anonymousId);
    emit ListItemAdded(_listId, _anonymousId);
    
    return true;
  }

  function getList(string _listId) public view returns (address[]) {
    return listIdToAnonymousIds[_listId];
  }
}

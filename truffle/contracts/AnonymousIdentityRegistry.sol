pragma solidity ^0.4.24;

import './UAOSRing.sol';

contract AnonymousIdentityRegistry {
  /// key = listId
  mapping(string => uint256[20]) pkeys;
  mapping(string => address[]) anonymousIds;
  
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
    pkeys[_listId] = _pkeys;
    emit ListCreated(_listId);
  }

  function addToList(
      string _listId, 
      address _anonymousId,
      // ring signature parameters
      uint256[20] pubkeys,
      uint256[2] tag,
      uint256[10] tees,
      uint256 seed
    ) public returns (bool success) {
    // verify ring signature
    bool result = UAOSRing.verify(
      pubkeys,
      tag,
      tees,
      seed,
      uint256(sha256(_listId))
    );
    require(result, 'Invalid signature');

    address[] storage anonymousIdsOfList = anonymousIds[_listId];
    anonymousIdsOfList.push(_anonymousId);
    emit ListItemAdded(_listId, _anonymousId);
    
    return true;
  }

  function getList(string _listId) public view returns (address[]) {
    return anonymousIds[_listId];
  }
}

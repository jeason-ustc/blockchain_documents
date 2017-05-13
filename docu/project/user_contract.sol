pragma solidity ^0.4.4;

contract Bicycle_info {

    address owner_addr;
    uint rent_flag;
    uint rent_value;
    uint origin_distance;
    uint update_distance;
    uint out_of_bound;
    uint reward_value;
	
   function Bicycle_info() { 
   owner_addr = msg.sender;
   rent_value = 100;
   rent_flag = 0;
   origin_distance = 0;
   update_distance = 0;
   out_of_bound = 0;
   reward_value = 80;
  }
}
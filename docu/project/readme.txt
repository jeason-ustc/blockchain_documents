1.系统合约名词和接口解释
  
  organizer：系统管理者，谁发布这个合约谁就是系统管理者
  user_amount：系统用户数
  deposit_quota：押金数
  user_list：用户列表
  user_contract_list：用户合约列表
  far_contract_list：远离用户合约初始地址比较远的合约
  
  struct Bicycle_info{
        address owner_addr; //所有者
        uint rent;          // 是否被租赁
        uint rent_value;    // 租金
        uint origin_distance; //用户合约的初始距离
        uint update_distance; //还车时更新车辆距离
        uint out_of_bound;    //是否相对于初始位置出界
        uint reward_value;    //搬回奖励
    }
   mapping (address => uint) public registrantsPaid;    //保存用户的押金
   mapping (address => Bicycle_info) public depository; //一个用户合约对应一辆车
   mapping (address => address) public rent_info_map;   //租车者 和 车的所有者 一一对应
   
   函数接口：
   
   改变押金数：          changeQuota(uint newquota) 输入为一个整数
   注册函数：            register(address contract_address,uint user_deposit_amount) 输入为一个用户合约地址和整数
   退款函数：            refund(address contract_addr) 输入为一个用户合约地址
   租赁函数：            rent(address contract_address,uint rent_value) 输入为一个用户合约地址和一个整数
   退出系统(取回车)函数：withdraw(address contract_addr) 输入为一个用户合约地址
   搬车奖励函数：        reward(address contract_addr) 输入为一个用户合约地址
   销毁系统合约函数：    destroy() 输入为空
   
   
   
   
   
   
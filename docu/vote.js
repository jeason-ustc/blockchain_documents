投票协议：合约创建人给大家授予投票权
授予投票权的人存一笔钱到智能合约这笔钱包括给候选人的一个以太币还包括他参与这个投票的押金。
如果有授予投票权的人没存则过一定时间后已经存钱的人可以把自己的钱全部取回并结束投票。
所有人存钱后，每个人提供一个k即投票则可以把自己的钱取回，提供k以后就可以确定获胜者是谁。如果一段时间后有人没取回押金则押金由L个候选人平分，同时获胜者可以取得奖金。

pragma solidity ^0.4.2;
contract  Ballot{
    struct Voter {
		bool voted;  // 是否已经投过票
		uint K;   // openKey
	}
	
	struct Proposal {
		bytes name; 
		uint voteCount;
	}
	
	address public chairperson;  // 投票发起人
	address public proposalA;  // two proposals
	address public proposalB;
	address public winningProposal;//

	
	mapping (address => uint) public balances;
	
    mapping(address => Voter) public voters; // 投票群众 
    
    mapping(address => Proposal) public proposals;
    

    uint constant  amount=11;
    uint constant  deposit=10;
    uint8 constant  everyPrize=1;
    uint public firstVoteTime=0;
    uint public voteTime;
    uint public limitTime=10;
    uint public time;
    uint public backNum;
    uint public openKeyNum;//the number of openKey
    uint public votersNum;//the number of voter

	                                          
	// 构造方法
	//传入两个候选人的地址，病初始化各自的票数为0
	function Ballot(address _proposalA,address _proposalB) {
		chairperson = msg.sender;
		 proposalA=_proposalA;
		 proposalB=_proposalB;
		 proposals[proposalA].voteCount=0;
	     proposals[proposalB].voteCount=0;
	   
	}
   
   
   /
	function giveRightToVote(address voter, bytes32 voterName) {
		// 如果不是投票发起人分配，或者分配的地址已经投过，抛异常
		if(msg.sender != chairperson || voters[voter].voted) {
			throw;
		}
		voters[voter].voted = false;//初始化投票状态为false
		
	}
    
    event send(address voter,uint amount);

	 // 投票者发送一笔押金11以太到合约
	function  Funds(uint256 deposit) {
	    Voter sender = voters[msg.sender];
	    //超过11则返回余额给客户。不够则直接全额返回并退出整个函数
	   if(（amount - 11） > 0)
	   send(msg.sender,amount-11);
	   else {
	       send(msg.sender,amount);
	       throw;
	   }
	           sender.voted = true;//改变投票状态为true
	          //在第一个叫押金的人这里开始计时
	           if(votersNum == 0){
	                firstVoteTime=block.number;            
	           }
	           votersNum += 1;//对叫押金的人计数
	}
	
	//如果过了一定的时间有人没交押金.则之前交过押金的人可以把押金全额要回并退出投票
	function  stopVoting( ){
	     Voter sender = voters[msg.sender];
	     time=block.number;
	     if(sender.voted != true) throw;//判断投票者的状态如果为false则退出
	     //如果超时且有人没交押金则之前交过押金的人可以把押金全额要回并退出投票
	     else if(votersNum !=3 && time > (firstVoteTime+limitTime)){
	        //return money for person who have vote
	            balances[msg.sender]+=amount; 
	            sender.voted=false;
	            throw;
	 }
	}
	  	

	//真正的投票,投票后可把押金部分要回
    function Claim(uint openKey ){
        if(votersNum !=3) throw;//必去所有人都交了押金才投票
        if(openKey!=0||openKey!=1) throw;//要么选A要么选B
        if(openKey==1) proposals[1].voteCount += 1;//选B
	    else  proposals[0].voteCount += 1;//选A
	         openKeyNum++;//统计投票人数
	         balances[msg.sender] += deposit;//返还押金
	         backNum++;//返还人数
	         if（！voteTime）{
	         voteTime = now;//第一个人要回的时候开始计时
	         }
	   }
	   
//如果所有人都要回押金则退出，否则没要回的由候选人平分
    function proposalClaim(){
        if(backNum == 3) throw;
	   if(msg.sender!=proposalA || msg.sender!= proposalB) throw;//判断A/B身份
	   uint checkTime=block.number;
	   
	      if(（checkTime-voteTime)>3 ){
	      if(proposals[0].voteCount>=proposals[1].voteCount)//判断获胜者
	        winningProposal=proposalA;
	        else winningProposal=proposalB;
	      
	         if(backNum<3){
	           uint depositPrizeNum=backNum-3;//计算平分的金额
	       uint prize=deposit*depositPrizeNum；
	       balances[msg.sender]+=prize/2;
	    }
	  }
 }

     function prize(){
         if(msg.sender!=winningProposal) throw;//判断获胜者身份
             uint winnerprize=votersNum*everyPrize;
             balances[msg.sender]+=winnerprize;    
	 }
	 
	 function() {
          throw; //Prevents accidental sending of ether
        }

}
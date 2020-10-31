import Vue from 'vue'
let state = {
	cartList: [
		{
				"count": 1,
				"selected": false,
		    "promId": 0,
		    "showPoints": false,
		    "itemTagList": [
		        {
		            "itemId": 1593000,
		            "tagId": 128111156,
		            "freshmanExclusive": false,
		            "name": "暖冬特惠",
		            "subType": 204,
		            "forbidJump": false,
		            "type": 2
		        }
		    ],
		    "rank": 1,
		    "id": 1593000,
		    "sellVolume": 3168,
		    "primaryPicUrl": "https://yanxuan-item.nosdn.127.net/59c9d23abdfdaac58ede7b3e70934817.png",
		    "soldOut": false,
		    "sortFlag": 0,
		    "commentCount": 0,
		    "onSaleTime": 1539929494550,
		    "picMode": 1,
		    "commentWithPicCount": 0,
		    "underShelf": false,
		    "status": 2,
		    "couponConflict": true,
		    "forbiddenBuy": false,
		    "promotionDesc": "暖冬特惠",
		    "limitedFlag": 204,
		    "pieceNum": 0,
		    "itemSizeTableDetailFlag": false,
		    "forbidExclusiveCal": false,
		    "rewardShareFlag": false,
		    "updateTime": 1575512503370,
		    "showCommentEntrance": true,
		    "pieceUnitDesc": "件",
		    "specialPromTag": "",
		    "counterPrice": 799,
		    "categoryL2Id": 0,
		    "retailPrice": 623,
		    "primarySkuPreSellPrice": 0,
		    "preLimitFlag": 0,
		    "itemPromValid": true,
		    "promTag": "暖冬特惠",
		    "source": 0,
		    "points": 0,
		    "primarySkuPreSellStatus": 0,
		    "extraServiceFlag": 0,
		    "flashPageLink": "",
		    "autoOnsaleTimeLeft": 0,
		    "innerData": {},
		    "saleCenterSkuId": 0,
		    "pointsStatus": 0,
		    "extraPrice": "",
		    "colorNum": 3,
		    "showTime": 0,
		    "autoOnsaleTime": 0,
		    "preemptionStatus": 1,
		    "isPreemption": 0,
		    "zcSearchFlag": false,
		    "name": "软糯似baby肌肤，男式高领纯小山羊绒衫",
		    "appExclusiveFlag": false,
		    "itemType": 1,
		    "listPicUrl": "https://yanxuan-item.nosdn.127.net/631f945255aad262ff1b9ce51662f74b.png",
		    "pointsPrice": 0,
		    "simpleDesc": "绒毛取自未满1岁的山羊羊羔",
		    "seoTitle": "",
		    "newItemFlag": false,
		    "buttonType": 0,
		    "primarySkuId": 1630007,
		    "displaySkuId": 1630008,
		    "productPlace": "",
		    "itemSizeTableFlag": false
		},
		{
				"count": 3,
				"selected": true,
		    "promId": 0,
		    "showPoints": false,
		    "itemTagList": [],
		    "rank": 1,
		    "id": 1652031,
		    "sellVolume": 5788,
		    "primaryPicUrl": "https://yanxuan-item.nosdn.127.net/672ca69739bd32dc4698834576682c3b.png",
		    "soldOut": false,
		    "sortFlag": 0,
		    "commentCount": 0,
		    "onSaleTime": 1537285774269,
		    "picMode": 1,
		    "commentWithPicCount": 0,
		    "underShelf": false,
		    "status": 2,
		    "couponConflict": false,
		    "forbiddenBuy": false,
		    "promotionDesc": "",
		    "limitedFlag": 0,
		    "pieceNum": 0,
		    "itemSizeTableDetailFlag": false,
		    "forbidExclusiveCal": false,
		    "rewardShareFlag": false,
		    "updateTime": 1576735794396,
		    "showCommentEntrance": true,
		    "pieceUnitDesc": "件",
		    "specialPromTag": "",
		    "categoryL2Id": 0,
		    "retailPrice": 349,
		    "primarySkuPreSellPrice": 0,
		    "preLimitFlag": 0,
		    "itemPromValid": true,
		    "source": 0,
		    "points": 0,
		    "primarySkuPreSellStatus": 0,
		    "extraServiceFlag": 0,
		    "flashPageLink": "",
		    "autoOnsaleTimeLeft": 0,
		    "innerData": {},
		    "saleCenterSkuId": 0,
		    "pointsStatus": 0,
		    "extraPrice": "",
		    "colorNum": 3,
		    "showTime": 0,
		    "autoOnsaleTime": 0,
		    "preemptionStatus": 1,
		    "isPreemption": 0,
		    "zcSearchFlag": false,
		    "name": "复古达人私藏单品，女式经典切尔西靴",
		    "appExclusiveFlag": false,
		    "itemType": 1,
		    "listPicUrl": "https://yanxuan-item.nosdn.127.net/bd1227d7260058bb0d58dc8d8f86468b.png",
		    "pointsPrice": 0,
		    "simpleDesc": "经典挚爱，百搭的不老款",
		    "seoTitle": "",
		    "newItemFlag": false,
		    "buttonType": 0,
		    "primarySkuId": 1707011,
		    "displaySkuId": 1707011,
		    "productPlace": "",
		    "itemSizeTableFlag": false
		}
	]
}
// 数据源在哪，操作数据的方法在哪
let mutations = {
	// 添加至购物车
	addShopMutation(state, shopDetail){
		/* 
		 思路： 
			1. 判断购物车中是否已有该商品
				1) 如果有，在原有商品的数量基础上累加1
				2) 如果没有，将当前商品的信息对象push到购物车数组cartList
		 
		 */
		//  判断购物车中是否已有该商品
		let shopItem = state.cartList.find(item => item.id === shopDetail.id);
		if(shopItem){ // 有
			shopItem.count += 1;
			console.log('vuex', shopItem.count)
		}else { // 没有
			// 非响应式
			// shopDetail.count = 1;
			// shopDetail.selected = true;
			
			// 响应式属性
			Vue.set(shopDetail, 'count', 1);
			Vue.set(shopDetail, 'selected', true);
			state.cartList.push(shopDetail)
		}
	},
	// 修改商品数量的mutation
	changeCountMutation(state, {isAdd, index}){
		// console.log('mutation:', isAdd, index)
		if(isAdd){ // 加
			state.cartList[index].count += 1;
		}else { // 减
			// 判断商品数量即将为零的时候操作
			if(state.cartList[index].count <= 1){
				// 询问用户
				wx.showModal({
					content:'你确认删除该商品吗？',
					success: (res) => {
						if(res.confirm){
							// 删除该商品
							state.cartList.splice(index, 1)
						}
					}
				})
			
			}else {
				state.cartList[index].count -= 1;
			}
			
		}
	},
	// 修改是否选中的状态
	changeSelecteMutation(state, {selected, index}){
		state.cartList[index].selected = selected;
	}
}

let actions = {
	
}

let getters = {
	
}


export default {
	state,
	mutations,
	actions,
	getters
}
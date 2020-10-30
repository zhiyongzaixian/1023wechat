<template>
	<view>
		<!-- 头部区域  -->
		<view class="header">
			<image class="logo" src="../../static/images/logo.png" mode=""></image>
			<view class="search">
				<text class="iconfont icon-sousuo"></text>
				<input type="text" placeholder="搜索商品" placeholder-class="placeholder"/>
			</view>
			<button class="userName">北方汉子</button>
		</view>
	
		<!-- 导航区域 -->
		<scroll-view class="navScroll" scroll-x="true" enable-flex>
			<view class="navItem" v-for="item in indexData.kingKongModule.kingKongList" :key='item.L1Id'>
				{{item.text}}
			</view>
		</scroll-view>
		
		<!-- <Child a=123></Child> -->
	</view>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import request from '../../utils/request.js'
	export default {
		data() {
			return {
				
			};
		},
		mounted() {
			// this.getIndexData();
			
			// 测试是否可以获取Vuex中store对象的状态数据
			// console.log(this.$store.state.indexModule.initData)
			
			// 耦合度： 关联性 开发中一定想办法降低耦合度，提高解耦性
			// this.$store.dispatch('getIndexDataAction');
			// console.log(this.$store.state.indexModule.indexData)
			
			// 分发action
			this.getIndexDataAction();
		},
		methods: {
			// ...mapActions({
			// 	this.属性名: 属性值(action)
			// })
			
			// var store = {
			// 	actions: {
			// 		getIndexDataAction(){
						
			// 		}
			// 	}
			// }
			
			// this.xx = store.actions.getIndexDataAction
			...mapActions({
				getIndexDataAction: 'getIndexDataAction'
			}),
			async getIndexData(){
				let indexData = await request('/getIndexData');
				this.indexData = indexData;
			}
		},
		computed: {
			...mapState({
				indexData: state => state.indexModule.indexData
			})
		}
	}
</script>

<style lang="stylus">
	/* 
		stylus: css预编译语言
			特点： 
				1. 省略大括号
				2. 省略冒泡，封号
				3. 支持样式层级缩进
				
	 */
	// .header {
	// 	display: flex;
	// }
	
	.header 
		display flex
		padding 10rpx 0
		.logo
			width 140rpx
			height 40upx
			margin 10rpx 30rpx
		.search
			position relative
			flex 1
			border 1rpx solid #eee
			height 60rpx
			box-sizing border-box
			.iconfont
				position absolute
				left 10rpx 
				top 15rpx
				font-size 30rpx
				
			input
				width 100%
				height 100%
				padding-left 50rpx
			.placeholder
				font-size 26rpx
				color #666
		.userName
			width 144rpx
			height 60rpx
			text-align center
			line-height 60rpx
			font-size 24rpx
			color #BB2C08
			padding 0 10rpx
			margin 0 10rpx
	.navScroll
		white-space nowrap
		.navItem
			display inline-block
			font-size 26rpx
			height 80rpx
			line-height 80rpx
			width 140rpx
			text-align center
			
			
			


.test
	font-size 0
</style>	
</style>

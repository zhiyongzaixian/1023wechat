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
			<view class="navItem">
				居家生活
			</view>
			<view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view><view class="navItem">
				居家生活
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
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

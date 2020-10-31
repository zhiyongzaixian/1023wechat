<template>
	<view class="cateGoryContainer">
		<!-- 头部搜索区域 -->
		<view class="header">
			<view class="search">搜索商品</view>
		</view>
		
		<!-- 内容区  -->
		<view class="contentContainer">
			<view class="leftContianer">
				<scroll-view scroll-y="true" class="leftScroll">
					<view class="navItem " :class="{active: navIndex === index}" @click="changeNavIndex(index)" v-for="(item, index) in cateGoryList" :key='item.id'>
						{{item.name}}
					</view>
				</scroll-view>
			</view>
			<view class="rightContianer">
				<scroll-view scroll-y="true" class="rightScroll">
					<view>222</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../utils/request.js'
	export default {
		data() {
			return {
				cateGoryList: [],
				navIndex: 0
			};
		},
		mounted() {
			this.getCateGoryData()
		},
		methods: {
			async getCateGoryData(){
				this.cateGoryList = await request('/getCateGoryData')
			},
			// 点击导航切换的回调
			changeNavIndex(navIndex){
				this.navIndex = navIndex
			}
		}
	}
</script>

<style lang="stylus">
	.cateGoryContainer
		.header
			border-bottom 1rpx solid #eee
			height 80rpx
			box-sizing border-box
			padding 10rpx 0
			.search
				width 96%
				height 60rpx
				line-height 60rpx
				text-align center
				font-size 26rpx
				margin 0 auto
				background #ededed
		.contentContainer
			display flex
			.leftContianer
				width 20%
				.leftScroll
					height calc(100vh - 80rpx)
					.navItem
						position relative
						text-align center
						height 80rpx
						line-height 80rpx
						font-size 26rpx
						&.active:before
							position absolute
							left 6rpx
							top 10rpx
							content ''
							width 2rpx
							height 60rpx
							background #BB2C08
			.rightContianer
				width 80%
				background #4CD964
				.rightScroll
					height calc(100vh - 80rpx)
</style>

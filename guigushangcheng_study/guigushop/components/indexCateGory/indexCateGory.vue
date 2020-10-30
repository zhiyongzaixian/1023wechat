<template>
	<view class="categoryList">
		<view class="cateGoryItem" v-for="item in indexData.categoryModule" :key='item.titlePicUrl'>
			<image class="titlePic" :src="item.titlePicUrl"></image>
			<scroll-view scroll-x="true" class="cateScroll">
				<view class="scrollItem" v-for="cateItem in item.itemList" :key='item.id'>
					<image :src="cateItem.showPicUrl" mode=""></image>
					<view>{{cateItem.name}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		computed: {
			...mapState({
				indexData: state => state.indexModule.indexData
			})
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cateGoryItem
		margin-top 20rpx
		.titlePic
			width 100%
			height 370rpx
		.cateScroll
			white-space nowrap
			.scrollItem
				width 200rpx
				display inline-block
				margin-right 20rpx
				vertical-align top
				image
					width 200rpx
					height 200rpx
					background #EEEEEE
				view
					white-space pre-wrap
					font-size 26rpx
					overflow hidden
					text-overflow ellipsis
					display -webkit-box
					-webkit-box-orient vertical
					-webkit-line-clamp 2
					
</style>

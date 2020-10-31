<template>
	<view class="cateListContainer">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="bannerItem in indexCateItem.category.bannerUrlList" :key='bannerItem'>
				<view class="swiper-item">
					<image :src="bannerItem" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
	
		<view class="common">{{indexCateItem.category.name}}</view>
		<view class="common">{{indexCateItem.category.frontDesc}}</view>
		<view class="shopList">
			<view class="shopItem" v-for="shopItem in indexCateItem.itemList" :key='shopItem.id' @click="toDetail(shopItem)">
				<image :src="shopItem.listPicUrl" mode=""></image>
				<view class="shopInfo">{{shopItem.name}}</view>
				<view class="price">$ {{shopItem.retailPrice}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../utils/request.js'
	export default {
		props: ['navId'],
		data(){
			return {
				indexCateList: []
			}
		},
		mounted() {
			this.getIndexCateList()
		},
		methods: {
			async getIndexCateList(){
				this.indexCateList = await request('/getIndexCateListData')
			},
			// 跳转至detail耶米阿尼
			toDetail(shopDetail){
				wx.navigateTo({
					url: '/pages/detail/detail?shopDetail=' + JSON.stringify(shopDetail)
				})
			}
		},
		computed: {
			indexCateItem(){
				return this.indexCateList.find(item => item.category.parentId === this.navId)
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cateListContainer
		swiper 
			width 100%
			height 370rpx
			.swiper-item
				width 100%
				height 100%
				image
					width 100%
					height 100%
		.shopList
			display flex
			flex-wrap wrap
			justify-content space-around
			&:after
				content ''
				width 345rpx
				height 0
			.shopItem
				width 345rpx
				image
					width 345rpx
					height 345rpx
				.shopInfo
					font-size 28rpx
				.price 
					color #BB2C08
					font-size 26rpx
		.common
			text-align center
			height 60rpx
			line-height 60rpx
			font-size 28rpx
</style>

<template>
	<view  class="recommendContainer">
		<!-- banner -->
		<swiper :indicator-dots="true">
			<swiper-item>
				<view class="swiper-item">
					<image src="https://yanxuan.nosdn.127.net/4f1de1521e9540a88528ce53b26b65a4.jpg?type=webp&imageView&quality=75&thumbnail=750x0" mode=""></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="https://yanxuan.nosdn.127.net/5a4d1ff8fab4576a03bad94dbf840268.jpg?type=webp&imageView&quality=75&thumbnail=750x0" mode=""></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="https://yanxuan.nosdn.127.net/4481bd2c1ae94819834e984901c07f39.jpg?type=webp&imageView&quality=75&thumbnail=750x0" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
	
		<!-- 三个图标 policyDescList 区域  -->
		<view class="policyDescList">
			<view class="policyItem" v-for="item in indexData.policyDescList" :key='item.desc'>
				<image :src="item.icon" mode=""></image>
				<text>{{item.desc}}</text>
			</view>
		</view>
		
		<!-- 10个图标kingKongList 区域  -->
		<view class="kingKongList" v-if="indexData.kingKongModule">
			<view class="kingKongItem" v-for="item in indexData.kingKongModule.kingKongList" :key='item.L1Id'>
				<image :src="item.picUrl" mode=""></image>
				<text>{{item.text}}</text>
			</view>
		</view>
		
		<IndexCateGory></IndexCateGory>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import IndexCateGory from '../indexCateGory/indexCateGory.vue'
	export default {
		components:{
			IndexCateGory
		},
		computed: {
			...mapState({
				indexData: state => state.indexModule.indexData
			})
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.recommendContainer
		swiper
			width 100%
			height 350rpx
			.swiper-item
				width 100%
				height 100%
				image
					width 100%
					height 100%
					
		.policyDescList
			display flex
			.policyItem
				flex 1
				text-align center
				image
					width 32rpx
					height 32rpx
					/* 设置纵向对其方式： 基于中间对齐 */
					vertical-align middle
					margin-right 20rpx
				text
					font-size 24rpx
					vertical-align middle
		.kingKongList
			display flex
			flex-wrap wrap
			.kingKongItem
				width 20%
				display flex
				flex-direction column
				align-items center
				image
					width 110rpx
					height 110rpx
					margin 10rpx 0
				text
					font-size 26rpx
			
</style>

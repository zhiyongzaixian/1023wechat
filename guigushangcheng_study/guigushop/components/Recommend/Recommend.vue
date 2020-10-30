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
	</view>
</template>

<script>
	export default {
		
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
</style>
